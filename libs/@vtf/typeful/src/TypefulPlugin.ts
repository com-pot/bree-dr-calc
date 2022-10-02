import {CollectionsService} from "@vtf-collection"
import TypefulModuleRegistry, {TypefulModule} from "./ModuleRegistry"
import TfFields from "@vtf-typeful/TfFields";


export const modules = TypefulModuleRegistry

type TypefulPluginOptions = {
  modules: { [name: string]: TypefulModule },
}

export default {
  install(vue: any, opts: TypefulPluginOptions) {
    const collections = new CollectionsService()
    const fields = new TfFields(collections)

    Object.entries(opts.modules).forEach(([name, module]) => {
      module.registerItemSources?.(collections)
      modules.set(name, module)
    })


    vue.provide('vtf-fields', fields)
    vue.provide('vtf-collections', collections)
  }
}
