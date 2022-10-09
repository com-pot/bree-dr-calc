import CollectionsService from "@typeful/storage/CollectionsService";
import Registry from "@typeful/utils/Registry";
import { TypefulModule } from "@typeful/vue-app/AppModule";

type TypefulPluginOptions = {
  modules: { [name: string]: TypefulModule },
}

export default {
  install(vue: any, opts: TypefulPluginOptions) {
    const moduleRegistry = new Registry<TypefulModule>()

    const collections = new CollectionsService()

    Object.entries(opts.modules).forEach(([name, module]) => {
      module.getCollections?.()
        ?.forEach(([name, collection]) => collections.registry.put(name, collection))

      moduleRegistry.put(name, module)
    })

    vue.provide('vtf-collections', collections)
  }
}
