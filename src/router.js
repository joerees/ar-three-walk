import Vue from "vue";
import VueRouter from "vue-router";
import Splash from "./components/Splash.vue";

const routes = [
  { path: "/", component: Splash, name: "Splash" },
  {
    path: "/walk",
    component: () => import("./components/Walker.vue"),
  },
  {
    path: "/aframe",
    component: () => import("./components/AFrame.vue"),
  },
];

export default new VueRouter({
  routes: routes,
  scrollBehavior() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          x: 0,
          y: 0,
        });
      }, 500);
    });
  },
});
