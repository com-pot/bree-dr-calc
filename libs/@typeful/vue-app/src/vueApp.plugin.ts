import authStore from "@/modules/auth/store/authStore";
import { App } from "vue";
import { Router } from "vue-router";
import { createLoadController, provideLoadController } from "./loadController";

export default {
  install(app: App, opts: {router: Router}) {
    const loadController = createLoadController()

    provideLoadController(loadController, app)

    opts.router.beforeEach((to, _, next) => {
      if (!to.meta.requireAuth || authStore.user.isLoggedIn) {
        next()
        return
      }

      console.warn("User not logged in, falling back", to.meta.requireAuth);
      next(to.meta.requireAuth.fallback)
    })

    app.use(opts.router)
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    requireAuth?: {
      fallback: RouteLocationRaw,
    },
  }
}
