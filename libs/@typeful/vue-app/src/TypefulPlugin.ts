import CollectionsService from "@typeful/storage/CollectionsService";
import ValueTypes from "@typeful/types/ValueTypes";
import Registry from "@typeful/utils/Registry";
import { TypefulModule } from "@typeful/vue-app/AppModule";

type TypefulPluginOptions = {
  modules: { [name: string]: TypefulModule },
}

export default {
  install(vue: any, opts: TypefulPluginOptions) {
    const moduleRegistry = new Registry<TypefulModule>()
    const valueTypes = new ValueTypes()

    const collections = new CollectionsService()

    Object.entries(opts.modules).forEach(([name, module]) => {
      Object.entries(module.getCollections?.() || {})
        .forEach(([name, collection]) => collections.registry.put(name, collection))

      Object.entries(module.types || {}).forEach(([name, type]) => {
        valueTypes.registry.put(name, type)
      })

      moduleRegistry.put(name, module)
    })

    vue.provide('vtf-collections', collections)
    vue.provide('vtf-valueTypes', valueTypes)
  }
}
