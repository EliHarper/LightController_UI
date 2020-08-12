import App from './App.vue';
import axios from 'axios';
import brightnessPlugin from "./MyPlugins/brightnessPlugin";
import vuedraggable from 'vuedraggable';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import vuetify from './plugins/vuetify';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';


Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(brightnessPlugin)
Vue.use(vuedraggable)
Vue.use(Vuelidate)


// Filters, like pipes in Angular, simply format interpolated values:
Vue.filter('brightnessAsPercent', function (byteVal) {
    return ((byteVal / 255) * 100).toFixed() + "%";
})

Vue.filter('brightnessToStore', function (pctVal) {
    return ((pctVal / 100) * 255)
})

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')
