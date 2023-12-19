import { CodeBlockWriter } from 'ts-morph'
import { createComponent, createComputed, createData, createEmit, createMethod, createMixin, createProp, createWatch, generateComponent, generateComputed, generateData, generateMethod, generateMixin, generateProp, generateWatch, StructureType } from '../../src/compiler/structures'
import { COMPONENTS_TEST_CASES, COMPUTED_TEST_CASES, METHOD_TEST_CASES, PROP_TEST_CASES, DATA_TEST_CASES, EMIT_TEST_CASES, TestCase, HOOK_TEST_CASES, MIXIN_TEST_CASES, WATCH_TEST_CASES } from '../data'

describe('structures', () => {

  const runStructureTests = <N, S extends object>(
    name: StructureType,
    testCases: readonly TestCase<N, Partial<S>>[],
    createFunction: (node: N) => S,
    generateFunction: (structure: S, writer: CodeBlockWriter) => void,
  ): void => {
    describe(name, () => {
      describe(`create ${name}`, () => {
        it.each(testCases)('$description', ({ node, structure }) => {
          const createdComponent = createFunction(node)
          expect(createdComponent).toMatchObject(structure)
        })
      })
  
      describe(`generate ${name}`, () => {
        it.each(testCases)('$description', ({ node, code }) => {
          const writer = new CodeBlockWriter()
          const createdComponent = createFunction(node)
          generateFunction(createdComponent, writer)
  
          expect(writer.toString()).toBe(code)
        })
      })
    })
  }

  runStructureTests('component', COMPONENTS_TEST_CASES, createComponent, generateComponent)
  runStructureTests('computed', COMPUTED_TEST_CASES, createComputed, generateComputed)
  runStructureTests('data', DATA_TEST_CASES, createData, generateData)
  runStructureTests('emit', EMIT_TEST_CASES, createEmit, generateMethod)
  runStructureTests('hook', HOOK_TEST_CASES, createMethod, generateMethod)
  runStructureTests('method', METHOD_TEST_CASES, createMethod, generateMethod)
  runStructureTests('mixin', MIXIN_TEST_CASES, createMixin, generateMixin)
  runStructureTests('prop', PROP_TEST_CASES, createProp, generateProp)
  // runStructureTests('ref', REF_TEST_CASES, createRef, generateSimpleRef)
  runStructureTests('watch', WATCH_TEST_CASES, createWatch, generateWatch)
})
