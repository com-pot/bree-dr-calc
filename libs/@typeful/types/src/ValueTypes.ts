import { FieldRef } from "@typeful/model/Model";
import { Schema } from "@typeful/schema/Schema";
import CollectionsService from "@typeful/storage/CollectionsService";
import Registry from "@typeful/utils/Registry";

export default class ValueTypes {
  public readonly registry: Registry<any> = new Registry()

  public constructor(private readonly collections: CollectionsService) {

  }

  public getRefDefaultValue(field: FieldRef): unknown {
    if (field.schema.default) {
      return field.schema.default
    }

    let options = field.schema.options
    if (options && field.schema.multiple) {
      return []
    }
    if (options && !Array.isArray(options)) {
      if (!this.collections) {
        console.warn("Collections not available");
        return
      }

      let source: string, filter: any
      if (typeof options === "string") {
        source = options
      } else {
        source = options.source
        filter = options.filter
      }
      options = this.collections.getDefaultValue(source, filter)
    }
    if (Array.isArray(options)) {
      return getFirstItemValue(options, field)
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

const getFirstItemValue = ([item]: any[], field: FieldRef) => item && item[field.ui?.valueKey || 'value']
