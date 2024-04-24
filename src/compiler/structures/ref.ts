import { CodeBlockWriter, PropertyDeclaration } from 'ts-morph'
import { SFCDescriptor } from 'vue-sfc-parser'

export type Ref = {
  name: string

  value?: string

  type?: string // can be inferred

  isReadonly: boolean

  key: string
}

function getRefMethodName (refName: string) {
  return `get${refName.charAt(0).toUpperCase() + refName.slice(1)}`
}

/**
 * Find all accesses to a ref and replace them by the ref method name. Example:
 * 
 * this.myRef -> this.getMyRef()
 */
export function findAndReplaceRefAccesses (descriptor: SFCDescriptor, refs: Ref[]) {
  refs.forEach((ref) => {
    // Capitalize first letter of ref.name
    const refMethodName = getRefMethodName(ref.name)

    // The method finds for `${ref.name}.` and not `${ref.name}` in order to avoid unexpected code changes...
    // This way we are sure that we are replacing only the ref accesses.
    if (descriptor?.script?.content) {
      descriptor.script.content = descriptor.script.content.replace(`${ref.name}.`, `${refMethodName}().`)
    }

    if (descriptor?.template?.content) {
      descriptor.template.content = descriptor.template.content.replace(`${ref.name}.`, `${refMethodName}().`)
    }
  })
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
  writer.write(`${getRefMethodName(ref.name)} ()`)

  if (ref.type) {
    writer.write(`: as InstanceType<typeof ${ref.type}> `)
  } else {
    writer.write(' ')
  }

  writer.inlineBlock(() => {
    writer.write(`return this.$refs.${ref.key}`)

    if (ref.type) {
      writer.write(` as InstanceType<typeof ${ref.type}>`)
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
