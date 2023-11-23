import { Project, SourceFile, QuoteKind, ManipulationSettings, FormatCodeSettings, ts, TypeAliasDeclarationStructure, StructureKind, CodeBlockWriter, ImportDeclarationStructure } from 'ts-morph'
import { DUMMY_OUTPUT_PROJECT_NAME } from '../utils'
import { generateComponent, generateComputed, generateData, generateEmit, generateEmitValidator, generateMethod, generateMixin, generateProp, generateSimpleRef, generateWatch } from './structures'
import { hasComputed, hasData, hasEmits, hasHooks, hasMethods, hasMixins, hasProps, hasWatch, SymbolTable } from './symbol-table'

const manipulationSettings: Partial<ManipulationSettings> = {
  useTrailingCommas: true,
  quoteKind: QuoteKind.Single,
}

const formatCodeSettings: FormatCodeSettings = {
  // TODO get indentation level by fetching the class declaration's indentation level
  baseIndentSize: 0,
  semicolons: ts.SemicolonPreference.Remove,
  ensureNewLineAtEndOfFile: true,
  trimTrailingWhitespace: true,
  insertSpaceAfterCommaDelimiter: true,
  insertSpaceBeforeAndAfterBinaryOperators: true,
  insertSpaceBeforeFunctionParenthesis: true,
}

/**
 * This method generates a type declaration to be used as a return type of data () method, like so:
 * 
 * ```ts
 * type Data = {
 *    data1: number | null
 *    data2?: string
 *    readonly CONST_DATA: string
 * }
 * 
 * // ...
 * data(): Data {
 *    return {
 *        data1: 123,
 *        CONST_DATA: 'Something immutable'
 *    }
 * }
 * ```
 */
export function generateDataTypeDeclarationStructure(symbolTable: SymbolTable): TypeAliasDeclarationStructure {
  const typeEntries = symbolTable.data.map(d => `${d.isReadonly ? 'readonly ' : ''}${d.name}: ${d.type ?? 'any'}`)

  return {
    name: 'Data',
    kind: StructureKind.TypeAlias,
    type: (w: CodeBlockWriter) => {
      w.inlineBlock(() => {
        typeEntries.forEach(entry => {
          w.writeLine(entry)
        })
      })
    },
  }
}

export function generateImportDeclarationStructures(inputSource: SourceFile, symbolTable: SymbolTable): ImportDeclarationStructure[] {
  const vueImports: ImportDeclarationStructure[] = [
    {
      moduleSpecifier: 'vue',
      namedImports: ['defineComponent', 'ComponentPublicInstance'],
      kind: StructureKind.ImportDeclaration,
    },
  ]

  hasProps(symbolTable) && vueImports.push({
    moduleSpecifier: 'vue',
    namedImports: ['PropType'],
    kind: StructureKind.ImportDeclaration,
    isTypeOnly: true,
  })
  
  return [
    ...vueImports,
    ...inputSource.getImportDeclarations()
      .map(_ => _.getStructure())
      .filter(_ => _.moduleSpecifier !== 'vue-property-decorator'),
  ]
}

export function generateOptionsSourceFile(inputSource: SourceFile, symbolTable: SymbolTable): SourceFile {
  const outputSource = new Project({ manipulationSettings }).createSourceFile(DUMMY_OUTPUT_PROJECT_NAME)
  // add imports
  outputSource.addImportDeclarations(generateImportDeclarationStructures(inputSource, symbolTable))
  // add types
  outputSource.addTypeAliases(inputSource.getTypeAliases().map(_ => _.getStructure()))
  // add interfaces
  outputSource.addInterfaces(inputSource.getInterfaces().map(_ => _.getStructure()))
  // add enums
  outputSource.addEnums(inputSource.getEnums().map(_ => _.getStructure()))

  // add data types
  hasData(symbolTable) && outputSource.addTypeAlias(generateDataTypeDeclarationStructure(symbolTable))

  // Component
  outputSource.addExportAssignment({
    isExportEquals: false,
    expression: (w) => {
      w.write('defineComponent(').inlineBlock(() => {
        // name & imported components
        generateComponent(symbolTable.component!, w)
          .blankLine()
        // mixins
        if (hasMixins(symbolTable)) {
          w.write('mixins: [')
          symbolTable.mixins.forEach(m => generateMixin(m, w))
          w.write('],').newLine()
            .blankLine()
        }
        // props
        if (hasProps(symbolTable)) {
          w.write('props: ').inlineBlock(() => {
            symbolTable.props.forEach(p => generateProp(p, w))
          })
            .write(',').newLine()
            .blankLine()
        }
        // data
        if (hasData(symbolTable)) {
          w.write('data(): Data').inlineBlock(() => {
            w.write('return ').inlineBlock(() => {
              symbolTable.data.forEach(d => generateData(d, w))
            })
          })
            .write(',').newLine()
            .blankLine()
        }
        // lifecycle hooks
        if (hasHooks(symbolTable)) {
          symbolTable.hooks.forEach(h => generateMethod(h, w))
          w.blankLine()
        }
        // watch
        if (hasWatch(symbolTable)) {
          w.write('watch: ').inlineBlock(() => {
            symbolTable.watch.forEach(wt => generateWatch(wt, w))
          })
            .write(',').newLine()
            .blankLine()
        }
        // computed
        if (hasComputed(symbolTable)) {
          w.write('computed: ').inlineBlock(() => {
            symbolTable.getters.forEach(c => generateComputed(c, w))
            symbolTable.refs.forEach(r => generateSimpleRef(r, w))
          })
            .write(',').newLine()
            .blankLine()
        }
        // methods & emits
        if (hasMethods(symbolTable)) {
          w.write('methods: ').inlineBlock(() => {
            symbolTable.methods.forEach(m => generateMethod(m, w))
            symbolTable.emits.forEach(e => generateEmit(e, w))
            symbolTable.watch.forEach(({ handler }) => generateMethod(handler, w))
          })
            .write(',').newLine()
            .blankLine()
        }
        // emit declaration
        if (hasEmits(symbolTable)) {
          w.write('emits: ').inlineBlock(() => {
            symbolTable.emits.forEach(e => generateEmitValidator(e, w))
          })
        }
      })
        .write(')')
    },
  })

  outputSource.formatText(formatCodeSettings)

  return outputSource
}
