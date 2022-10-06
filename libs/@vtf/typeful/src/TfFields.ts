import { FieldRef } from "@typeful/model/Model";
import {CollectionsService} from "@vtf-collection";

export default class TfFields {
  constructor(private readonly collections: CollectionsService) {
  }

  public getDefaultValue(field: FieldRef): any | Promise<any> {
    const getFirstItemValue = ([item]: any[]) => item && item[field.ui?.valueKey || 'value']

    const options = field.schema.options
    if (Array.isArray(options)) {
      return getFirstItemValue(options)
    }
    if (options) {
      let source: string, filter: any
      if (typeof options === "string") {
        source = options
      } else {
        source = options.source
        filter = options.filter
      }

      const items = this.collections.fetchItems<any>(source, undefined, filter, undefined)

      if (items instanceof Promise) {
        return items.then(getFirstItemValue)
      }
      return getFirstItemValue(items)
    }

    if (field.schema.type === "number") {
      return 0
    }

    return undefined
  }
}
