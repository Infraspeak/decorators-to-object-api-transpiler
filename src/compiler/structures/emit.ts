import {CodeBlockWriter, MethodDeclaration, MethodDeclarationStructure} from 'ts-morph'
import {Method} from './method'
import {buildComments} from './comments'

export type Emit = Method & {
  eventName: string,
  emitArguments: EmitArgument[],
}

export type EmitArgument = {
  name: string,
  type: string,
}

export function createEmit(emit: MethodDeclaration): Emit {
  const structure = getCommentedEmitStructure(emit)

  const [decorator] = structure.decorators!
  const [decoratorArgument] = decorator.arguments! as string[]
  
  const eventName = decoratorArgument.slice(1, -1)
  const emitArguments = getEmitArguments(structure)
  const bodyText = getBodyText(emit, eventName, emitArguments)

  structure.returnType = 'void'

  return {
    ...structure,
    eventName,
    emitArguments,
    bodyText,
  }
}

function getEmitArguments (structure: MethodDeclarationStructure): EmitArgument[] {
  const emitArguments: EmitArgument[] = []

  if(structure.returnType && structure.returnType !== 'void') {
    emitArguments.push({
      name: 'arg',
      type: structure.returnType as string,
    })
  }

  if (structure.parameters) {
    structure.parameters.forEach(({ name, type }) => {
      emitArguments.push({
        name,
        type: (type ?? 'any') as string,
      })
    })
  }

  return emitArguments
}

function getBodyText (methodDeclaration: MethodDeclaration, eventName: string, emitArguments: EmitArgument[]): string {
  const structure = methodDeclaration.getStructure() as MethodDeclarationStructure

  const returnStatements = (structure.statements as string[])
    .filter(s => typeof s === 'string')
    .filter(s => (s as string).includes('return '))

  if(returnStatements.length > 1) {
    throw new Error(`
      Multiple return statements found on '${methodDeclaration.getName()}' method.
      Cannot convert to Options API.
      Please refactor the original method in order to have
      a single return statement and try again.
    `)
  }

  const oldTextBody = methodDeclaration.getBodyText()!
  const emitStatement = getEmitStatement(eventName, emitArguments, returnStatements[0])

  let newTextBody = ''

  if (returnStatements[0]) {
    newTextBody = oldTextBody.substring(0, oldTextBody.indexOf('return ')) + emitStatement
  } else {
    newTextBody = emitStatement
  }

  return newTextBody
}

function getEmitStatement (eventName: string, emitArguments: EmitArgument[], returnStatement?: string): string {
  let emitStatement = `this.$emit('${eventName}'`

  emitArguments.forEach(({ name }, index) => {
    if (returnStatement && index === 0) {
      emitStatement += `, ${returnStatement.substring('return '.length)}`
    } else {
      emitStatement += `, ${name}`
    }
  })

  emitStatement += ')'

  return emitStatement
}

/**
 * defining custom events in vue 2: https://v2.vuejs.org/v2/guide/components-custom-events.html
 * defining custom events in vue 3: https://vuejs.org/guide/components/events.html
 *
 * TL;DR:
 * - Vue 2 recommends using kebab-case for custom event names.
 * - In Vue 3, using either camelCase or kebab-case for your custom event name does not limit its use in v-on. However, following JavaScript conventions, camelCase is more natural.
 *
 */
export function generateEmitValidator(emit: Emit, writer: CodeBlockWriter): CodeBlockWriter {
  buildComments(emit, writer)

  let emitValidatorArguments = ''

  emit.emitArguments.forEach(({ name, type }, index) => {
    emitValidatorArguments += `${name}: ${type}`

    if (index < emit.emitArguments.length - 1) {
      emitValidatorArguments += ', '
    }
  })

  return writer
    .write(`'${(emit.eventName)}': (${emitValidatorArguments}) => true`)
    .write(',')
    .newLine()
}

function getCommentedEmitStructure(emit: MethodDeclaration): MethodDeclarationStructure {
  const leadingComments = emit.getLeadingCommentRanges()
  const trailingComments = emit.getTrailingCommentRanges()
  const structure = emit.getStructure()

  structure.leadingTrivia = leadingComments.map(c => c.getText()).join('\n')
  structure.trailingTrivia = trailingComments.map(c => c.getText()).join('\n')
  return structure as MethodDeclarationStructure
}
