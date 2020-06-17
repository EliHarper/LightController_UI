<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center izClickable">
        <v-img
          :src="require('./assets/acme-light.svg')"
          alt="Lights Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          width="100"
          @click="goHome()"
        />
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <component
      v-bind:is="dynamicComponent"
      v-bind:rememberDevice.sync="rememberDevice"
      class="tab"
      :getStartedParent="getStarted"
      >
      </component>
    </v-content>
  </v-app>
</template>

<style>
  @import 'assets/css/style.css';
</style>

<script>
import LandingPage from './components/LandingPage';
import Choose from './components/Choose';
import Create from './components/Create';
import Scene from './components/Scene';
import Pallette from './components/Pallette';
import SceneProps from './scene-properties/index';


export default {
  name: 'App',

  components: {
    Create,
    Choose,
    LandingPage,
    Pallette,
    Scene,
  },

  data() {
    return {
      dynamicComponent: SceneProps.LANDINGPAGE,
      rememberDevice: false
    }
  },

  mounted() {
    if (localStorage.rememberDevice) {
      this.rememberDevice = localStorage.rememberDevice;
      if (localStorage.rememberDevice == "true") {
        this.dynamicComponent = SceneProps.CHOOSE
      } else {
        this.dynamicComponent = SceneProps.LANDINGPAGE
      }
    } 
  },

  methods: {
    getStarted: function() {    
      this.persist();
      this.dynamicComponent = SceneProps.CHOOSE
    },

    goHome: function() {
      this.dynamicComponent = SceneProps.LANDINGPAGE
    },

    persist: function() {
      localStorage.rememberDevice = this.rememberDevice;
    }
  }
};
</script>
