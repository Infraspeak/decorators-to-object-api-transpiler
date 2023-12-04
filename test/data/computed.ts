import { GetAccessorDeclaration, Project, SyntaxKind } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Computed } from '../../src/compiler/structures'

const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends mixins(MyMixin) {
  get myDataOneUppercase () {
    return this.myDataOne.toUpperCase()
  }

  get literalReturnValue (): boolean {
    return !false
  }
}
`

const [myDataOneUppercaseGetter, literalReturnValueGetter] = new Project()
  .createSourceFile(DUMMY_TEST_FILE, TEST_CLASS_COMPONENT_CODE)
  .getChildrenOfKind(SyntaxKind.ClassDeclaration)
  .flatMap(_ => _.getChildrenOfKind(SyntaxKind.GetAccessor))

const myDataOneUppercaseOptionsCode =
`myDataOneUppercase(): TODO /** TODO: Add the missing return type. Otherwise, the build may fail. */{
    return this.myDataOne.toUpperCase()
},
`

const myDataOneUppercaseComputedTestCase: TestCase<GetAccessorDeclaration, Computed> = {
  node: myDataOneUppercaseGetter,
  code: myDataOneUppercaseOptionsCode,
  structure: { name: 'myDataOneUppercase', returnType: undefined, statements: ['return this.myDataOne.toUpperCase()'] },
  description: 'should create computed property from implicit getter',
}

const literalReturnValueOptionsCode =
`literalReturnValue(): boolean {
    return !false
},
`

const literalReturnValueComputedTestCase: TestCase<GetAccessorDeclaration, Computed> = {
  node: literalReturnValueGetter,
  code: literalReturnValueOptionsCode,
  structure: { name: 'literalReturnValue', returnType: 'boolean', statements: ['return !false'] },
  description: 'should create computed property from explicit getter',
}

export const COMPUTED_TEST_CASES = [
  myDataOneUppercaseComputedTestCase,
  literalReturnValueComputedTestCase,
] as const
