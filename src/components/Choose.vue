<template>
  <v-container style="display: flex; justify-content: center;">
    <div id="container" class="pa-0">
      <!-- v-bind:scene.sync="scene" makes it so the "Scene" component can 
            update the scene variable we're passing here: -->
      <Scene
        v-for="scene in scenes"
        v-bind:key="scene.id"
        v-bind:scene.sync="scene"
        v-bind:activeScene.sync="activeScene"
        @load-scenes="loadScenes"
        @delete-item="deleteItem"
      ></Scene>

      <v-snackbar 
        v-model="deleteSnackbar"
        color="success" 
        :timeout="timeout">
        Successfully deleted {{ deleted }}
        <v-btn dark @click.native="deleteSnackbar = false">Close</v-btn>
      </v-snackbar>

      <Create
        v-show="dialog"
        v-bind:dialog.sync="dialog"
        :key="createKey"  
        @load-scenes="loadScenes">
      </Create>

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            @click.stop="createScene()"
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
  height: 100%;
  width: 80vw;
}

v-btn {
  justify-self: right;
}
</style>


<script>
import Scene from "./Scene";
import Create from "./Create";
import { fetchScenes, deleteScene } from "@/api/index.js";
import SceneProps from "../scene-properties/index";


export default {
  name: "Choose",

  components: {
    Scene,
    Create
  },

  data: () => {
    return {
      activeScene: '',
      createKey: 0,
      palletteKey: 0,
      deleteSnackbar: false,
      deleted: "",  
      dialog: false,
      fab: true,
      scenes: {},
      timeout: 2000,
      transition: "slide-y-transition"
    };
  },

  mounted() {
    this.loadScenes();
  },

  methods: {
    createScene() {
      this.rerenderCreate();
      this.dialog = true;
    },

    deleteItem(scene) {
      deleteScene(scene._id.$oid).then(response => {
        console.log(response);
        if (response.status == SceneProps.SUCCESS) {
          this.scenes.splice(this.scenes.indexOf(scene), 1);
          console.log("response.status == SUCCESS");
          this.deleted = scene.name;
          this.deleteSnackbar = true;
        }
      });
    },

    loadScenes() {
      console.log("Fetching: ")
      fetchScenes().then(response => {
        this.scenes = JSON.parse(JSON.stringify(response.data));
      }).then(console.log(this.scenes));
    },

    rerenderCreate() {
      this.createKey += 1;
    },

    setDialog(event, value) {
      this.dialog = value;
    }
  }
};
</script>
