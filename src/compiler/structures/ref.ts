import { CodeBlockWriter, PropertyDeclaration } from 'ts-morph'

export type Ref = {
  name: string

  value?: string

  type?: string // can be inferred

  isReadonly: boolean
}

export function createRef(ref: PropertyDeclaration): Ref {
  const structure = ref.getStructure()

  const name = structure.name
  const value = structure.initializer as string | undefined
  const type = structure.type as string | undefined
  const isReadonly = !!structure.isReadonly

  return { name, value, type, isReadonly }
}

export function generateSimpleRef(ref: Ref, writer: CodeBlockWriter): CodeBlockWriter {
  return writer
    .write(`${ref.name} ()${ref.type ? `: ${ref.type}` : ''} `).inlineBlock(() => {
      writer.writeLine(`return this.$refs.${ref.name}${ref.type ? ` as ${ref.type}` : ''}`)
    })
    .write(',').newLine()
}

/**
 * @deprecated cache: false doesn't seem to work with `defineComponent`
 */
export function generateRef(ref: Ref, writer: CodeBlockWriter): CodeBlockWriter {
  return writer
    .write(`${ref.name}: `).inlineBlock(() => {
      writer
        .writeLine('cache: false,')
        .write(`get()${ref.type ? `: ${ref.type}` : ''} `).inlineBlock(() => {
          writer.writeLine(`return this.$refs.${ref.name}${ref.type ? ` as ${ref.type}` : ''}`)
        })
    })
    .write(',').newLine()
}
