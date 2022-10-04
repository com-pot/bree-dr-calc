import {FilterOptions} from "./filtering";
import {SortOptions} from "./sorting";
import {Pagination} from "./pagination";
import { FieldPathRaw } from "@typeful/model/path/pathTypes";

export type CollectionRetrieveFn<T = any> = (
  filter?: FilterOptions,
  sort?: SortOptions,
  pagination?: Pagination
) => CollectionPortion<T> | Promise<CollectionPortion<T>>

export type CollectionEntry<T = any> = {
  retrieve: CollectionRetrieveFn<T>,
  searchParam?: FieldPathRaw,
}

export type CollectionPortion<T> = {
  items: T[],

  filter?: FilterOptions,
  sort?: SortOptions,
  pagination?: Pagination,
}
