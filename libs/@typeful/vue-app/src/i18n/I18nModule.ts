import fetchingCollection from "@typeful/storage/collection/controllers/fetchingCollection"
import { defineAppModule } from "@typeful/vue-app/AppModule"
import { codeToRegionalString } from "@typeful/vue-app/i18n"

export default defineAppModule({
  types: {
    country: {
      type: "select",
      options: "i18n:country",
    },
  },

  getCollections() {
    return {
      'i18n:country': fetchingCollection<CountryItem, string>('/api/i18n/countries.json', {
        priorityValues: ['CZ', 'SK', 'DE', 'PL', 'HU'],
        getValue: (country) => country.code,

        ui: {
          createLabel: (item: CountryItem) => item.code + ' - ' + codeToRegionalString(item.code),
        },
      }),
    }
  },
})


type CountryCode = string
export type CountryItem = { code: CountryCode }
