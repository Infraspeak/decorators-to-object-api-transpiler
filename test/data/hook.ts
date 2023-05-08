import { MethodDeclaration, Project, SyntaxKind } from "ts-morph"
import { DUMMY_TEST_FILE, TestCase } from "."
import { Hook } from "../../src/compiler/structures"

const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends Vue {
    beforeCreate (): void {
        console.warn('beforeCreate')
    }

    created (): void {
        console.warn('created')
    }

    beforeMount (): void {
        console.warn('beforeMount')
    }

    mounted (): void {
        console.warn('mounted')
    }

    beforeUpdate (): void {
        console.warn('beforeUpdate')
    }

    updated (): void {
        this.refChild.method1(this.data4)
    }

    beforeDestroy (): void {
        console.warn('beforeDestroy')
    }

    destroyed (): void {
        console.warn('destroyed')
    }
}
`

const [ beforeCreateNode, createdNode, beforeMountNode, mountedNode, beforeUpdateNode, updatedNode, beforeDestroyNode, destroyedNode ] = new Project()
  .createSourceFile(DUMMY_TEST_FILE, TEST_CLASS_COMPONENT_CODE)
  .getDescendantsOfKind(SyntaxKind.MethodDeclaration)

const beforeCreateCode =
`beforeCreate (): void {
    console.warn('beforeCreate')
},
`
  
const beforeCreateTesCase: TestCase<MethodDeclaration, Hook> = {
  node: beforeCreateNode,
  code: beforeCreateCode,
  structure: {
    name: 'beforeCreate',
    statements: [`console.warn('beforeCreate')`],
    returnType: 'void',
    parameters: []
  },
  description: 'should generate beforeCreate hook'
}

const createdCode =
`created (): void {
    console.warn('created')
},
`
  
const createdTesCase: TestCase<MethodDeclaration, Hook> = {
  node: createdNode,
  code: createdCode,
  structure: {
    name: 'created',
    statements: [`console.warn('created')`],
    returnType: 'void',
    parameters: []
  },
  description: 'should generate created hook'
}

const beforeMountCode =
`beforeMount (): void {
    console.warn('beforeMount')
},
`
  
const beforeMountTesCase: TestCase<MethodDeclaration, Hook> = {
  node: beforeMountNode,
  code: beforeMountCode,
  structure: {
    name: 'beforeMount',
    statements: [`console.warn('beforeMount')`],
    returnType: 'void',
    parameters: []
  },
  description: 'should generate beforeMount hook'
}

const mountedCode =
`mounted (): void {
    console.warn('mounted')
},
`
  
const mountedTesCase: TestCase<MethodDeclaration, Hook> = {
  node: mountedNode,
  code: mountedCode,
  structure: {
    name: 'mounted',
    statements: [`console.warn('mounted')`],
    returnType: 'void',
    parameters: []
  },
  description: 'should generate mounted hook'
}

const beforeUpdateCode =
`beforeUpdate (): void {
    console.warn('beforeUpdate')
},
`
  
const beforeUpdateTestCase: TestCase<MethodDeclaration, Hook> = {
  node: beforeUpdateNode,
  code: beforeUpdateCode,
  structure: {
    name: 'beforeUpdate',
    statements: [`console.warn('beforeUpdate')`],
    returnType: 'void',
    parameters: []
  },
  description: 'should generate beforeUpdate hook'
}

const updatedCode =
`updated (): void {
    this.refChild.method1(this.data4)
},
`
  
const updatedTestCase: TestCase<MethodDeclaration, Hook> = {
  node: updatedNode,
  code: updatedCode,
  structure: {
    name: 'updated',
    statements: [`this.refChild.method1(this.data4)`],
    returnType: 'void',
    parameters: []
  },
  description: 'should generate updated hook'
}

const beforeDestroyCode =
`beforeDestroy (): void {
    console.warn('beforeDestroy')
},
`
  
const beforeDestroyTestCase: TestCase<MethodDeclaration, Hook> = {
  node: beforeDestroyNode,
  code: beforeDestroyCode,
  structure: {
    name: 'beforeDestroy',
    statements: [`console.warn('beforeDestroy')`],
    returnType: 'void',
    parameters: []
  },
  description: 'should generate beforeDestroy hook'
}

const destroyedCode =
`destroyed (): void {
    console.warn('destroyed')
},
`
  
const beforeDestroyCodeTestCase: TestCase<MethodDeclaration, Hook> = {
  node: destroyedNode,
  code: destroyedCode,
  structure: {
    name: 'destroyed',
    statements: [`console.warn('destroyed')`],
    returnType: 'void',
    parameters: []
  },
  description: 'should generate destroyed hook'
}

export const HOOK_TEST_CASES = [
  beforeCreateTesCase, createdTesCase,
  beforeMountTesCase, mountedTesCase,
  beforeUpdateTestCase, updatedTestCase,
  beforeDestroyTestCase, beforeDestroyCodeTestCase,
] as const