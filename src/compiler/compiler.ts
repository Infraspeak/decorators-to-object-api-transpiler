import { Project } from 'ts-morph'
import { SFCDescriptor } from 'vue-sfc-parser'
import { visitors } from './visitors'
import { generateOptionsSourceFile } from './code-generator'
import { buildSymbolTable, isEmpty } from './symbol-table'
import { ESLint } from 'eslint'
import { buildDefaultLinter, lintCode } from './linter'
import { DUMMY_INPUT_PROJECT_NAME } from '../utils'
import { cloneDeep } from 'lodash'
import { findAndReplaceRefAccesses } from './structures'

export type CompileOptions = {
  linter: ESLint
}

const defaultCompileOptions: CompileOptions = {
  linter: buildDefaultLinter(),
}

export async function compile(descriptor: SFCDescriptor, options?: CompileOptions): Promise<SFCDescriptor> {
  const compilerOptions = { ...defaultCompileOptions, ...options }

  const optionsDescriptor = cloneDeep(descriptor)

  if (optionsDescriptor.script === null || descriptor.script === null) {
    throw Error('No script tag found')
  }

  const sourceFile = new Project().createSourceFile(DUMMY_INPUT_PROJECT_NAME, descriptor.script.content)

  const symbolTable = buildSymbolTable(sourceFile, visitors)

  if (isEmpty(symbolTable)) {
    throw Error('No class found')
  }

  const optionsSyntaxProject = generateOptionsSourceFile(sourceFile, symbolTable)

  const optionSyntaxScript = optionsSyntaxProject.getText()

  if (options) {
    optionsDescriptor.script.content = await lintCode(compilerOptions.linter, optionSyntaxScript)
  } else {
    optionsDescriptor.script.content = optionSyntaxScript
  }

  findAndReplaceRefAccesses(optionsDescriptor, symbolTable.refs)

  return optionsDescriptor
}
