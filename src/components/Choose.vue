<template>
  <v-container style="display: flex; justify-content: center;">
    <div id="container" class="pa-0">

      <v-container>
        <div class="ambi-container">
          <v-card 
          shaped
          elevation="6"
          class="ambi-card">
            <v-card-title class='ma-0 subby'>Ambilight</v-card-title>          
            <div class="ambi-icons">
              <v-icon @click="toggleAmbilight">settings_brightness</v-icon>
              <v-switch v-model="ambilightOn"></v-switch>
            </div>                
          </v-card>
          <div class="ambi-spacer"></div>
        </div>
      </v-container>
      
      <draggable class="scenes" v-model="dragScenes" @start="drag=true" @end="drag=false">
        <!-- v-bind:scene.sync="scene" makes it so the "Scene" component can 
              update the scene variable we're passing here: -->
        <Scene
          v-for="scene in scenes"
          v-bind:key="scene.index"
          v-bind:scene.sync="scene"
          v-bind:activeScene.sync="activeScene"
          @delete-item="deleteItem"
          @load-scenes="loadScenes"
          @toggle-ambilight="toggleAmbilight"
          draggable
          ripple
        ></Scene>
      </draggable>

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
        v-bind:scenes.sync="scenes"
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

.ambi-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;  
  
}

.ambi-container {
  display: flex;  
}

.ambi-icons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: max-content;
  padding-left: 16px;
}

/* .ambilight-row {
  display: flex;
  flex-direction: row;
  height: min-content;
} */

.ambi-spacer {
  flex: 5;
  width: max-content;
}

.subby {
  height: fit-content;
}

v-btn {
  justify-self: right;
}
</style>


<script>
import Create from "./Create";
import draggable from 'vuedraggable';
import { fetchScenes, deleteScene, putIndices, ambilightOn, ambilightOff } from "@/api/index.js";
import Scene from "./Scene";
import SceneProps from "../scene-properties/index";


export default {
  name: "Choose",

  components: {
    Create,
    draggable,
    Scene,
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

  computed: {
    dragScenes: {
      get: function() {
        return this.scenes;
      },
      set: async function(val) {
        await this.updateOrder(val);
        console.log('new this.scenes:');
        console.log(JSON.stringify(this.scenes));
      }
    },
    ambilightOn: {
      get: function() {
        return localStorage.ambilightOn == 'true';
      },
      set: function() {
        this.toggleAmbilight();
      }
    }
  },

  methods: {
    createScene() {
      this.rerenderCreate();
      this.dialog = true;
    },

    deleteItem(scene) {
      deleteScene(scene._id.$oid).then(response => {
        if (response.status == SceneProps.SUCCESS) {
          this.scenes.splice(this.scenes.indexOf(scene), 1);
          this.deleted = scene.name;
          this.deleteSnackbar = true;
        }
      });
    },

    updateOrder(newOrder) {
      // Set this.scenes to newOrder so the order is retained and checkIndices can be reused without
      //   adding in an unnecessary optional; the actual indices of those changed will mismatch:
      if (this.scenes.length === newOrder.length) {
        console.log('lengths are the same.')
        this.scenes = newOrder;
      }
      this.checkIndices();
    },

    checkIndices() {
      let scenesWithUpdatedIndices = [];
      Array.prototype.forEach.call(this.scenes, element => {
        let index = this.scenes.indexOf(element);
        if ((!element.index && element.index !== 0) || index !== element.index) { 
          element.index = index;
          scenesWithUpdatedIndices.push(element);
        }
      });

      if (scenesWithUpdatedIndices.length > 0) {
        putIndices(scenesWithUpdatedIndices).then(console.log(`putIndices: ${JSON.stringify(scenesWithUpdatedIndices)}`));
      }
    },

    async loadScenes() {
      await fetchScenes().then(response => {
        this.scenes = JSON.parse(JSON.stringify(response.data));
      });
      console.log(this.scenes);

      this.checkIndices();
    },

    rerenderCreate() {
      this.createKey += 1;
    },

    setDialog(event, value) {
      this.dialog = value;
    },

    toggleAmbilight() {
      if (localStorage.ambilightOn) {
        if (localStorage.ambilightOn == "true") {
          ambilightOff().then(response => {
            console.log(JSON.stringify(response));
          });
          localStorage.ambilightOn = "false";
          return;
        }                 
      }
      ambilightOn().then(response => {
          console.log(JSON.stringify(response));
      });
      localStorage.ambilightOn = "true";     
    }
  }
};
</script>
