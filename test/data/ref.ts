import { SyntaxKind, PropertyDeclaration, Project } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Ref } from '../../src/compiler/structures'


const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends mixins(MyMixin) {
  @Ref('myDiv')
  readonly refMyDiv!: HTMLDivElement

  @Ref('myOtherDiv')
  refMyOtherDiv!
}
`

const [myDiv, myOtherDiv] = new Project()
    .createSourceFile(DUMMY_TEST_FILE, TEST_CLASS_COMPONENT_CODE)
    .getDescendantsOfKind(SyntaxKind.PropertyDeclaration)

const myDivOptionsCode = 
`refMyDiv (): InstanceType<typeof HTMLDivElement> {
    return this.$refs.myDiv as InstanceType<typeof HTMLDivElement>
},
`

const refTestStructureMyDiv: TestCase<PropertyDeclaration, Ref> = {
  node: myDiv,
  code: myDivOptionsCode,
  structure: { name: 'refMyDiv', isReadonly: true, type: 'HTMLDivElement', value: undefined, key: 'myDiv' },
  description: 'should create ref from explicit declaration',
}

const myOtherDivOptionsCode = 
`refMyOtherDiv () {
    return this.$refs.myOtherDiv
},
`

const refTestStructureMyOtherDiv: TestCase<PropertyDeclaration, Ref> = {
  node: myOtherDiv,
  code: myOtherDivOptionsCode,
  structure: { name: 'refMyOtherDiv', isReadonly: false, type: undefined, value: undefined, key: 'myOtherDiv' },
  description: 'should create ref from implicit declaration',
}

export const REF_TEST_CASES = [
  refTestStructureMyDiv,
  refTestStructureMyOtherDiv,
] as const
