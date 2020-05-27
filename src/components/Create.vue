<template>
  <div>
    <v-dialog width="80vw" height="fit-content">
      <v-card>
        <h1>HI</h1>
        <form>
          <!-- <v-text-field
          v-model="name"
          label="Name"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>

        <v-color-picker v-model="colorCandidate"></v-color-picker>

        <v-card flat color="transparent">
          <v-subheader>Default Brightness</v-subheader>

          <v-card-text>
            <v-row>
              <v-col class="pr-4">
                <v-slider
                  v-model="defaultBrightness"
                  class="align-center"
                  :max="100"
                  :min="0"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="slider"
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
          <v-btn @click="cancel()" color="secondary">cancel</v-btn>-->
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>

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
      this.scene.name = this.name;
      this.scene.colors = this.colorCandidate;
      this.scene.defaultBrightness = this.defaultBrightness;
      this.scene.functionCall = "solidColorFromHex";

      console.log(JSON.stringify(this.scene));

      this.dialog = false;
    },

    cancel() {
      this.$v.$reset();

      this.name = "";
      this.colorCandidate = "";
      this.animated = false;
      this.defaultBrightness = 50;
      this.dialog = false;
    }
  }
};
</script>
