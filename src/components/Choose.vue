<template>
  <v-container style="display: flex; justify-content: center;">
    <div id="container" class="pa-0">
      <Scene        
        v-for="scene in scenes"
        v-bind:key="scene.id"
        v-bind:title="scene.name"
        :scene="scene"></Scene>

       <Create 
        v-show="dialog" 
        :dialog="dialog"
        @set-dialog="setDialog"></Create>      

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn @click="createScene()" v-on="on" fixed dark fab bottom right color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Create scene</span>
      </v-tooltip>


      <!-- <v-footer fixed padless elevation="5"></v-footer> -->
    </div>
  </v-container>
</template>


<style scoped>
#container {
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 100vh;
  width: 80vw;
}

v-btn {
  justify-self: right;
}
</style>


<script>
import Scene from "./Scene";
import Create from "./Create";

export default {
  name: "Choose",

  components: {
    Scene,
    Create
  },

  data: () => {
    return {
      scenes: null,
      fab: true,
      transition: "slide-y-transition",
      dialog: false,
    };
  },
  mounted() {
    const axios = require("axios");
    axios
      .get("http://192.168.1.117:5000")
      .then(
        response =>
          (this.scenes = JSON.parse(JSON.stringify(response.data)))
      );
  },
  methods: {
    createScene() {
      this.dialog = true
      console.log("createScene")
    },

    setDialog(event, value) {
      console.log("boolyyy");
      this.dialog = value;
    },
  }
};
</script>
