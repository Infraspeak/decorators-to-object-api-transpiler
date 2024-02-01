import {
  CodeBlockWriter,
  MethodDeclaration,
  MethodDeclarationStructure,
  OptionalKind,
  ParameterDeclarationStructure,
} from 'ts-morph'
import {buildComments} from './comments'

export type Method = Omit<MethodDeclarationStructure, 'kind'> & { bodyText: string }

export function createMethod(method: MethodDeclaration): Method {
  const structure = getCommentedMethod(method)

  return {
    ...structure,
    bodyText: method.getBodyText()!,
  }
}

export function generateMethod(method: Method, writer: CodeBlockWriter, includeComments = true): CodeBlockWriter {
  if (includeComments) {
    buildComments(method, writer)
  }

  return writer
    .write(buildMethodDeclaration(method)).inlineBlock(() => {
      writer.write(method.bodyText)
    })
    .write(',').newLine()
}

function buildMethodDeclaration(method: Method): string {
  const parameters = method.parameters?.map(buildMethodParameterDeclaration).join(', ')
  return `${method.isAsync ? 'async ' : ''}${method.name} (${parameters})${buildMethodReturnTypeDeclaration(method)} `
}

export function buildMethodParameterDeclaration({ name, type, initializer, hasQuestionToken }: OptionalKind<ParameterDeclarationStructure>): string {
  let declaration = name

  if (type) {
    if (hasQuestionToken) {
      declaration += '?'
    }

    declaration += `: ${type}`
  }

  if (initializer) {
    declaration += ` = ${initializer}`
  }

  return declaration
}

function buildMethodReturnTypeDeclaration(method: Method): string {
  return method.returnType ? `: ${method.returnType}` : ''
}

function getCommentedMethod(method: MethodDeclaration): MethodDeclarationStructure {
  const leadingComments = method.getLeadingCommentRanges()
  const trailingComments = method.getTrailingCommentRanges()
  const structure = method.getStructure()

  structure.leadingTrivia = leadingComments.map(c => c.getText()).join('\n')
  structure.trailingTrivia = trailingComments.map(c => c.getText()).join('\n')
  return structure as MethodDeclarationStructure
}
