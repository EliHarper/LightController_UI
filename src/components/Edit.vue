<template>
  <v-dialog
    fullscreen
    transition="slide-x-transition"
    v-model="dialog"
    height="100%">
    <div id="full-page">
      <div id="container">
        <form>
          <div id="name-field">
            <v-text-field v-model="tmpScene.name" label="Name" required></v-text-field>                      
          </div>

          <div class="picker">
            <v-color-picker hide-mode-switch mode="hexa" v-model="colorCandidate"></v-color-picker>
          </div>

          <v-card class="brightness-card" flat color="transparent">
            <v-subheader class="pa-0">Default Brightness</v-subheader>

            <v-card-text class="pa-0" label="Default Brightness">
              <v-row>
                <v-col class="pa-0">
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
          <div class="buttons">
            <v-btn @click="submitEdits()" color="primary" class="saveBtn">save</v-btn>
            <v-btn @click="cancel()" color="secondary" class="cancelBtn">cancel</v-btn>                      
          </div>
        </form>
      </div>
      <div id="dimmed" @click="cancel()"></div>
    </div>
  </v-dialog>
</template>


<style scoped>
.buttons, .brightness-card {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
#container {
  background-color: white;
  padding: 5vh;
  align-items: stretch;
}
#container #dimmed {
  overflow: visible;
}
#container form {
  height: 100%;
  justify-content: space-evenly;
}
#container,
#container > * {
  display: flex;
  flex-direction: column;
  width: fit-content;
}
#dimmed {
  display: flex;
  width: 100%;
  flex: 1 1 auto;
  background-color: rgb(33,33,33);
  opacity: .46;
}
#full-page {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
}
.picker {
  display: flex;
  justify-content: center;
}
.saveBtn,
.cancelBtn {
  margin: 5px;
}
#name-field {
  height: 100;
}
</style>


<script>
import { editScene } from '@/api/index.js';
import SceneProps from '@/scene-properties/index.js';


export default {
  name: "Edit",
  props: ["dialog", "scene"],

  data: () => ({
  }),

  computed: {
    colorCandidate: {
      get: function() {
        return this.scene.colors[0];
      },
      set: function(newColor) {
        this.tmpScene.colors = [newColor];
      }
    },
    defaultBrightnessPct: {
      get: function() {
        return this.$brightnessToDisplay(this.scene.defaultBrightness);
      },
      set: function(newBrightness) {
        this.tmpScene.defaultBrightness = this.$brightnessToStore(newBrightness);
      }
    },
    animated: {
      get: function() {
        return this.scene.functionCall == SceneProps.ANIMATED_FUNCTION;
      },
      set: function(val) {
        this.tmpScene.animated = val;

        if (val) {
          this.tmpScene.functionCall = SceneProps.ANIMATED_FUNCTION;
        } else {
          this.tmpScene.functionCall = SceneProps.STATIC_FUNCTION;
        }
      }
    }
  },

  // Creates the tmpScene object when the Edit component loads; only overwrites on save
  created: function() {
    this.setTmpScene();
  },

  methods: {
    submitEdits() {
      // Simultaneously compose the new scene object and update
      //   the prop passed down from the parent:
      this.$emit("update:scene", this.tmpScene);

      editScene(this.tmpScene).then(response => {
        if (response.status === SceneProps.SUCCESS) {
          this.editSnackbar = true;
        }
      });

      this.cancel();
    },

    cancel() {
      this.setTmpScene();
      this.$emit("update:dialog", false);
    },

    setTmpScene() {
      this.tmpScene = Object.assign({}, this.scene);
    }
  }
};
</script>
