import { CodeBlockWriter, GetAccessorDeclaration, GetAccessorDeclarationStructure } from 'ts-morph'
import { buildStatementDeclaration } from './method'

export type Computed = Omit<GetAccessorDeclarationStructure, 'kind'>

export function createComputed(computed: GetAccessorDeclaration): Computed {
  return computed.getStructure()
}

export function generateComputed(computed: Computed, writer: CodeBlockWriter): CodeBlockWriter {
  return writer
    .write(`${computed.name}()${computed.returnType ? `: ${computed.returnType} ` : ' '}`).inlineBlock(() => {
      (computed.statements as string[]).forEach(s => {
        buildStatementDeclaration(s, writer)
      })
    })
    .write(',').newLine()
}
