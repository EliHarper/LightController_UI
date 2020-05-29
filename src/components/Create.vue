<template>
  <v-dialog v-model="dialog" width="fit-content" height="fit-content" style="overflow: visible">
    <div id="container">
      <form>
        <v-text-field v-model="name" label="Name" required></v-text-field>

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
        <v-btn @click="createScene()" color="primary" class="createBtn">create</v-btn>
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
.createBtn,
.cancelBtn {
  margin: 5px;
}
</style>


<script>
import { postNewScene } from "@/api/index.js"

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

  methods: {
    createScene() {
      this.assignToObj();
      postNewScene(this.scene);

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
        name: this.name,
        colors: [this.colorCandidate],
        defaultBrightness: (this.defaultBrightness/100) * 255,
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

      let myDialog = false;
      this.$emit("set-dialog", myDialog);
    }
  }
};
</script>
