import {CodeBlockWriter, GetAccessorDeclaration, GetAccessorDeclarationStructure} from 'ts-morph'
import {buildStatementDeclaration} from './method'
import {buildComments} from './comments'

export type Computed = Omit<GetAccessorDeclarationStructure, 'kind'>

export function createComputed(computed: GetAccessorDeclaration): Computed {
  const structure: GetAccessorDeclarationStructure = getCommentedAccessor(computed)
  return structure
}

export function generateComputed(computed: Computed, writer: CodeBlockWriter): CodeBlockWriter {
  buildComments(computed, writer)

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

function getCommentedAccessor(computed: GetAccessorDeclaration): GetAccessorDeclarationStructure {
  const leadingComments = computed.getLeadingCommentRanges()
  const trailingComments = computed.getTrailingCommentRanges()
  const structure = computed.getStructure()
  const statements = computed.getStatementsWithComments()
  const stringStatements: string[] = []

  for (const s of statements) {
    const t = s.getTrailingCommentRanges()
      .map(cr => cr.getText())
      .filter(cr => cr !== '')
      .map(cr => ' '+cr)
    stringStatements.push(s.getText() + t.join(''))
  }

  structure.leadingTrivia = leadingComments.map(c => c.getText()).join('\n')
  structure.trailingTrivia = trailingComments.map(c => c.getText()).join('\n')
  structure.statements = stringStatements
  return structure
}
