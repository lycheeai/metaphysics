import { danger, fail } from "danger"

// Rule: encourage all new files to be TypeScript
const jsAppFiles = danger.git.created_files.filter(
  f => f.startsWith("src/") && f.endsWith(".js")
)

if (jsAppFiles.length) {
  const listed = danger.github.utils.fileLinks(jsAppFiles)
  fail(`Please use <code>*.ts</code> for new files. Found: ${listed}.`)
}
