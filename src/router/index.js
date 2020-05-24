import { createRouter, createWebHistory } from "vue-router";

import SuspenseSimple from "@/views/SuspenseSimple.vue";
import SuspenseRoute from "@/views/SuspenseRoute.vue";

const routes = [
  {
    path: "/",
    name: "SuspenseSimple",
    component: SuspenseSimple
  },
  {
    path: "/suspense-route",
    name: "SuspenseRoute",
    component: SuspenseRoute
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
