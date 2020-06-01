<template>
  <v-container>
    <transition name="fade">
      <v-card shaped v-if="show" id="v-card"
              :style="cardStyles" class="pa-0 izClickable" elevation="6">
        <v-card-text id="v-card-text" class="pa-0">
          <div id="scene" @click="apply()">
            <h2>{{scene.name}}</h2>
            <ul>
              <li>Colors: {{scene.colors}}</li>
              <li>Function Call: {{scene.functionCall}}</li>
              <li>Default brightness: {{scene.defaultBrightness | brightnessPercent}}</li>
            </ul>
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
    <v-snackbar :timeout="timeout" color="success" v-model="snackbar">
      Successfully deleted {{ scene.name }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>


<style scoped>
@import '../assets/css/style.css';


.fade-leave-active {
  transition: opacity .5s;
}
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

h2 {
  padding-bottom: 0.5em;
}

.icon-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
import { deleteScene, applyScene } from "@/api/index.js";

export default {
  name: "Scene",

  props: ["scene"],

  data: () => {
    return {
      snackbar: false,
      timeout: 2000,
      show: true
    };
  },

  filters: {
    brightnessPercent(val) {
      return ((val / 255) * 100).toFixed() + "%";
    }
  },

  computed: {
    cardStyles() {
      return {
        "background-color": this.scene.colors[0]
      };
    }
  },

  methods: {
    apply() {
      console.log(this.scene._id.$oid);
      applyScene(this.scene._id.$oid);
    },

    deleteIt() {
      deleteScene(this.scene._id.$oid).then(response => {
        if (response.data == "done") {
          this.snackbar = true;
          this.show = false;
        }
      });
    }
  }
};
</script>
