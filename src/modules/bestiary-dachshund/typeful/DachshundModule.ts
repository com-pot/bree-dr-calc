import fetchingCollection from "@typeful/storage/collection/controllers/fetchingCollection";
import localCollection from "@typeful/storage/collection/controllers/localCollection";
import { defineAppModule, stripSchemaModules } from "@typeful/vue-app/AppModule";

export default defineAppModule({
  models: stripSchemaModules(import.meta.glob("./*.schema.json", {eager: true, import: 'default'})),

  getCollections() {
    return {
      'dachshund:sizeVariant': fetchingCollection('/api/dachshund/size-variant.json', {
        ui: {
          createLabel: { prefix: 'dachshund.sizeVariant.' },
        },
      }),
      'dachshund:coatType': fetchingCollection('/api/dachshund/coat-type.json', {
        ui: {
          createLabel: { prefix: 'dachshund.coatType.' },
        },
      }),
      'dachshund:coatPaint': fetchingCollection('/api/dachshund/coat-paint.json', {
        ui: {
          createLabel: { prefix: 'dachshund.coatPaint.' },
        },
      }),
      'dachshund:geneticGrade': localCollection(() => [] as any[]),
      'dachshund:behaviorGrade': localCollection(() => [] as any[]),
      'dachshund:healthGrade': localCollection(() => [] as any[]),
    }
  },
})
