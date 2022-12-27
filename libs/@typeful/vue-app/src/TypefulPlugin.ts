import { diKeyModelRegistry } from "@typeful/model-vue/useModel";
import Model, { ModelContext, ModelSpecRaw } from "@typeful/model/Model";
import CollectionsService from "@typeful/storage/CollectionsService";
import ValueTypes from "@typeful/types/ValueTypes";
import Registry from "@typeful/utils/Registry";
import { TypefulModule } from "@typeful/vue-app/AppModule";
import { defaults } from "lodash";

type TypefulPluginOptions = {
  modules: { [name: string]: TypefulModule },
}

export default {
  install(vue: any, opts: TypefulPluginOptions) {
    const collections = new CollectionsService()

    const moduleRegistry = new Registry<TypefulModule>()
    const valueTypes = new ValueTypes(collections)
    const modelRegistry = new Registry<Model>()

    const modelSpecEntries: [string, ModelSpecRaw][] = []

    Object.entries(opts.modules).forEach(([name, module]) => {
      Object.entries(module.getCollections?.() || {})
        .forEach(([name, collection]) => collections.registry.put(name, collection))

      Object.entries(module.types || {}).forEach(([name, type]) => {
        valueTypes.registry.put(name, type)
      })

      Object.entries(module.models || {}).forEach(([modelName, specRaw]) => {

        // TODO: Consider using struct refs instead of injecting nested schema.
        if (specRaw.meta?.injectTo) {
          const iModel = modelSpecEntries.findIndex(([name]) => name === specRaw.meta?.injectTo)
          if (iModel === -1) {
            console.warn(`Could not extend '${specRaw.meta.injectTo}' by `, specRaw);
            return
          }
          const entry = modelSpecEntries[iModel][1]
          const overlappingKeys = Object.keys(specRaw.schema.properties || {})
            .filter((key) => entry.schema.properties?.[key])
          if (overlappingKeys.length) {
            console.warn(`Could not extend '${specRaw.meta.injectTo}' - overlapping keys: `, overlappingKeys);
            return
          }
          Object.assign(entry.schema.properties!, specRaw.schema.properties)
          console.log('Injected', specRaw);

          return
        }
        modelSpecEntries.push([`${name}.${modelName}`, specRaw])
      })

      moduleRegistry.put(name, module)
    })

    const modelCtx: ModelContext = {
      types: valueTypes,
    }
    modelSpecEntries.forEach(([defaultName, specRaw]) => {
      const model = new Model({
        ...specRaw,
        meta: defaults({}, specRaw.meta, { name: defaultName }),
      }, modelCtx)
      modelRegistry.put(model.spec.meta.name, model)
    })

    vue.provide('vtf-collections', collections)
    vue.provide('vtf-valueTypes', valueTypes)
    vue.provide(diKeyModelRegistry, modelRegistry)
  }
}
