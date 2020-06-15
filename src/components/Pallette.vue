<template>
  <div class="pallette">
    <v-subheader>Scene Pallette:</v-subheader>
    <draggable class="chips" v-model="palletteColors" @start="drag=true" @end="drag=false">
      <v-chip
        v-for="(chipColor, index) in palletteColors"
        v-bind:key="index"        
        close
        @click:close="removeColor(index)"
        :color="chipColor"
        draggable
        @dragend="updateOrder()"
        ripple
      ></v-chip>
    </draggable>
  </div>
</template>

<style>
.chips {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>

<script>
import draggable from 'vuedraggable';

export default {
  name: "Pallette",
  props: ["colors"],

  components: {
    draggable,
  },

  data: () => {
    return {}
  },

  created: function() {
    this.palletteColors = this.colors;
  },
  
  methods: {
    removeColor(index) {
      let tmpColors = this.colors;
      tmpColors.splice(index, 1);
      this.$emit("update:colors", tmpColors);
    },

    updateOrder() {
      this.$emit("update:colors", this.palletteColors);
    }
  }
};
</script>