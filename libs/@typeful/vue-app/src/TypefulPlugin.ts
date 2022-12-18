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
    const moduleRegistry = new Registry<TypefulModule>()
    const valueTypes = new ValueTypes()
    const modelRegistry = new Registry<Model>()

    const collections = new CollectionsService()

    const modelSpecEntries: [string, ModelSpecRaw][] = []

    Object.entries(opts.modules).forEach(([name, module]) => {
      Object.entries(module.getCollections?.() || {})
        .forEach(([name, collection]) => collections.registry.put(name, collection))

      Object.entries(module.types || {}).forEach(([name, type]) => {
        valueTypes.registry.put(name, type)
      })

      Object.entries(module.models || {}).forEach(([modelName, specRaw]) => {
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
