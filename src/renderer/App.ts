import Vue from "vue";
import Router from "vue-router";

let App = require("./App.vue").default;

let Home = require("./components/Home.vue").default;
let Settings = require("./components/Settings.vue").default;

Vue.use(Router);

let router = new Router({
    routes: [{
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/settings",
        name: "settings",
        component: Settings
    }]
});

const app = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
