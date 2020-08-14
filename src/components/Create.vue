<template>
  <v-dialog v-model="dialog" width="fit-content" height="fit-content" style="overflow: visible">
    <div id="container">
      <v-form>
        <v-text-field
          label="Name"
          v-model="name"
          :error-messages="nameErrors"
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
          required
        ></v-text-field>
        <div class="picker" :error-messages="colorErrors">
          <v-color-picker mode="hexa" hide-mode-switch hide-inputs v-model="colorCandidate"></v-color-picker>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="addCandidate()"
                dark
                v-on="on"
                fab
                small
                color="secondary"
                elevation="5"
                style="top: -20px"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Add color to pallette</span>
          </v-tooltip>

          <p class="error--text color-error" v-if="needColors">Please select at least one color.</p>

          <Pallette
            v-if="colors.length > 0"
            v-bind:colors.sync="colors"
            :key="palletteKey"
            @set-candidate="setColorCandidate"
          ></Pallette>
        </div>

        <v-card flat color="transparent">
          <v-subheader>Default Brightness:</v-subheader>

          <v-card-text class="align-center">
            <v-row>
              <v-col class="pr-4">
                <v-slider
                  class="align-center"
                  id="slider"
                  :max="100"
                  :min="1"
                  v-model="defaultBrightness"
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="defaultBrightness"
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
        <v-select
          :items="animationTypes"
          v-if="animated"
          v-model="animation"
          label="Animation"
          :error-messages="animationErrors"
          @input="$v.animation.$touch()"
          @blur="$v.animation.$touch()"
        ></v-select>

        <v-btn @click="createScene()" color="primary" class="createBtn">create</v-btn>
        <v-btn @click="cancel()" color="secondary" class="cancelBtn">cancel</v-btn>
      </v-form>
    </div>
  </v-dialog>
</template>


<style scoped>
@import "../assets/css/style.css";

.color-error {
  animation-duration: 0.3s;
  animation-name: shakeError;
}

.createBtn,
.cancelBtn {
  margin: 5px;
}

.createBtn {
  margin: 5px;
}

#container {
  background-color: white;
  padding: 5vh;
  overflow: visible;
}

#container > * {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: fit-content;
  width: fit-content;
}

.v-color-picker__sliders > .v-color-picker__alpha {
  display: none !important;
}
</style>



<script>
import { postNewScene } from "@/api/index.js";
import { required, minLength } from "vuelidate/lib/validators";
import Pallette from "./Pallette";
import SceneProps from "@/scene-properties/index.js";

export default {
  name: "Create",
  props: [
    "dialog",
    "scenes"
    ],

  components: {
    Pallette
  },

  data: () => ({
    scene: {},
    animated: false,
    animation: "",
    animationTypes: SceneProps.ANIMATION_TYPES,
    colorCandidate: "",
    colors: [],
    defaultBrightness: 50,
    name: "",
    needColors: false,
    index: -1,
    palletteKey: 0
  }),

  validations: {
    name: {
      required
    },
    animation: {
      ifAnimatedSelected(value) {
        return this.animated && value.length > 0;
      }
    },
    colors: {
      minLength: minLength(1)
    }
  },

  computed: {
    nameErrors() {
      let errors = [];
      if (!this.$v.name.$dirty) {
        return errors;
      }

      !this.$v.name.required && errors.push("Name is required.");

      return errors;
    },
    animationErrors() {
      let errors = [];

      !this.$v.animation.required &&
        errors.push("Animation is required if animated is selected.");

      return errors;
    },
    colorErrors() {
      let errors = [];

      if (!this.$v.colors.$dirty) {
        return errors;
      }

      !this.$v.colors.minLength &&
        errors.push("Please select at least one color.");

      return errors;
    }
  },

  methods: {
    addCandidate() {
      console.log("Pushing ");
      console.log(this.colorCandidate);
      this.colors.push(this.colorCandidate);
      console.log(this.colors);
    },

    assignToObj() {
      let functionCallVar = "";
      if (this.animated) {
        functionCallVar = SceneProps.ANIMATED_FUNCTION;
      } else {
        functionCallVar = SceneProps.STATIC_FUNCTION;
      }


      this.scene = Object.assign({}, this.scene, {
        name: this.name,
        colors: this.colors,
        defaultBrightness: (this.defaultBrightness / 100) * 255,
        functionCall: functionCallVar,
        index: this.scenes.length - 1,
        animated: this.animated,
        animation: this.animation
      });

      console.log(JSON.stringify(this.scene));
    },

    cancel() {
      this.name = "";
      this.colorCandidate = "";
      this.animated = false;
      this.animation = "";
      this.defaultBrightness = 50;
      /* Reset validation errors: */
      this.$v.$reset();

      /* Close the dialog (Create modal) */
      this.$emit("update:dialog", false);
    },

    /* onSubmit validation functions: */
    checkAnimations() {
      if (this.animation.length === 0 && this.animated) {
        this.$v.animation.$touch();
        return false;
      }
      return true;
    },

    checkColors() {
      if (this.colors.length === 0) {
        this.needColors = true;
        return false;
      }
      return true;
    },

    checkName() {
      if (this.name.length === 0) {
        this.$v.name.$touch();
        return false;
      }
      return true;
    },

    onSubmitValidationsPassed() {
      if(this.checkName() && this.checkAnimations() && this.checkColors()) {
        return true;
      }
      return false;
    },
    /* End onSubmit validation functions */

    createScene() {
      if (!this.onSubmitValidationsPassed()) {
        return;
      } 

      this.assignToObj();
      postNewScene(this.scene).then(response => {
        if (response.status == SceneProps.SUCCESS) {
          this.$emit("load-scenes");
        }
      });

      this.cancel();
    },

    rerenderPallette() {
      this.palletteKey += 1;
    },

    setColorCandidate(newCandidate) {
      this.colorCandidate = newCandidate;
    }
  }
};
</script>
