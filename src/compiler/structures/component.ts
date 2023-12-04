import {ClassDeclaration, CodeBlockWriter, Decorator, DecoratorStructure, SyntaxKind} from 'ts-morph'

export type Component = {
  name: string
  importedComponents: string[]
  decoratorStructure?: DecoratorStructure
}

export function createComponent(component: ClassDeclaration): Component {
  const structure = component.getStructure()
  const decorator = component.getFirstChildByKindOrThrow(SyntaxKind.Decorator)
  const decoratorStructure = getCommentedDecorator(decorator)

  const name = structure.name!
  const importedComponents = decoratorStructure.arguments ? decorator
    .getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .getText() // { \n              Component1,\n             Component2, \n        }
    .slice(1, -1) // \n              Component1,\n             Component2, \n
    .split(',') // ['\n              Component1', '\n             Component2', '\n        ',]
    .map(_ => _.trim()) // ['Component1', 'Component2', '']
    .filter(_ => !!_) // ['Component1', 'Component2']
    : [] as string[]

  return { name, importedComponents, decoratorStructure }
}

export function generateComponent(component: Component, writer: CodeBlockWriter): CodeBlockWriter {
  writer.writeLine(`name: '${component.name}',`)

  if (component.importedComponents.length !== 0) {
    writer.blankLine().write('components: ').inlineBlock(() => {
      component.importedComponents.forEach(c => writer.writeLine(`${c},`))
    })
      .write(',').newLine()
  }

  return writer
}

function getCommentedDecorator(decorator: Decorator): DecoratorStructure {
  const leadingComments = decorator.getLeadingCommentRanges()
  const trailingComments = decorator.getTrailingCommentRanges()
  const structure = decorator.getStructure()

  structure.leadingTrivia = leadingComments.map(c => c.getText()).join('\n')
  // this makes sure the comments are placed neatly above the decorator declaration
  structure.leadingTrivia = structure.leadingTrivia.concat('\n')
  structure.trailingTrivia = trailingComments.map(c => c.getText()).join('\n')
  return structure
}
