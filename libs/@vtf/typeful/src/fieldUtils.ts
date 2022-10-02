import {inject} from "vue"
import {useI18n} from "@i18n"
import {transformModuleField, FieldObj, PreparedField, TypefulField} from "@vtf-typeful/EntityModel"
import TfFields from "@vtf-typeful/TfFields";


type FieldCompositionOptions = {
  /**
   *  Create label from name
   *
   *  true or label prefix
   */
  createFieldLabel?: boolean | string,
}

export function getField<T extends TypefulField>(name: string, field: Readonly<FieldObj<T>>, opts?: FieldCompositionOptions): PreparedField<T> {
  const i18n = useI18n()!
  const preparedField = {
    name,
    ...transformModuleField<T>(field),
  }

  if (opts?.createFieldLabel && !field.label) {
    preparedField.label = (typeof opts.createFieldLabel === "string" ? opts.createFieldLabel : '') + name
  }
  if (preparedField.label) {
    preparedField.label = i18n.t(preparedField.label)
  }

  if (preparedField?.createValueLabel) {
    const getItemValue = (item: any) => item[preparedField?.valueKey || 'value']
    if (preparedField?.createValueLabel === true) {
      preparedField.createItemLabel = (item: any) => i18n.t(getItemValue(item)) || ''
    } else if (typeof preparedField.createValueLabel === "string") {
      const prefix = preparedField.createValueLabel
      preparedField.createItemLabel = (item: any) => i18n.t(prefix + getItemValue(item)) || ''
    }
  }

  return preparedField
}

export function getFields<T extends {[name: string]: FieldObj<any>}>(fields: T, opts?: FieldCompositionOptions): {[key in keyof T]: PreparedField<any>} {
  const preparedFields: any = {}
  Object.keys(fields).forEach((name) => preparedFields[name] = getField(name, fields[name], opts))

  return preparedFields
}

export const useFields = () => inject<TfFields>('vtf-fields')!
