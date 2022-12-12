import {CollectionController, CollectionRetrieveFn} from "./collection";
import { CollectionPage, PaginationConfig } from "@typeful/storage/collection/ListController";
import { SortController } from "@typeful/storage/collection/sorting";
import { FilteringController } from "@typeful/storage-vue/collection/filter";
import Registry from "@typeful/utils/Registry";


export default class CollectionsService {
  public readonly registry: Registry<CollectionController>

  constructor(registry?: Registry<CollectionController>) {
    this.registry = registry || new Registry()
  }

  public addCollection(name: string, retrieve: CollectionRetrieveFn, searchParam?: CollectionController['searchParam']): this {
    this.registry.put(name, {retrieve, searchParam})
    return this
  }

  public fetchItems<T>(sourceName: string, search?: string, filter?: FilteringController['value'], sort?: SortController['entries']): T[] | Promise<T[]> {
    const normalize = (result: CollectionPage<T> | T[]): T[] => {
      if (!result) {
        console.warn("No result on item source", sourceName)
        return []
      }
      if (Array.isArray(result)) {
        return result
      }

      return result.items
    }

    const result = this.fetchFromItemSource<T>(sourceName, search, filter, sort)

    if (result instanceof Promise) {
      return result.then(normalize)
    }

    return normalize(result.items)
  }

  public getDefaultValue(sourceName: string, filter?: FilteringController['value']) {
    console.warn("Default value in collections not implemented", sourceName, filter);
    return null

    // const items = this.collections.fetchItems<any>(source, undefined, filter, undefined)

    // if (items instanceof Promise) {
    //   return items.then(getFirstItemValue)
    // }
    // return getFirstItemValue(items)
  }

  public fetchCollection<T>(
    sourceName: string, search?: string,
    filter?: FilteringController['value'],
    sort?: SortController['entries'],
    pagination?: PaginationConfig
  ): CollectionPage<T> | Promise<CollectionPage<T>> {
    const normalize = (result: CollectionPage<T> | T[]): CollectionPage<T> => {
      if (!result) {
        console.warn("No result on item source", sourceName)
        return {items: []}
      }
      if (Array.isArray(result)) {
        return { items: result }
      }

      return result
    }

    const result = this.fetchFromItemSource<T>(sourceName, search, filter, sort, pagination)

    if (result instanceof Promise) {
      return result.then(normalize)
    }

    return normalize(result)
  }

  private fetchFromItemSource<T>(sourceName: string, search?: string, filter?: FilteringController['value'], sort?: SortController['entries'], pagination?: PaginationConfig) {
    const entry = this.registry.items.get(sourceName) as CollectionController<T>
    if (!entry) {
      throw new Error(`Items source '${sourceName}' does not exist`)
    }

    if (search) {
      if (entry.searchParam) {
        filter = filter?.slice() ?? []

        filter.push({
          prop: entry.searchParam,
          op: 'like',
          args: [search],
        })
      } else {
        console.warn("Search passed to an items collection without searchParam, sourceName: " + sourceName)
      }
    }

    return entry.retrieve(filter, sort, pagination)
  }
}
