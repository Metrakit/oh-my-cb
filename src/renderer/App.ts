import Vue from 'vue';
var App = require('./App.vue').default

const app = new Vue({
  // router,
  render: h => h(App)
}).$mount('#app');
