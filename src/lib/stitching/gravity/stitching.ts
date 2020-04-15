import { connectionFromArray } from "graphql-relay"
import gql from "lib/gql"
import { GraphQLSchema } from "graphql"

export const gravityStitchingEnvironment = (
  gravitySchema: GraphQLSchema & { transforms: any }
) => {
  return {
    // The SDL used to declare how to stitch an object
    extensionSchema: gql`
      extend type Me {
        secondFactors(kinds: [SecondFactorKind]): [SecondFactor]
      }

      extend type ViewingRoom {
        artworksConnection(
          first: Int
          last: Int
          after: String
          before: String
        ): ArtworkConnection
      }
    `,
    resolvers: {
      Me: {
        secondFactors: {
          resolve: (_parent, args, context, info) => {
            return info.mergeInfo.delegateToSchema({
              schema: gravitySchema,
              operation: "query",
              fieldName: "_unused_gravity_secondFactors",
              args: args,
              context,
              info,
            })
          },
        },
      },
      ViewingRoom: {
        artworksConnection: {
          fragment: gql`
            ... on ViewingRoom {
              artworkIDs
            }
          `,
          resolve: (parent, args, context, _info) => {
            return context
              .artworksLoader({ ids: parent.artworkIDs })
              .then(body => {
                console.log(body)
                return connectionFromArray(body, args)
              })
          },
        },
      },
    },
  }
}
