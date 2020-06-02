<template>
  <v-dialog
          fullscreen hide-overlay transition="slide-x-transition"
          v-model="dialog" width="fit-content" height="fit-content"
          style="overflow: visible">
    <div id="container">
      <form>
        <v-text-field v-model="scene.name" label="Name" required></v-text-field>

        <div class="picker">
          <v-color-picker hide-mode-switch mode="hexa" v-model="colorCandidate"></v-color-picker>
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
    newAnimated: ""
  }),

  computed: {
    colorCandidate: {
      get: function() {
        return this.scene.colors[0];
      },
      set: function(newColor) {
        this.scene.colors = [newColor];
      }
    },
    defaultBrightnessPct: {
      get: function() {
        return this.$brightnessToDisplay(this.scene.defaultBrightness);
      },
      set: function(newBrightness) {
        this.scene.defaultBrightness = this.$brightnessToStore(newBrightness);
      }
    },
    animated: {
      get: function() {
        return this.scene.functionCall === ANIMATED_FUNCTION;
      },
      set: function(val) {
        this.scene.animated = val;
        
        console.log("setAnimated")
        console.log(val)
        console.log(this.scene.functionCall())
      }
    }
  },

  methods: {
    submitEdits() {
      // Simultaneously compose the new scene object and update
      //   the prop passed down from the parent:
      this.$emit('update:scene', this.assignToObj());

      editScene(this.scene).then(response => {
        if (response.status === SUCCESS) {
          this.editSnackbar = true;
        }
      });

      this.cancel();
    },

    assignToObj() {
      let newScene = Object.assign({}, this.scene, {
        name: this.scene.name,
        colors: [this.colorCandidate],
        defaultBrightness: (this.defaultBrightnessPct/100) * 255,
        functionCall: this.findFunctionCall(),
        animated: this.animated
      });

      console.log("Assigned to obj:")
      console.log(JSON.stringify(newScene));

      return newScene;
    },

    findFunctionCall() {
      let functionCallVar = "";
      if (this.animated) {
        functionCallVar = "fadeBetween";
      } else {
        functionCallVar = "solidColorFromHex";
      }

      return functionCallVar;
    },

    cancel() {
      this.$emit('update:dialog', false);
    }
  }
};
</script>
