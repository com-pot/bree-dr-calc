import ModuleRegistry, {TypefulModule} from "./ModuleRegistry";

export type PropertyType = any

export type TypefulField = {
  type: string,
  label?: string,
  createValueLabel?: boolean | string | ((itemValue: any) => string),
  createItemLabel?: (item: any) => string
  [k: string]: any,
}
export type FieldObj<T extends TypefulField=TypefulField> = T
export type PreparedField<T extends TypefulField=TypefulField> = FieldObj<T> & {
  name: string,
}

export type SchemaField = {
  type: "schema",
  schema: TypefulSchema,
}

export type TypefulSchema = {
  [field: string]: TypefulField | SchemaField
}

export function transformModuleField<T extends TypefulField>(field: Readonly<FieldObj<T>>): FieldObj<T> {
  if (!field.type) {
    debugger
  }
  const moduleSeparator = field.type.indexOf(':')

  if (moduleSeparator === -1) {
    return {...field}
  }

  const moduleName = field.type.substring(0, moduleSeparator)
  const typeName = field.type.substring(moduleSeparator + 1)

  const module = ModuleRegistry.get(moduleName)
  if (!module) {
    throw new Error("No module " + moduleName)
  }

  const registeredType = getPropertyType(module, typeName)

  if (!registeredType) {
    throw new Error("No type " + field.type)
  }

  return {
    ...field,
    ...registeredType,
  }
}
export const isSchemaField = (o: any): o is SchemaField => typeof o === "object" && o.type === "schema"

function getPropertyType(module: TypefulModule, type: string): PropertyType {
  if (module.getPropertyType) {
    const variantSeparator = type.indexOf('.')
    const baseType = variantSeparator === -1 ? type : type.substring(0, variantSeparator)
    const typeVariant = variantSeparator === -1 ? undefined : type.substring(variantSeparator + 1)

    const result = module.getPropertyType(baseType, typeVariant)
    if (result) {
      return result
    }
  }

  return module.types && module.types[type]
}
