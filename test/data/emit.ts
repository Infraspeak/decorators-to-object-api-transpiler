import { MethodDeclaration, Project, SyntaxKind } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Emit } from '../../src/compiler/structures'

const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends Vue {
  @Emit('my-event')
  emitMyEvent (): void {}

  @Emit('my-event-with-payload-param')
  emitMyEventWithPayloadParam (num: number): void {}

  @Emit('my-event-with-payload-return')
  emitMyEventWithPayloadReturn (num: number, myObject: MyObject): void {}
}
`

const [ emitMyEventNode, emitMyEventWithPayloadParamNode, emitMyEventWithPayloadReturnNode ] = new Project()
  .createSourceFile(DUMMY_TEST_FILE, TEST_CLASS_COMPONENT_CODE)
  .getDescendantsOfKind(SyntaxKind.MethodDeclaration)

const emitMyEventCode =
`emitMyEvent (): void {
    this.$emit('my-event')
},
`

const emitMyEventTestCase: TestCase<MethodDeclaration, Emit> = {
  node: emitMyEventNode,
  code: emitMyEventCode,
  structure: {
    name: 'emitMyEvent',
    eventName: 'my-event',
    returnType: 'void',
    emitArguments: [],
    bodyText: 'this.$emit(\'my-event\')',
  },
  description: 'should generate basic emit event with no params or return',
}

const emitMyEventWithPayloadParamCode = 
`emitMyEventWithPayloadParam (num: number): void {
    this.$emit('my-event-with-payload-param', num)
},
`

const emitMyEventWithPayloadParamTestCase: TestCase<MethodDeclaration, Emit> = {
  node: emitMyEventWithPayloadParamNode,
  code: emitMyEventWithPayloadParamCode,
  structure: {
    name: 'emitMyEventWithPayloadParam',
    returnType: 'void',
    eventName: 'my-event-with-payload-param',
    emitArguments: [
      { name: 'num', type: 'number' },
    ],
    bodyText: 'this.$emit(\'my-event-with-payload-param\', num)',
  },
  description: 'should generate emit event with params and no return',
}

const emitMyEventWithPayloadReturnCode = 
`emitMyEventWithPayloadReturn (num: number, myObject: MyObject): void {
    this.$emit('my-event-with-payload-return', num, myObject)
},
`

const emitMyEventWithPayloadReturnTestCase: TestCase<MethodDeclaration, Emit> = {
  node: emitMyEventWithPayloadReturnNode,
  code: emitMyEventWithPayloadReturnCode,
  structure: {
    name: 'emitMyEventWithPayloadReturn',
    eventName: 'my-event-with-payload-return',
    returnType: 'void',
    emitArguments: [
      { name: 'num', type: 'number' },
      { name: 'myObject', type: 'MyObject' },
    ],
    bodyText: 'this.$emit(\'my-event-with-payload-return\', num, myObject)',
  },
  description: 'should generate emit event with params or return',
}

export const EMIT_TEST_CASES = [
  emitMyEventTestCase,
  emitMyEventWithPayloadParamTestCase,
  emitMyEventWithPayloadReturnTestCase,
] as const
