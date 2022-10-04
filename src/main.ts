import {createApp} from 'vue'
import App from './modules/app/App.vue'

import './modules/app/sass/bdcApp.scss'
import './modules/app/sass/bdcBootstrap.scss'
import '../libs/@vtf/ui/src/sass/vtf-ui.scss'

import 'tippy.js/dist/tippy.css'

import VueTippy from "vue-tippy"
import I18nPlugin from "@i18n/I18nPlugin"
import {TypefulPlugin} from "@vtf-typeful"
import vueFormPlugin from '@typeful/vue-form/vueForm.plugin'

const i18nOptions = {
  initialDictionaries: [
    require("@/modules/app/localization/app.cs_CZ.json"),
    require("@/../libs/@vtf/collection/localization/collection.cs_CZ.json"),
    require("@/modules/auth/localization/auth.cs_CZ"),
    require("@/modules/bestiary/localization/bestiary.cs_CZ.json"),
    require("@/modules/bestiary-dachshund/localization/dachshund.cs_CZ.json"),
  ],
}

createApp(App)
  .use(VueTippy, {
    directive: 'tippy',
  })
  .use(I18nPlugin, i18nOptions)
  .use(TypefulPlugin, {
    modules: {
      i18n: require("@i18n/src/typeful/I18nModule").default,
      bestiary: require("@/modules/bestiary/typeful/BestiaryModule").default,
      dachshund: require("@/modules/bestiary-dachshund/typeful/DachshundModule").default,
    },
  })
  .use(vueFormPlugin)
  .use(require("./modules/app/router").default)
  .mount('body')
