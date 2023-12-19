import {CodeBlockWriter, Structure} from 'ts-morph'

export function buildComments(structure: Structure, writer: CodeBlockWriter): void {
  if(structure.leadingTrivia?.length) {
    writer.writeLine(fixIndent(structure.leadingTrivia.toString()))
  }

  if(structure.trailingTrivia?.length) {
    writer.writeLine(fixIndent(structure.trailingTrivia.toString()))
  }
}

/**
 * Trims lines except the first to align each initial * on the same column
 *
 * @param block to fix
 */
function fixIndent(block: string): string {
    return block.split('\n')
      .map(line => {
        if (line.startsWith('/**')) {
          return line
        }
        // trim all chars minus one until the first *
        return line.substring(line.indexOf('*') - 1)
    }).join('\n')
}
