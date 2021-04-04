import {TypefulModule} from "@/modules/typeful/TypefulModule";
import fetchingItemsSource from "@/modules/typeful/utils/fetchingItemsSource";
import {codeToRegionalString} from "@/modules/i18n/utils/RegionalUtils";

type CountryItem = { code: string }

const module: TypefulModule = {
  types: {
    country: {
      type: "select",
      itemsSource: "i18n:country",
      valueKey: "code",
      createItemLabel: (item: CountryItem) => item.code + ' - ' + codeToRegionalString(item.code),
    },
  },
  registerItemSources(registry) {
    const priorityCountries = ['CZ', 'SK', 'DE', 'PL', 'HU']

    const countryItemsSource = fetchingItemsSource('/api/i18n/countries.json', {
      normalizeCollection(items: CountryItem[]) {
        const result = items.slice()
        const prioResult: any[] = []

        priorityCountries.forEach((prioCode) => {
          const index = result.findIndex((item) => item.code === prioCode)
          if (index === -1) {
            console.warn("Priority country not found", prioCode)
            return
          }
          prioResult.push(...result.splice(index, 1))
        })

        return prioResult.concat(result)
      }
    })

    registry.registerItemsSource('i18n:country', countryItemsSource)
  },
}

export default module
