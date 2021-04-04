import {Router} from "vue-router";
import appStore from "@/modules/app/store/appStore";
import i18n from "@/i18n";

const updateTitle = (pageTitle?: string) => {
  let title = appStore.state.appName

  if (pageTitle) {
    title += ' | ' + i18n.translate(pageTitle)
  }

  document.title = title
}

const register = (router: Router) => {
  router.afterEach((to) => {
    const title = to.meta.title as string | undefined
    updateTitle(title)
  })
}

export default {
  register,
}
