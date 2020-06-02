<template>
  <v-dialog
          fullscreen hide-overlay
          v-model="dialog" width="fit-content" height="fit-content" style="overflow: visible">
    <div id="container">
      <form>
        <v-text-field v-model="scene.name" label="Name" required></v-text-field>

        <div class="picker">
          <v-color-picker v-model="colorCandidate"></v-color-picker>
        </div>

        <v-card flat color="transparent">
          <v-subheader>Default Brightness</v-subheader>

          <v-card-text>
            <v-row>
              <v-col class="pr-4">
                <v-slider
                  class="align-center"
                  :max="100"
                  :min="1"
                  hide-details
                  v-model="defaultBrightnessPct"
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="defaultBrightnessPct"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-switch v-model="animated" label="Animated"></v-switch>
        <v-btn @click="submitEdits()" color="primary" class="saveBtn">save</v-btn>
        <v-btn @click="cancel()" color="secondary" class="cancelBtn">cancel</v-btn>
      </form>
    </div>
  </v-dialog>
</template>


<style scoped>
#container {
  background-color: white;
  padding: 5vh;
  overflow: visible;
}
#container,
#container > * {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: fit-content;
  width: fit-content;
}
.picker {
  display: flex;
  justify-content: center;
}
.saveBtn,
.cancelBtn {
  margin: 5px;
}
</style>


<script>
import { editScene } from "@/api/index.js";


const SUCCESS = 200;
const ANIMATED_FUNCTION = "fadeBetween";

export default {
  name: "Edit",
  props: ["dialog", "scene"],


  data: () => ({
  }),

  computed: {
    defaultBrightnessPct: {
      get: function() {
        return this.$brightnessToDisplay(this.scene.defaultBrightness);
      },
      set: function(newBrightness) {
        this.scene.defaultBrightness = this.$brightnessToStore(newBrightness);
      }
    },
    animated() {
      return this.scene.functionCall == ANIMATED_FUNCTION;
    },
    colorCandidate() {
      return this.scene.colors[0];
    }
  },

  methods: {
    submitEdits() {
      this.assignToObj();

      editScene(this.scene).then(response => {
        if (response.status == SUCCESS) {
          this.editSnackbar = true;
        }
      });

      this.$emit("load-scenes");
      this.cancel();
    },

    assignToObj() {
      let functionCallVar = "";
      if (this.animated) {
        functionCallVar = "fadeBetween";
      } else {
        functionCallVar = "solidColorFromHex";
      }

      this.scene = Object.assign({}, this.scene, {
        name: this.scene.name,
        colors: [this.colorCandidate],
        defaultBrightness: (this.defaultBrightnessPct/100) * 255,
        functionCall: functionCallVar,
        animated: this.animated
      });

      console.log("Assigned to obj:")
      console.log(JSON.stringify(this.scene));
    },

    cancel() {
      let myDialog = false;
      this.$emit("set-dialog", myDialog);
    }
  }
};
</script>
