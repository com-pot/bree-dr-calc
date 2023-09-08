import {createApp} from 'vue'
import App from '@typeful/vue-app/App.vue'

import './modules/app/sass/bdcBootstrap.scss'
import './modules/app/sass/bdcApp.scss'

import 'tippy.js/dist/tippy.css'
import 'iconify-icon'

import VueTippy from "vue-tippy"
import I18nPlugin from "@typeful/vue-app/I18nPlugin"
import vueFormPlugin from '@typeful/vue-form/vueForm.plugin'
import TypefulPlugin from '@typeful/vue-app/TypefulPlugin'

import i18nModule from "@typeful/vue-app/i18n/I18nModule"
import bestiaryModule from "@/modules/bestiary/typeful/BestiaryModule"
import dachshundModule from "@/modules/bestiary-dachshund/typeful/DachshundModule"

import { createAppRouter } from "./modules/app/router"
import vueAppPlugin from '@typeful/vue-app/vueApp.plugin'

createApp(App)
  .use(vueAppPlugin, {
    router: createAppRouter(),
  })
  .use(VueTippy, {
    directive: 'tippy',
  })
  .use(I18nPlugin, {
    locales: ['cs_CZ'],
    staticModules: [
      {source: 'local', module: '@typeful/modules/storage', file: 'collection'},

      {source: 'local', module: 'modules/app', file: 'app'},
      {source: 'local', module: 'modules/auth', file: 'auth'},
      {source: 'local', module: 'modules/bestiary', file: 'bestiary'},
      {source: 'local', module: 'modules/bestiary-dachshund', file: 'dachshund'},
    ],
  })
  .use(TypefulPlugin, {
    modules: {
      i18n: i18nModule,
      '@com-pot/bestiary': bestiaryModule,
      '@com-pot/bestiary-dachshund': dachshundModule,
    },
  })
  .use(vueFormPlugin)
  .mount('body')
