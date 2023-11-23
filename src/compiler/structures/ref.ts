import { CodeBlockWriter, PropertyDeclaration } from 'ts-morph'

export type Ref = {
  name: string

  value?: string

  type?: string // can be inferred

  isReadonly: boolean

  key: string
}

export function createRef(ref: PropertyDeclaration): Ref {
  const structure = ref.getStructure()

  const decoratorArguments = ref.getDecorator('Ref')!.getArguments()

  if (decoratorArguments.length !== 1) {
    throw new Error(`@Ref decorator must have exactly 1 argument, found ${decoratorArguments.length}`)
  }

  const key = decoratorArguments[0].getText().slice(1, -1)
  const name = structure.name
  const value = structure.initializer as string | undefined
  const type = structure.type as string | undefined
  const isReadonly = !!structure.isReadonly

  return { key, name, value, type, isReadonly }
}

export function generateSimpleRef(ref: Ref, writer: CodeBlockWriter): CodeBlockWriter {
  writer.write(`${ref.name} ()`)

  if (ref.type) {
    writer.write(`: ComponentPublicInstance<${ref.type}>`)
  }

  writer.inlineBlock(() => {
    writer.write(`return this.$refs.${ref.key}`)

    if (ref.type) {
      writer.write(` as ComponentPublicInstance<${ref.type}>`)
      writer.write(` // If the ${ref.type} component is already in Option API, we must declare "as ComponentPublicInstance<typeof ${ref.type}>"`)
    }
  })

  writer.write(',').newLine()

  return writer
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
