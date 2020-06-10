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
        <div class="picker">
          <v-color-picker mode="hexa" hide-mode-switch hide-inputs v-model="colorCandidate"></v-color-picker>

          <div class="chips">
            <v-subheader>Scene Pallette:</v-subheader>
            <v-chip
              v-for="(chipColor, index) in colors"
              v-bind:key="index"
              close
              @click:close="removeColor(index)"
              ripple
              :color="chipColor"
            ></v-chip>
          </div>
          
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">              
              <v-btn
                @click="addCandidate()"
                dark
                v-on="on"
                fab
                small
                color="secondary"
                elevation="5">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Add color to pallette</span>
          </v-tooltip>
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
        <v-btn @click="createScene()"  color="primary" class="createBtn">create</v-btn>
        <v-btn @click="cancel()" color="secondary" class="cancelBtn">cancel</v-btn>
      </v-form>
    </div>
  </v-dialog>
</template>


<style scoped>
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

.picker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>



<script>
import { postNewScene } from "@/api/index.js";
import { required } from "vuelidate/lib/validators";

export default {
  name: "Create",
  props: ["dialog"],

  data: () => ({
    scene: {},
    name: "",
    colors: [""],
    defaultBrightness: 50,
    animated: false,
    colorCandidate: ""
  }),

  validations: {
    name: {
      required
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
  },

  methods: {
    addCandidate() {
      this.colors.push(this.colorCandidate);
      this.colorCandidate.$reset;
    },

    assignToObj() {
      let functionCallVar = "";
      if (this.animated) {
        functionCallVar = "fade_between";
      } else {
        functionCallVar = "paint_with_colors";
      }

      this.scene = Object.assign({}, this.scene, {
        name: this.name,
        colors: [this.colorCandidate],
        defaultBrightness: (this.defaultBrightness / 100) * 255,
        functionCall: functionCallVar,
        animated: this.animated
      });

      console.log(JSON.stringify(this.scene));
    },

    cancel() {
      this.name = "";
      this.colorCandidate = "";
      this.animated = false;
      this.defaultBrightness = 50;
      /* Reset validation errors: */
      this.$v.$reset()

      /* Close the dialog (Create modal) */
      this.$emit("update:dialog", false);
    },

    createScene() {
      console.log("createScene")
      if (this.name.length === 0) {
        console.log("name.length === 0")
        this.$v.name.$touch();
        return;
      }

      this.assignToObj();
      console.log('finna post')
      postNewScene(this.scene).then(response => {
        console.log(JSON.stringify(response.data));
        this.$emit("load-scenes");
      });

      this.cancel();
    },

    removeColor(colorIndex) {
      this.colors.splice(colorIndex, 1);
    }
  }
};
</script>
