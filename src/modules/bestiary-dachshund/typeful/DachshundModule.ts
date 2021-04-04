import {TypefulModule} from "@/modules/typeful/TypefulModule"
import fetchingItemsSource from "@/modules/typeful/utils/fetchingItemsSource"

const module: TypefulModule = {
  registerItemSources(registry) {
    registry.registerItemsSource('dachshund:coatType', fetchingItemsSource('/api/dachshund/coat-type.json'))
    registry.registerItemsSource('dachshund:coatPaint', fetchingItemsSource('/api/dachshund/coat-paint.json'))
  },
}

export default module
