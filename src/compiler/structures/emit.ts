import {CodeBlockWriter, MethodDeclaration, MethodDeclarationStructure} from 'ts-morph'
import {buildMethodParameterDeclaration, buildStatementDeclaration, Method} from './method'
import {buildComments} from './comments'

export type Emit = Method & { event: string }

export function createEmit(emit: MethodDeclaration): Emit {
  const structure = getCommentedEmit(emit)
  const [decorator] = structure.decorators!

  const eventName = (decorator.arguments as string[])[0]
  const parameters = structure.parameters?.map(({ name }) => name)
  structure.returnType = structure.returnType ?? 'void'

  if (structure.statements) {
    const returnStatement = (structure.statements as (string | object)[])
        .filter(s => typeof s === 'string')
        .find(s => (s as string).includes('return '))
    if (returnStatement) {
      (structure.statements as (string | object)[]).pop()
    }
    (structure.statements as string[]).push(buildEmitStatement(eventName, parameters, returnStatement as string))
  } else {
    structure.statements = buildEmitStatement(eventName, parameters)
  }

  return {
    ...structure,
    event: eventName.slice(1, -1), // remove quotes: "'my-event'"" -> "my-event"
  }
}

function buildEmitStatement(eventName: string, parameters?: string[], returnStatement?: string) {
  // this.$emit(<event>, <return>, <parameters>)
  let emitStatement = `this.$emit(${eventName}`

  if (returnStatement) {
    emitStatement = `${emitStatement}, ${returnStatement.substring('return '.length)}`
  }

  if (parameters?.length !== 0) {
    emitStatement = `${emitStatement}, ${parameters!.join(', ')}`
  }

  return `${emitStatement})`
}

export function generateEmit(emit: Emit, writer: CodeBlockWriter): CodeBlockWriter {
  return writer
    .write(buildEmitMethodDeclaration(emit)).inlineBlock(() => {
      (emit.statements as string[]).forEach(s => {
        buildStatementDeclaration(s, writer)
      })
    })
    .write(',').newLine()
}

function getEmitPayload(emit: Emit): string {
  return emit.parameters?.map(buildMethodParameterDeclaration).join(', ') ?? ''
}

function buildEmitMethodDeclaration(emit: Emit, returnType?: string): string {
  return `${emit.name} (${getEmitPayload(emit)}): ${returnType ?? 'void'} ` // return type is always void by default
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

  const payload = getEmitPayload(emit)
  return writer.write(`'${(emit.event)}': (${payload}) => true`).write(',').newLine()
}

function getCommentedEmit(emit: MethodDeclaration): MethodDeclarationStructure {
  const leadingComments = emit.getLeadingCommentRanges()
  const trailingComments = emit.getTrailingCommentRanges()
  const structure = emit.getStructure()

  structure.leadingTrivia = leadingComments.map(c => c.getText()).join('\n')
  structure.trailingTrivia = trailingComments.map(c => c.getText()).join('\n')
  return structure as MethodDeclarationStructure
}
