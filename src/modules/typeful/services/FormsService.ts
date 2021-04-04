import * as i18n from "@/i18n"

import {FieldObj, PreparedField, PropertyType, TypefulModule} from "../TypefulModule"
import TypefulModuleRegistry from "../services/TypefulModuleRegistry"

function transformModuleField<T extends object>(name: string, field: Readonly<FieldObj<T>>): PreparedField<T> {
  const moduleSeparator = field.type.indexOf(':')

  if (moduleSeparator === -1) {
    return {...field, name}
  }

  const moduleName = field.type.substring(0, moduleSeparator)
  const typeName = field.type.substring(moduleSeparator + 1)

  const module = TypefulModuleRegistry.get(moduleName)
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
    name,
  }
}

export function getField<T extends object>(name: string, field: Readonly<FieldObj<T>>, opts?: FieldCompositionOptions): PreparedField<T> {
  const preparedField = transformModuleField<T>(name, field)

  if (opts && opts.createFieldLabel && !field.label) {
    preparedField.label = (typeof opts.createFieldLabel === "string" ? opts.createFieldLabel : '') + name
  }
  if (preparedField.label) {
    preparedField.label = i18n.translate(preparedField.label)
  }

  if (preparedField && preparedField.createValueLabel) {
    if (typeof preparedField.createValueLabel === "string") {
      const prefix = preparedField.createValueLabel
      preparedField.createValueLabel = (value: any) => i18n.translate(prefix + value) || ''
    }
  }

  return preparedField
}

function getPropertyType(module: TypefulModule, type: string): PropertyType {
  if (module.getPropertyType) {
    const variantSeparator = type.indexOf('.')
    const baseType = variantSeparator === -1 ? type : type.substring(0, variantSeparator)
    const typeVariant = variantSeparator === -1 ? undefined : type.substring(variantSeparator + 1)

    return module.getPropertyType(baseType, typeVariant)
  }

  return module.types && module.types[type]
}

type FieldCompositionOptions = {
  /**
   *  Create label from name
   *
   *  true or label prefix
   */
  createFieldLabel?: boolean | string,
  createValueLabel?: string | ((value: any) => string),
}

export function getFields<T extends {[name: string]: FieldObj<any>}>(fields: T, opts?: FieldCompositionOptions): PreparedField<T> {
  const preparedFields: any = {}
  for (const name in fields) {
    preparedFields[name] = getField(name, fields[name], opts)
  }

  return preparedFields
}
