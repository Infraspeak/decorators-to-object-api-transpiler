import { MethodDeclarationStructure, MethodDeclaration } from 'ts-morph'

const VUE_LIFE_CYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeUnmount',
  'unmounted',
  'destroyed',
  'beforeDestroy',
] as const

export type HookType = typeof VUE_LIFE_CYCLE_HOOKS[number]

export function isHookType(name: string): name is HookType {
  return VUE_LIFE_CYCLE_HOOKS.includes(name as HookType)
}

export type Hook = Omit<MethodDeclarationStructure, 'kind'> & { bodyText: string }

export function createHook(hook: MethodDeclaration): Hook {
  const structure = hook.getStructure() as MethodDeclarationStructure

  structure.returnType = structure.returnType ?? 'void'

  return {
    ...structure,
    bodyText: hook.getBodyText()!,
  }
}

// use the same functions as method.ts
