import SelectInput from "./inputs/Select.vue";
import BtnSelectInput from "./inputs/BtnSelect.vue";

import { FormKitNode } from "@formkit/core"

import { App, Component, inject } from "vue";

type InputRegistryEntry = {
  match: (attrs: Record<string, any>) => boolean,
  component?: Component,
  formkit?: {
    type?: string,
    plugins?: ((node: FormKitNode) => void)[],
  },
}
export type InputRegistry = {
  matchInput(attrs: Record<string, any>): InputRegistryEntry | null,
}
export function createInputRegistry(): InputRegistry {
  const entries: InputRegistryEntry[] = [
    {
      match: (attrs) => !!(attrs.options || attrs.enum) && attrs.appearance === 'buttons',
      formkit: {
        type: 'btnSelect',
      },
    },
    {
      match: (attrs) => !!(attrs.options || attrs.enum),
      formkit: {
        type: 'select',
      },
    },
    {
      match: (attrs) => attrs.type === 'string',
      formkit: {
        type: 'text',
      },
    },
    {
      match: (attrs) => attrs.type === 'integer',
      formkit: {
        type: 'number',
        plugins: [
          (node) => {
            node.hook.input((value, next) => next(Number(value)))
          },
        ],
      },
    },
  ]

  return {
    matchInput(attrs) {
      return entries.find((entry) => entry.match(attrs)) || null
    },
  }
}

export const injectionKey = '@typeful/vue-form.inputRegistry'
export const useInputRegistry = () => inject(injectionKey) as InputRegistry
export const provideInputRegistry = (app: App, inputRegistry: InputRegistry) => app.provide(injectionKey, inputRegistry)
