import { CodeBlockWriter, JSDocStructure, JSDocableNodeStructure } from 'ts-morph'

export function buildDocs(structure: JSDocableNodeStructure, writer: CodeBlockWriter): void {
  if (!structure.docs?.length) {
      return
  }

  const docsStructure = structure.docs[0] as JSDocStructure
  const docsDescription = docsStructure.description as string

  const lines = docsDescription
    .split('\n')
    .filter((line, index) => index !== 0 || line.trim().length > 0)

  writer.writeLine('/**')

  lines.forEach(line => {
    writer.writeLine(` * ${line}`)})
  
  writer.writeLine(' */')
}