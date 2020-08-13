import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRouter from "vue-router";

Vue.config.ignoredElements = [
  "a-scene",
  "a-entity",
  "a-camera",
  "a-box",
  "a-sphere",
  "a-cylinder",
  "a-plane",
  "a-sky",
];
Vue.config.productionTip = false;

Vue.use(VueRouter);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
