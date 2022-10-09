import {reactive} from "vue"
import { FieldPathRaw } from "@typeful/model/path/pathTypes"

import { FieldRef } from "@typeful/model/Model"


type FilterType = '=' | '~=' | '>' | '<' | '>=' | '<=' | 'in' | 'like'

export type FilterCondition<TArgs = any[]> = {
  prop: FieldPathRaw,
  op: FilterType,
  args?: TArgs,
  neg?: boolean,
}

export const createFiltering = (fields: FieldRef[]) => {
  const value = reactive([] as FilterCondition[])

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

export type FilteringController = ReturnType<typeof createFiltering>
