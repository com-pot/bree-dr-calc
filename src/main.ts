import {createApp} from 'vue'
import App from './modules/app/App.vue'
import router from './modules/app/router'

import './modules/app/sass/bdcApp.scss'
import './modules/app/sass/bdcBootstrap.scss'

import 'tippy.js/dist/tippy.css'

import ItemsSourceRegistry from "@/modules/typeful/services/ItemsSourceRegistry"
import TypefulModuleRegistry from "@/modules/typeful/services/TypefulModuleRegistry"
import TippyDirective from "@/modules/app/directives/TippyDirective"

TypefulModuleRegistry.set('i18n', require("@/modules/i18n/typeful/I18nModule").default)
TypefulModuleRegistry.set("relation", require("@/modules/typeful/RelationModule").default)
TypefulModuleRegistry.set("bestiary", require("@/modules/bestiary/typeful/BestiaryModule").default)
TypefulModuleRegistry.set("dachshund", require("@/modules/bestiary-dachshund/typeful/DachshundModule").default)

TypefulModuleRegistry.forEach((module) => module.registerItemSources?.(ItemsSourceRegistry.singleInstance))

createApp(App)
  .directive('tippy', TippyDirective)
  .use(router)
  .mount('body')
