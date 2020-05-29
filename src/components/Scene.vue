<template>
  <v-container>
    <transition name="fade">
      <v-card v-if="show" id="v-card" :style="cardStyles" class="pa-0" elevation="5">
        <v-card-text id="v-card-text" class="pa-0">
          <div id="scene" @click="apply()">
            <h2>{{scene.name}}</h2>
            <ul>
              <li>Colors: {{scene.colors}}</li>
              <li>Function Call: {{scene.functionCall}}</li>
              <li>Default brightness: {{scene.defaultBrightness | brightnessPercent}}</li>
            </ul>
          </div>

          <v-card-actions id="icon-holder">
            <v-icon @click="deleteIt()" large>delete</v-icon>
          </v-card-actions>
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
.fade-leave-active {
  transition: opacity .5s;
}
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

h2 {
  padding-bottom: 0.5em;
}

#icon-holder {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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
  flex-direction: column;
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
