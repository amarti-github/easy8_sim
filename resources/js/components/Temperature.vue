<template>
  <div class="temperature">
    <input type="range" min="0" max="99" value="0" class="slider" v-model="temperature" v-bind:style="{backgroundColor: color}">
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      temperature: 0
    };
  },

  watch: {
    temperature: function (value) {
      this.$emit('changed', value);
    }
  },

  computed: {
    color: function () {
      var h = 60 - 60 * (this.temperature / 100);
      return 'hsl(' + Math.floor(h) + ' , 100%, 50%)';
    }
  }
}
</script>

<style scoped>
  .temperature {
    width: 200px;
  }
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background-color: white;
    border: solid 1px lightslategrey;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
</style>