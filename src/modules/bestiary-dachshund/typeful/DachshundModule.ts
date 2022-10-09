import fetchingCollection from "@typeful/storage/collection/controllers/fetchingCollection";
import { defineAppModule } from "@typeful/vue-app/AppModule";

export default defineAppModule({
  types: {
    sizeVariant: {
      type: "string",
      options: "dachshund:sizeVariant",
      ui: {itemPrefix: "dachshund.sizeVariant."}
    }
  },
  getCollections() {
    return [
      ['dachshund:sizeVariant', fetchingCollection('/api/dachshund/size-variant.json')],
      ['dachshund:coatType', fetchingCollection('/api/dachshund/coat-type.json')],
      ['dachshund:coatPaint', fetchingCollection('/api/dachshund/coat-paint.json')],
    ]
  },
})
