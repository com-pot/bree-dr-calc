import ItemsSourceRegistry from "./services/ItemsSourceRegistry";

export type PropertyType = any

export type FieldObj<T extends object> = T & {
  type: string,
  label?: string,
  createValueLabel?: string | Function,
  [k: string]: any,
}
export type PreparedField<T extends object> = FieldObj<T> & {
  name: string,
}

export type TypefulModule = {
  types?: { [name: string]: PropertyType },
  registerItemSources?(registry: ItemsSourceRegistry): void,
  getPropertyType?: (type: string, variant?: string) => PropertyType,
}
