<template>
  <div class="pallette">
    <v-subheader>Scene Pallette:</v-subheader>
    <draggable class="chips" v-model="palletteColors" @start="drag=true" @end="drag=false">
      <v-chip
        v-for="(chipColor, index) in palletteColors"
        v-bind:key="index"        
        close
        @click:close="removeColor(index)"
        @click="changePickerValue(chipColor)"
        :color="chipColor"
        draggable
        ripple
      ></v-chip>
    </draggable>
  </div>
</template>

<style>
.chips {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.pallette {  
  width: 100%;
}
</style>

<script>
import draggable from 'vuedraggable';

export default {
  name: "Pallette",
  props: [
    "colors",
    "set-candidate"
  ],

  components: {
    draggable,
  },

  data: () => {
    return {}
  },

  computed: {
    palletteColors: {
      get: function () {
        return this.colors;
      },
      set: function (val) {
        this.updateOrder(val);
      }
    }
  },
  
  methods: {
    changePickerValue(newCandidate) {
      this.$emit("set-candidate", newCandidate);
    },

    removeColor(index) {
      let tmpColors = this.colors;
      tmpColors.splice(index, 1);
      this.$emit("update:colors", tmpColors);
    },

    updateOrder(newOrder) {      
      this.$emit("update:colors", newOrder);
    }
  }
};
</script>