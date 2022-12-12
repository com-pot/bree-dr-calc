import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/sign-in',
    name: 'auth.SignIn',
    component: () => import('./views/SignIn.vue'),
    meta: {
      title: {$t: 'auth.view.SignIn'},
      layoutMode: 'center',
    },
  },
  {
    path: '/auth-info',
    name: 'auth.AuthInfo',
    component: () => import('./views/AuthInfo.vue'),
    meta: {
      title: {$t: 'auth.view.AuthInfo'},
      requireAuth: { fallback: {name: 'auth.SignIn'} },
    },
  },
]

export default routes
