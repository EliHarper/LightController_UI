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
                  :min="0"
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
        <v-btn @click="createScene()" color="primary">create</v-btn>
        <v-btn @click="cancel()" color="secondary">cancel</v-btn>
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
</style>

<script>
export default {
  name: "Create",

  props: ["dialog"],

  data: () => ({
    scene: null,
    name: "",
    colors: [""],
    defaultBrightness: 50,
    animated: false,
    colorCandidate: ""
  }),

  methods: {
    createScene() {
      this.assignToObj();

      const formData = this.assignToFormData();

      const axios = require("axios");
      axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      
      axios
        .post("http://192.168.1.117:5000/scene/create", formData)
        .then(
          /* response => (this.scenes = JSON.parse(JSON.stringify(response.data))) */
          response => (console.log(response.data))
        );

      this.cancel();
    },

    assignToObj() {
      this.scene = Object.assign({}, this.scene, {
        name: this.name,
        colors: [this.colorCandidate],
        defaultBrightness: this.defaultBrightness,
        animated: this.animated
      });

      console.log(JSON.stringify(this.scene));
    },

    assignToFormData() {
      let formData = new FormData();

      formData.append('name', this.scene.name);
      formData.append('colors', this.scene.colors);
      formData.append('defaultBrightness', this.scene.defaultBrightness);
      formData.append('animated', this.scene.animated);

      return formData;
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
