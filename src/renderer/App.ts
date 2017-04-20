import Vue from "vue";
let App = require("./App.vue").default

const app = new Vue({
  render: h => h(App)
}).$mount("#app");
