import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/beast-pairing',
    name: 'bestiary.Pairing',
    component: () => import('./views/Pairing.vue'),
  },
  {
    path: "/my-beasts",
    name: "bestiary.MyBeasts",
    component: () => import("./views/MyBeasts.vue"),
  },
  {
    path: '/beast/add',
    name: 'bestiary.NewBeast',
    component: () => import("./views/BeastDetail.vue"),
  },
  {
    path: "/beast/:beastId",
    name: "bestiary.BeastDetail",
    component: () => import("./views/BeastDetail.vue"),
    props: true,
  },
  {
    path: '/breeding-stations',
    name: 'bestiary.BreedingStationsIndex',
    component: () => import('./views/BreedingStationsIndex.vue'),
  },
]

export default routes
