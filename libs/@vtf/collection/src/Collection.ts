import { FieldPathRaw } from "@typeful/model/path/pathTypes";
import { SortController } from "@typeful/storage/collection/sorting";
import { FilteringController } from "@typeful/storage-vue/collection/filtering";
import { CollectionPage, PaginationConfig, PaginationResult } from "@typeful/storage/collection/ListController";

export type CollectionRetrieveFn<T = any> = (
  filter?: FilteringController['value'],
  sort?: SortController['entries'],
  pagination?: PaginationConfig
) => CollectionPage<T> | Promise<CollectionPage<T>>

export type CollectionEntry<T = any> = {
  retrieve: CollectionRetrieveFn<T>,
  searchParam?: FieldPathRaw,
}
