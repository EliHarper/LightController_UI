<template>
  <v-container style="display: flex; justify-content: center;">
    <div id="container" class="pa-0">
      <Scene
        v-for="scene in scenes"
        v-bind:key="scene.id"
        v-bind:scene.sync="scene"
        @load-scenes="loadScenes"
      ></Scene>

      <Create
        v-show="dialog"
        :dialog="dialog"
        @set-dialog="setDialog"
        @load-scenes="loadScenes">
      </Create>

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            @click="createScene()"
            v-on="on"
            fixed
            dark
            fab
            bottom
            right
            color="primary"
            elevation="5"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Create scene</span>
      </v-tooltip>
    </div>
  </v-container>
</template>


<style scoped>
#container {
  display: flex;
  flex: 1;
  flex-direction: column;
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
import { fetchScenes } from "@/api/index.js";

export default {
  name: "Choose",

  components: {
    Scene,
    Create
  },

  data: () => {
    return {
      scenes: {},
      fab: true,
      transition: "slide-y-transition",
      dialog: false
    };
  },

  mounted() {
    this.loadScenes();
  },

  methods: {
    createScene() {
      this.dialog = true;
    },

    loadScenes() {
      fetchScenes().then(response => {
        this.scenes = JSON.parse(JSON.stringify(response.data));
      });
    },

    setDialog(event, value) {
      this.dialog = value;
    }
  }
};
</script>
