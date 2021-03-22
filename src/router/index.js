import { createRouter, createWebHashHistory } from "vue-router";
import Main from "../views/Main.vue";
import Login from "../views/Login.vue";
import HistoryGifs from "../views/HistoryGifs.vue";
import HttpService from "@/services/httpService.js";
import UtilService from "@/services/utilService.js";

const routes = [
  {
    path: '/:searchedItem?/:gifsOffset?/:totalPages?',
    name: "main",
    component: Main,
    props: true,
    beforeEnter: (to, from, next) => {
      UtilService.moveToRoute(next);
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (HttpService.getIsAuth()) {
        next({
          path: '/'
        });
      } else {
        next(true)
      }
    }
  },
  {
    path: "/gifs-history",
    name: "historyGifs",
    component: HistoryGifs,
    beforeEnter: (to, from, next) => {
      UtilService.moveToRoute(next);
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;