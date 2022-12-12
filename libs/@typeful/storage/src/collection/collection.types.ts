import { FieldPathRaw } from "@typeful/model/path/pathTypes";
import { SortController } from "@typeful/storage/collection/sorting";
import { FilteringController } from "@typeful/storage-vue/collection/filter";
import { CollectionPage, PaginationConfig } from "@typeful/storage/collection/ListController";

export type CollectionRetrieveFn<T = any> = (
  filter?: FilteringController['value'],
  sort?: SortController['entries'],
  pagination?: PaginationConfig
) => CollectionPage<T> | Promise<CollectionPage<T>>

export type CollectionController<TItem = any> = {
  retrieve: CollectionRetrieveFn<TItem>,
  searchParam?: FieldPathRaw,
}
