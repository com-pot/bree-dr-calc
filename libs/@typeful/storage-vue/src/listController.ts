import { reactive } from "vue";
import { FieldRef } from "@typeful/model/Model";
import asyncRef from "@typeful/vue-utils/asyncRef";
import { CollectionPage, PaginationConfig } from "@typeful/storage/collection/ListController";
import { SortController } from "@typeful/storage/collection/sorting";

import { createFiltering, FilteringController } from "./collection/filter"
import { createSorting, SortingConfig } from "./collection/sorting";

type ListControllerOptions<TItem = any> = {
  availableFields?: FieldRef[],

  sort?: SortingConfig,

  fetchItems: (filter: FilteringController['value'] | undefined, sort: SortController['entries'] | undefined, pagination: PaginationConfig | undefined) => CollectionPage<TItem> | Promise<CollectionPage<TItem>>
}
export function createListController<TItem = any>(opts: ListControllerOptions) {
  const filter = opts.availableFields && createFiltering(opts.availableFields)
  const sort = opts.availableFields && createSorting(opts.availableFields, opts.sort)
  const pagination = reactive<PaginationConfig>({
    page: 1,
    perPage: 10,
  })

  const data = asyncRef<CollectionPage<TItem>>()

  return {
    filter,
    pagination,
    sort,

    data,

    getTotalPages() {
      const pagination = data.ready && data.value.pagination
      if (!pagination) {
        return
      }

      return Math.ceil(pagination.totalItems / pagination.perPage)
    }
  }
}

export type ListController = ReturnType<typeof createListController>
