import { MethodDeclaration, Project, SyntaxKind } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Watch } from '../../src/compiler/structures'

const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends Vue {
  @Watch('data1')
  onData1Change (): void {
    this.data3++
  }

  @Watch('data2', { immediate: true, deep: true })
  onData2Change (newVal: string, oldVal: string): void {
    this.data3++
  }
}
`
const [ onData1ChangeNode, onData2ChangeNode ] = new Project()
  .createSourceFile(DUMMY_TEST_FILE,TEST_CLASS_COMPONENT_CODE)
  .getDescendantsOfKind(SyntaxKind.MethodDeclaration)


const onData1ChangeCode = 
`'data1': {
    handler: 'onData1Change',
},
`

const onData1ChangeTestCase: TestCase<MethodDeclaration, Watch> = {
  node: onData1ChangeNode,
  code: onData1ChangeCode,
  structure: {
    name: 'data1',
    handler: {
      name: 'onData1Change',
      parameters: [],
      returnType: 'void',
      bodyText: 'this.data3++',
    },
  },
  description: 'should create watch from method without parameters or options',
}

const onData2ChangeCode = 
`'data2': {
    handler: 'onData2Change',
    immediate: true,
    deep: true,
},
`

const onData2ChangeTestCase: TestCase<MethodDeclaration, Watch> = {
  node: onData2ChangeNode,
  code: onData2ChangeCode,
  structure: {
    name: 'data2',
    handler: {
      name: 'onData2Change',
      parameters: [{ name: 'newVal', type: 'string'}, { name: 'oldVal', type: 'string'}],
      returnType: 'void',
      bodyText: 'this.data3++',
    },
    immediate: true,
    deep: true,
  },
  description: 'should create watch from method with parameters and options',
}

export const WATCH_TEST_CASES = [
  onData1ChangeTestCase,
  onData2ChangeTestCase,
] as const