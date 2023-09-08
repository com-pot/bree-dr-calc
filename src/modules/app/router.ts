import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

import appRoutes from "./routes"
import authRoutes from "@/modules/auth/routes"
import bestiaryRoutes from "@/modules/bestiary/routes"

export function createAppRouter() {
  const routes: RouteRecordRaw[] = [
    ...appRoutes,
    ...authRoutes,
    ...bestiaryRoutes,
  ]

  return createRouter({
    history: createWebHistory(),
    routes
  })
}
