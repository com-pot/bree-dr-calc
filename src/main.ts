import {createApp} from 'vue'
import App from './modules/app/App.vue'

import './modules/app/sass/bdcApp.scss'
import './modules/app/sass/bdcBootstrap.scss'

import 'tippy.js/dist/tippy.css'

import VueTippy from "vue-tippy"
import I18nPlugin from "@i18n/I18nPlugin"
import vueFormPlugin from '@typeful/vue-form/vueForm.plugin'
import TypefulPlugin from '@typeful/vue-app/TypefulPlugin'

const i18nOptions = {
  initialDictionaries: [
    // import.meta.glob("@/modules/app/localization/app.cs_CZ.json", {eager: true})[0],
    // require("@typeful/storage/../localization/collection.cs_CZ.json"),
    // require("@/modules/auth/localization/auth.cs_CZ.json"),
    // require("@/modules/bestiary/localization/bestiary.cs_CZ.json"),
    // require("@/modules/bestiary-dachshund/localization/dachshund.cs_CZ.json"),
  ],
}

import i18nModule from "@i18n/typeful/I18nModule"
import bestiaryModule from "@/modules/bestiary/typeful/BestiaryModule"
import dachshundModule from "@/modules/bestiary-dachshund/typeful/DachshundModule"

import { createAppRouter } from "./modules/app/router"

createApp(App)
  .use(VueTippy, {
    directive: 'tippy',
  })
  .use(I18nPlugin, i18nOptions)
  .use(TypefulPlugin, {
    modules: {
      i18n: i18nModule,
      bestiary: bestiaryModule,
      dachshund: dachshundModule,
    },
  })
  .use(vueFormPlugin)
  .use(createAppRouter())
  .mount('body')
