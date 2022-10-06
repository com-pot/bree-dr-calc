import {CollectionsService} from "@vtf-collection"

type PropertyType = any

export type TypefulModule = {
  types?: { [name: string]: PropertyType },
  registerItemSources?(registry: CollectionsService): void,
}

export default new Map<string, TypefulModule>()
