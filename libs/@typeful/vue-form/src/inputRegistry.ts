import TextInput from "./inputs/Text.vue";
import NumberInput from "./inputs/Number.vue";
import SelectInput from "./inputs/Select.vue";
import BtnSelectInput from "./inputs/BtnSelect.vue";
import DateInput from "./inputs/Date.vue";
import { App, Component, inject } from "vue";

type InputRegistryEntry = {
  match: (attrs: Record<string, any>) => boolean,
  component: Component,
}
export type InputRegistry = {
  matchInput(attrs: Record<string, any>): Component | null,
}
export function createInputRegistry(): InputRegistry {
  const entries: InputRegistryEntry[] = [
    {
      match: (attrs) => !!(attrs.options || attrs.enum) && attrs.appearance === 'btn-group',
      component: BtnSelectInput,
    },
    {
      match: (attrs) => !!(attrs.options || attrs.enum),
      component: SelectInput,
    },
    {
      match: (attrs) => attrs.type === 'string',
      component: TextInput,
    },
    {
      match: (attrs) => attrs.type === 'number',
      component: NumberInput,
    },
    {
      match: (attrs) => attrs.type === 'date',
      component: DateInput,
    },
  ]

  return {
    matchInput(attrs) {
      const entry = entries.find((entry) => entry.match(attrs))
      return entry ? entry.component : null
    },
  }
}

export const injectionKey = '@typeful/vue-form.inputRegistry'
export const useInputRegistry = () => inject(injectionKey) as InputRegistry
export const provideInputRegistry = (app: App, inputRegistry: InputRegistry) => app.provide(injectionKey, inputRegistry)
