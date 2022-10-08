import {reactive} from "vue"

import { createPath, FieldPath, FieldPathRaw, pathToStr } from "@typeful/model/path/pathTypes";
import { FieldRef } from "@typeful/model/Model";
import { SortController as $SortController } from "@typeful/storage/collection/sorting";



export type SortingConfig = {
  toggleRemove: boolean,
  defaultSorting?: FieldRef['path'] | FieldPathRaw,
}

export const createSorting = (availableFields: FieldRef[], config?: SortingConfig) => {
  const sort = reactive({
    availableFields,
    value: [] as $SortController['entries'],

    toggleSort(prop: FieldPath | FieldPathRaw) {
      const propPath = ('strSafe' in prop) ? prop : createPath(...prop)

      const index = sort.value.findIndex(([path]) => pathToStr(path) === propPath.strSafe)
      if (index === -1) {
        sort.value.push([propPath, 'asc'])
        return
      }

      const sortEntry = sort.value[index];
      let newEntry: typeof sortEntry | null = null
      if (sortEntry[1] === 'asc') {
        newEntry = [sortEntry[0], 'desc']
      } else if (!config?.toggleRemove) {
        newEntry = [sortEntry[0], 'asc']
      }

      if (newEntry) {
        sort.value[index] = newEntry
      } else {
        sort.value.splice(index, 1)
      }
    },
    remove(i: number) {
      sort.value.splice(i, 1)
    },
    getFieldLabel(prop: FieldPathRaw) {
      const field = availableFields.find((f) => f.path.strSafe === pathToStr(prop))
      return field?.ui?.label ?? '---'
    },
  })

  if (config?.defaultSorting) {
    sort.toggleSort(config.defaultSorting)
  }

  return sort
}

export type SortController = ReturnType<typeof createSorting>
