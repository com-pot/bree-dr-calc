import {reactive} from "vue"
// import {useI18n} from "@i18n"

import {PropExpression} from "./expressions"
import {getField, TypefulSchema, walkSchema} from "@vtf-typeful";

type SortDirection = 'asc'|'desc'
export type SortOptions = [PropExpression, SortDirection][]

export type SortField = {
  prop: string,
  label: string,
}
type SortingConfig = {
  toggleRemove: boolean,
}

export const createSorting = (fields: SortField[], config?: SortingConfig) => {
  // const i18n = useI18n()
  const value = reactive([

  ] as SortOptions)

  return {
    fields,
    value,

    toggleSort(prop: string) {
      const index = value.findIndex((sort) => sort[0] === prop)
      if (index === -1) {
        value.push([prop, 'asc'])
        return
      }

      if (value[index][1] === 'asc') {
        value[index][1] = 'desc'
      } else if (!config?.toggleRemove) {
        value[index][1] = 'asc'
      } else {
        value.splice(index, 1)
      }
    },
    remove(i: number) {
      value.splice(i, 1)
    },
    getFieldLabel(prop: string) {
      const field = fields.find((f) => f.prop === prop)
      return field?.label ?? '---'
    },
  }
}

export const createSortingFromSchema = (schema: TypefulSchema, createFieldLabel: string, config?: SortingConfig) => {
  const fields: SortField[] = walkSchema(schema, (field, path) => ({
    prop: path,
    label: getField(path, field, {createFieldLabel}).label!,
  }))

  return createSorting(fields, config)
}

export type Sorting = ReturnType<typeof createSorting>
