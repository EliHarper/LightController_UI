<template>
  <v-container>
    <v-card id="v-card" :style="cardStyles" class="pa-0" elevation="5">
      <v-card-text id="v-card-text" class="pa-0">
        <div id="scene" @click="applyScene()">
          <h2>{{scene.name}}</h2>
          <ul>
            <li>Colors: {{scene.colors}}</li>
            <li>Function Call: {{scene.functionCall}}</li>
            <li>Default brightness: {{scene.defaultBrightness | brightnessPercent}}</li>
          </ul>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<style scoped>
h2 {
  padding-bottom: 0.5em;
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
  height: 20vh;
  display: flex;  
}
</style>


<script>
export default {
  name: "Scene",

  props: ["scene"],

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

  methods : {
    applyScene: function() {
      console.log(this.scene._id.$oid)
    }
  }
};
</script>
