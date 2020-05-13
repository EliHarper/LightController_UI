import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#673ab7',
        secondary: '#607d8b',
        accent: '#03a9f4',
        error: '#f44336',
        info: '#3f51b5',
        success: '#4caf50',
        warning: '#ffc107'
      },
    },
  },
});
