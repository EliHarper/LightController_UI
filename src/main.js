import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import brightnessPlugin from "./MyPlugins/brightnessPlugin";
import Vuelidate from 'vuelidate';


Vue.config.productionTip = false
Vue.prototype.$axios = axios

// Filters, like pipes in Angular, simply format interpolated values:
Vue.filter('brightnessAsPercent', function (byteVal) {
    return ((byteVal / 255) * 100).toFixed() + "%";
})

Vue.use(brightnessPlugin)
Vue.use(Vuelidate)


new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')
