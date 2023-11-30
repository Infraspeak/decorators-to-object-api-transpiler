import { CodeBlockWriter, GetAccessorDeclaration, GetAccessorDeclarationStructure } from 'ts-morph'
import { buildStatementDeclaration } from './method'
import { buildDocs } from './docs'

export type Computed = Omit<GetAccessorDeclarationStructure, 'kind'>

export function createComputed(computed: GetAccessorDeclaration): Computed {
  return computed.getStructure()
}

export function generateComputed(computed: Computed, writer: CodeBlockWriter): CodeBlockWriter {
  buildDocs(computed, writer)

  writer.write(`${computed.name}()`)

  if (computed.returnType) {
    writer.write(`: ${computed.returnType} `)
  } else {
    writer.write(': TODO /** TODO: Add the missing return type. Otherwise, the build may fail. */')
  }
  
  writer.inlineBlock(() => {
    (computed.statements as string[]).forEach(s => {
      buildStatementDeclaration(s, writer)
    })
  })

  writer.write(',').newLine()

  return writer
}
