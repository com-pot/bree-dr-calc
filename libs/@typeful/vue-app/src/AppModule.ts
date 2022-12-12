import { CollectionController } from "@typeful/storage/collection"

type PropertyType = any

export type TypefulModule = {
  types?: Record<string, PropertyType>,
  getCollections?(): Record<string, CollectionController>,
}

export const defineAppModule = <T extends TypefulModule>(module: T) => module
