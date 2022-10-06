import {reactive} from "vue"
import { FieldPathRaw } from "@typeful/model/path/pathTypes"

import { FieldRef } from "@typeful/model/Model"


type FilterType = '=' | '~=' | '>' | '<' | '>=' | '<=' | 'in' | 'like'
export type FilterArgument = any[]

export type FilterCondition = {
  prop: FieldPathRaw,
  op: FilterType,
  args?: FilterArgument,
  neg?: boolean,
}

export type FilterOptions = FilterCondition[]

export const createFiltering = (fields: FieldRef[]) => {
  const value = reactive([] as FilterOptions)

  return {
    fields,
    value,

    addFilter(prop: FilterCondition['prop'], op: FilterType = '=', args?: FilterCondition['args']) {
      value.push({
        prop: prop,
        op,
        args,
      })
    },
    removeFilter(i: number) {
      value.splice(i, 1)
    },
    setFilterType(i: number, filterType: FilterType) {
      value[i].op = filterType
    },
    setArgs(i: number, args: any) {
      value[i].args = args
    },
    toggleNegation(i: number) {
      if (value[i].neg) {
        delete value[i].neg
      } else {
        value[i].neg = true
      }
    },
  }
}

export type Filtering = ReturnType<typeof createFiltering>
