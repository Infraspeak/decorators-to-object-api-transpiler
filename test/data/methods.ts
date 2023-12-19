import { DUMMY_TEST_FILE, TestCase } from '.'
import { Method } from '../../src/compiler/structures'
import { Project, SyntaxKind, MethodDeclaration } from 'ts-morph'

const METHOD_TEST_CLASS_COMPONENT_CODE = 
`export default class ExampleComponent extends mixins(MyMixin) {
  logSomething (something) {
    console.log(something)
  }

  doMath(a: number, b: number): number {
    return a + b
  }

  doSomethingWithRef() {
    this.myDiv.addEventListener('click', () => this.logSomething(this.doMath(1,1)))
  }

  emitAllTheThings (): void {
    this.emitMyEvent()
    this.emitMyEventWithPayloadParam(2)
    this.emitMyEventWithPayloadReturn(2)
  }
}
`

const [logSomethingNode, doMathNode, doSomethingWithRefNode, emitAllTheThingsNode, doSomethingAsyncNode] = new Project()
  .createSourceFile(DUMMY_TEST_FILE, METHOD_TEST_CLASS_COMPONENT_CODE)
  .getDescendantsOfKind(SyntaxKind.MethodDeclaration)

const logSomethingCode = 
`logSomething (something) {
    console.log(something)
},
`

const logSomethingMethodTestCase: TestCase<MethodDeclaration, Omit<Method, 'bodyText'>> = {
  node: logSomethingNode,
  code: logSomethingCode,
  structure: {
    name: 'logSomething',
    parameters: [{ name: 'something', type: undefined }],
    returnType: undefined,
  },
  description: 'should create method from implicit declaration',
}

const doMathCode = 
`doMath (a: number, b: number): number {
    return a + b
},
`

const doMathMethodTestCase: TestCase<MethodDeclaration, Omit<Method, 'bodyText'>> = {
  node: doMathNode,
  code: doMathCode,
  structure: {
    name: 'doMath',
    parameters: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
    ],
    returnType: 'number',
  },
  description: 'should create method from explicit declaration',
}

const doSomethingWithRefCode = 
`doSomethingWithRef () {
    this.myDiv.addEventListener('click', () => this.logSomething(this.doMath(1,1)))
},
`

const doSomethingWithRefMethodTestCase: TestCase<MethodDeclaration, Omit<Method, 'bodyText'>> = {
  node: doSomethingWithRefNode,
  code: doSomethingWithRefCode,
  structure: {
    name: 'doSomethingWithRef',
    parameters: [],
    returnType: undefined,
  },
  description: 'should create method from implicit declaration',
}

const emitAllTheThingsCode = 
`emitAllTheThings (): void {
    this.emitMyEvent()
    this.emitMyEventWithPayloadParam(2)
    this.emitMyEventWithPayloadReturn(2)
},
`

const emitAllTheThingsMethodTestCase: TestCase<MethodDeclaration, Omit<Method, 'bodyText'>> = {
  node: emitAllTheThingsNode,
  code: emitAllTheThingsCode,
  structure: {
    name: 'emitAllTheThings',
    parameters: [],
    returnType: 'void',
  },
  description: 'should create method from implicit declaration',
}

export const METHOD_TEST_CASES = [
  logSomethingMethodTestCase,
  doMathMethodTestCase,
  doSomethingWithRefMethodTestCase,
  emitAllTheThingsMethodTestCase,
] as const
