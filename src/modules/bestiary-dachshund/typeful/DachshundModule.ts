import {TypefulModule} from "@/modules/typeful/TypefulModule"
import fetchingItemsSource from "@/modules/typeful/utils/fetchingItemsSource"

const module: TypefulModule = {
  types: {
    sizeVariant: {
      type: "select",
      itemsSource: "dachshund:sizeVariant",
      createValueLabel: "dachshund.sizeVariant.",
    }
  },
  registerItemSources(registry) {
    registry.registerItemsSource('dachshund:sizeVariant', fetchingItemsSource('/api/dachshund/size-variant.json'))
    registry.registerItemsSource('dachshund:coatType', fetchingItemsSource('/api/dachshund/coat-type.json'))
    registry.registerItemsSource('dachshund:coatPaint', fetchingItemsSource('/api/dachshund/coat-paint.json'))
  },
}

export default module
