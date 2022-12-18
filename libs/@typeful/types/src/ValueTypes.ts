import { FieldRef } from "@typeful/model/Model";
import { Schema } from "@typeful/schema/Schema";
import Registry from "@typeful/utils/Registry";

export default class ValueTypes {
  public readonly registry: Registry<any> = new Registry()

  public getRefDefaultValue(field: FieldRef): any {
    if (field.schema.default) {
      return field.schema.default
    }

    const getFirstItemValue = ([item]: any[]) => item && item[field.ui?.valueKey || 'value']

    const options = field.schema.options
    if (Array.isArray(options)) {
      return getFirstItemValue(options)
    }

    if (options) {
      console.warn("getRefDefaultValue not implemented for ", field);
      // let source: string, filter: any
      // if (typeof options === "string") {
      //   source = options
      // } else {
      //   source = options.source
      //   filter = options.filter
      // }
      // return this.collections.getDefaultValue(source, filter)
    }

    return this.getDefaultValue(field.schema)
  }

  public getDefaultValue(schema: Schema): any {
    if (schema.default) {
      return schema.default
    }

    if (schema.type === "string") {
      return ""
    }
    if (schema.type === "number") {
      return 0
    }
    if (schema.type === 'boolean') {
      return false
    }

    return null
  }

  public setDefaults(schema: Schema, target?: any): any {
    if (schema.type === "object") {
      if (!target) {
        target = {}
      }

      Object.entries(schema.properties || {}).forEach(([name, subShema]) => {
        target[name] = this.setDefaults(target[name], subShema)
      })
    }
    if (schema.type === "array") {
      const list: any[] = target ?? []

      list.forEach((value: any, i) => {
        list[i] = this.setDefaults(schema.items, value)
      })

      return list
    }

    return target ?? this.getDefaultValue(schema)
  }
}
