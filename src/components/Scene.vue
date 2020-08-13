<template>
  <v-container>
    <transition name="fade">
      <v-card
        shaped
        v-if="show"
        id="v-card"
        :style="cardStyles"
        class="pa-0 izClickable"
        elevation="6"
      >
        <v-card-text id="v-card-text" class="pa-0">
          <div id="scene" @click="apply()">
            <h2>{{scene.name}}</h2>
            <ul>
              <li>Colors: {{scene.colors}}</li>
              <li>Function Call: {{scene.functionCall}}</li>
              <li v-if="scene.animation">Animation: {{scene.animation}}
              <li>Default brightness: {{scene.defaultBrightness | brightnessAsPercent }}</li>
            </ul>
          </div>

          <div v-if="isActive" class="off">
            <v-btn @click="turnOff()">Turn off</v-btn>
          </div>          

          <div class="icon-container">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-card-actions class="edit">
                  <v-icon @click="editIt()" v-on="on" large>edit</v-icon>
                </v-card-actions>
              </template>
              <span>Edit {{scene.name}}</span>
            </v-tooltip>

            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-card-actions class="delete">
                  <v-icon @click="deleteIt()" v-on="on" large>delete</v-icon>
                </v-card-actions>
              </template>
              <span>Delete {{scene.name}}</span>
            </v-tooltip>
          </div>

        </v-card-text>
      </v-card>      
    </transition>

    <div v-if="isActive" class="brightness">
      <v-subheader>Brightness</v-subheader>
      <v-slider
        v-model="newBrightness"
        :max="100"
        :min="0"
        append-icon="wb_sunny"
        prepend-icon="wb_iridescent"
        class="bright-slider"
        @change="setBrightness"
        ></v-slider> 
    </div>

    <Edit
      v-bind:dialog.sync="editDialog"
      v-bind:scene.sync="scene"
      :key="editKey"
      @load-scenes="loadScenes"
      @set-scene="setScene"
      class="Edit"
    ></Edit>

    <v-snackbar :timeout="timeout" color="success" v-model="editSnackbar">
      Successfully updated {{ scene.name }}
      <v-btn dark @click.native="editSnackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>


<style scoped>
@import "../assets/css/style.css";

.brightness {  
  display: flex;
  flex-direction: column;
  justify-content: center;  
  height: fit-content;
  width: 100%;
  z-index: -1;
}

.Edit {
  width: 100%;
}

h2 {
  padding-bottom: 0.5em;
}

.icon-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.off {
  display: flex;
  align-items: flex-end;
  top: -5px;
}

#scene {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 1em;
  width: inherit;
  height: fit-content;
}

#v-card,
#v-card-text {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
}
</style>


<script>
import { applyScene, lightsOff, editScene, updateBrightness } from "@/api/index.js";
import Edit from "./Edit";
import SceneProps from "../scene-properties/index";

export default {
  name: "Scene",

  components: {
    Edit
  },

  props: [
    "scene",
    "activeScene"
  ],

  data: () => {
    return {      
      editSnackbar: false,
      timeout: 2000,
      show: true,
      /* editKey allows a forced re-render when the drawer is reopened (so it
          doesn't keep any unsaved changes) */
      editKey: 0,
      editDialog: false,
      updatedBrightness: false,
      newBrightness: 50
    };
  },

  computed: {
    cardStyles() {
      if (this.scene.colors.length > 1) {
        let gradient = this.createGradient();

        return {
          "background-image": gradient
        };
      }
      return {
        "background-color": this.scene.colors[0]
      };
    },
    isActive () {
      if (this.activeScene == this.scene._id.$oid) {
        return true;
      } else {
        return false;
      }
    }
  },

  mounted: function() {
    this.$nextTick(function () {
      console.log('mounted; pre-conversion brightness:')
      console.log(this.scene.defaultBrightness)
      this.newBrightness = this.$options.filters.brightnessAsPercent(this.scene.defaultBrightness);
      console.log('post-conversion brightness:')
      console.log(this.newBrightness)
    })
  },

  methods: {
    apply() {
      applyScene(this.scene._id.$oid);      
      console.log(this.scene)
      this.$emit('update:activeScene', this.scene._id.$oid);
    },

    createGradient() {
      var gradient = "linear-gradient(to right, ";
      const lastIndex = this.scene.colors.length - 1;

      this.scene.colors.forEach(async function(element, index) {
        gradient += element;
        if (index != lastIndex) {
          gradient += ", ";
        }
      });

      return gradient;
    },

    deleteIt() {
      this.$emit("delete-item", this.scene);
    },

    editIt() {
      this.rerenderEdit();
      this.editDialog = true;
    },

    rerenderEdit() {
      this.editKey += 1;
    },

    loadScenes() {
      this.$emit("load-scenes");
    },

    turnOff() {
      const res = lightsOff(this.scene._id.$oid);
      console.log(res)
      this.$emit('update:activeScene', '');
    },

    setBrightness() {
      updateBrightness(Math.round(this.$options.filters.brightnessToStore(this.newBrightness)))
      this.updatedBrightness = true;
    },

    setScene(newScene) {
      console.log('setting the scene ;)')

      //  Submit the edits to the API/Database:
      editScene(newScene).then(response => {
        if (response.status === SceneProps.SUCCESS) {
          this.editSnackbar = true;
          this.$emit('update:scene', newScene);
          this.loadScenes();
        }
      });
    }
  }
};
</script>
