import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/beast-pairing',
    name: 'bestiary.Pairing',
    component: () => import('./views/Pairing.vue'),
    meta: {
      title: {$t: 'bestiary.view.Pairing'},
    },
  },
  {
    path: "/my-beasts",
    name: "bestiary.MyBeasts",
    component: () => import("./views/MyBeasts.vue"),
    meta: {
      title: {$t: 'bestiary.view.MyBeasts'},
    },
  },
  {
    path: '/beast/add',
    name: 'bestiary.NewBeast',
    component: () => import("./views/BeastDetail.vue"),
    meta: {
      title: {$t: 'bestiary.view.BeastDetail.new'},
    },
  },
  {
    path: "/beast/:beastId",
    name: "bestiary.BeastDetail",
    component: () => import("./views/BeastDetail.vue"),
    props: true,
    meta: {
      title: {$t: 'bestiary.view.BeastDetail'},
    },
  },
  {
    path: '/breeding-stations',
    name: 'bestiary.BreedingStationsIndex',
    component: () => import('./views/BreedingStationsIndex.vue'),
    meta: {
      title: {$t: 'bestiary.view.BreedingStationsIndex'},
    },
  },
]

export default routes
