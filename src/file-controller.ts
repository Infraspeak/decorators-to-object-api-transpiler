import { readFileSync, writeFileSync } from 'fs'
import { parseComponent, SFCDescriptor } from 'vue-sfc-parser'
import { logger } from './logger'

export interface VueComponent {
  descriptor: SFCDescriptor,
  filepath: string,
}

export function buildVueComponent(filepath: string): VueComponent | undefined {
  const fileContent = readFileSync(filepath).toString()
  const descriptor = parseComponent(fileContent)

  if (!descriptor.script?.content) {
    logger.warn(`Vue component ${filepath} does not contain script`)
    return
  }

  return { filepath, descriptor }
}

function buildVueFileContent(component: VueComponent): string {
  const { template, script, styles } = component.descriptor

  let content = ''
  if (template) content += `<template>${template.content}</template>\n`
  if (script) content += `\n<script lang="${script.lang ?? 'ts'}">\n${script.content}</script>\n`
  if (styles.length !== 0) content += `\n<style lang="${styles[0].lang ?? 'scss'}">${styles.map(_ => _.content)}</style>\n`

  return content
}

export function writeVueComponent(component: VueComponent): VueComponent {
  const filepath = [
    ...component.filepath.split('.').slice(0, -1),
    'vue',
  ].join('.')

  writeFileSync(filepath, buildVueFileContent(component))

  return { ...component, filepath }
}
