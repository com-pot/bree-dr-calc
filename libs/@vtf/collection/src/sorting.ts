import {reactive} from "vue"

import { createPath, FieldPath, FieldPathRaw, pathToStr } from "@typeful/model/path/pathTypes";
import ModelAccessor from "@typeful/model/ModelAccessor";
import { FieldRef } from "@typeful/model/TypefulModel";

type SortDirection = 'asc'|'desc'
export type SortOptions = [FieldPath, SortDirection][]

type SortingConfig = {
  toggleRemove: boolean,
  defaultSorting: FieldRef['path'],
}

export const createSorting = (fields: FieldRef[], config?: SortingConfig) => {
  const value = reactive([] as SortOptions)

  const sort = {
    fields,
    value,

    toggleSort(prop: FieldPath | FieldPathRaw) {
      const propPath = ('strSafe' in prop) ? prop : createPath(...prop)

      const index = value.findIndex((sort) => sort[0].strSafe === propPath.strSafe)
      if (index === -1) {
        value.push([propPath, 'asc'])
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
    getFieldLabel(prop: FieldPathRaw) {
      const field = fields.find((f) => f.path.strSafe === pathToStr(prop))
      return field?.ui?.label ?? '---'
    },
  }

  if (config?.defaultSorting) {
    sort.toggleSort(config.defaultSorting)
  }

  return sort
}

export const createSortingFromSchema = (model: ModelAccessor, config?: SortingConfig) => {
  return createSorting(model.locate().fields('all'), config)
}

export type Sorting = ReturnType<typeof createSorting>
