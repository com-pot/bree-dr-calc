import { ModelSpecRaw } from "@typeful/model/Model"
import { CollectionController } from "@typeful/storage/collection"

type PropertyType = any

export type TypefulModule = {
  models?: Record<string, ModelSpecRaw>
  types?: Record<string, PropertyType>,
  getCollections?(): Record<string, CollectionController>,
}

export const defineAppModule = <T extends TypefulModule>(module: T) => module

export function stripSchemaModules<T extends object>(files: T) {
  const entries = Object.entries(files)
    .map(([name, spec]) => {
      const i = name.indexOf('.schema.json')
      const newName = name.substring('./'.length, i)

      return [newName, {schema: {...spec}}]
    })

  return Object.fromEntries(entries)
}
