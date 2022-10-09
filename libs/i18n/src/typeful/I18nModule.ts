import { defineAppModule } from "@typeful/vue-app/AppModule"
import { codeToRegionalString } from "../RegionalUtils"

import * as countries from "./countries"

export default defineAppModule({
  types: {
    country: {
      type: "select",
      options: "i18n:country",
      valueKey: "code",

      ui: {
        itemLabelTemplate: (item: countries.CountryItem) => item.code + ' - ' + codeToRegionalString(item.code),
      },
    },
  },

  getCollections() {
    return [
      ['i18n:country', countries.createCollection({
        priorityCountries: ['CZ', 'SK', 'DE', 'PL', 'HU'],
      })],
    ]
  },
})
