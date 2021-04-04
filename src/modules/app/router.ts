import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

import appRoutes from "./routes"
import authRoutes from "@/modules/auth/routes"
import bestiaryRoutes from "@/modules/bestiary/routes"

import routeTitleUpdating from "@/modules/app/routeTitleUpdating";

const routes: RouteRecordRaw[] = [
  ...appRoutes,
  ...authRoutes,
  ...bestiaryRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

routeTitleUpdating.register(router)

export default router
