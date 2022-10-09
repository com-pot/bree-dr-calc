import orderBy from "lodash/orderBy"

import {matchFilterFn} from "./localCollection/filter"
import { PaginationResult } from "libs/@typeful/storage/src/collection/ListController"
import { CollectionController } from "../collection.types"

export default function localCollection<T, TOut=T>(getItems: () => T[], transformItem?: (i: T) => TOut): CollectionController<TOut> {
  return {
    retrieve: ((filter, sort, pagination) => {
      let items = getItems()
      if (filter) {
        items = items.filter(matchFilterFn(filter))
      }

      if (sort) {
        const iteratees = sort.map((s) => s[0])
        const orders = sort.map((s) => s[1])
        items = orderBy(items, iteratees, orders) as T[]
      }

      const perPage = pagination?.perPage || 20
      const paginationRes: PaginationResult = {
        page: pagination?.page || 1,
        perPage,
        totalItems: items.length,
      }

      const start = (paginationRes.page - 1) * perPage
      items = items.slice(start, start + perPage)

      const itemsOut: TOut[] = transformItem ? items.map(transformItem) : items as unknown as TOut[]

      return {
        items: itemsOut,
        filter: filter,
        sort: sort,
        pagination: paginationRes,
      }
    })
  }
}
