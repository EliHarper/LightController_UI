<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="require('../assets/ipsum-logo.svg')" class="my-3" contain height="200" />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Welcome to this Bitchin Light Controller</h1>

        <p
          class="subheading font-weight-regular"
        >Have fun messing around with my Raspberry Pi powered lights!</p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Wanna get started?</h2>

        <div class="btn-div">
          <v-btn @click="getStarted()" color="primary">Hell Yeah</v-btn>
        </div>

        <div class="remember d-flex justify-center">
          <v-checkbox v-model="remember" color="primary" label="Remember me on this device"></v-checkbox>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LandingPage",
  props: ["getStartedParent", "rememberDevice"],

  data: () => ({
    remember: false
  }),

  created() {
    this.remember = this.rememberDevice;
  },

  methods: {
    getStarted: function() {
      this.$emit("update:rememberDevice", this.remember);
      this.getStartedParent();
    }
  }
};
</script>
