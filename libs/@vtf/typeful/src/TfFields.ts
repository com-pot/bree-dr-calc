import {CollectionsService} from "@vtf-collection";
import {PreparedField} from "@vtf-typeful/EntityModel";

export default class TfFields {
  constructor(private readonly collections: CollectionsService) {
  }

  public getDefaultValue(field: PreparedField): any | Promise<any> {
    const getFirstItemValue = ([item]: any[]) => item && item[field.valueKey || 'value']

    if (field.options) {
      return getFirstItemValue(field.options)
    }

    if (field.itemsSource) {
      const items = this.collections.fetchItems<any>(field.itemsSource, undefined, field.itemFilter, undefined)

      if (items instanceof Promise) {
        return items.then(getFirstItemValue)
      }
      return getFirstItemValue(items)
    }

    if (field.type === "number") {
      return 0
    }

    return undefined
  }
}
