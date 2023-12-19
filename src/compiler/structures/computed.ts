import {CodeBlockWriter, GetAccessorDeclaration, GetAccessorDeclarationStructure} from 'ts-morph'
import {buildComments} from './comments'

export type Computed = Omit<GetAccessorDeclarationStructure, 'kind'> & { bodyText: string }

export function createComputed(computed: GetAccessorDeclaration): Computed {
  const structure: GetAccessorDeclarationStructure = getCommentedAccessor(computed)
  return {
    ...structure,
    bodyText: computed.getBodyText()!,
  }
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
    writer.write(computed.bodyText)
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
