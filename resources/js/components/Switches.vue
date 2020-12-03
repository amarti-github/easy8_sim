<template>
  <g
    inkscape:groupmode="layer"
    id="layer5"
    inkscape:label="Leds">
    <g
      style="display:inline"
      id="g5109"
      transform="translate(28.0,207.5),scale(1.3)">
      <title
        id="title5154">Leds</title>

      <rect
        y="0"
        x="0"
        height="10.759797"
        width="25.523891"
        id="rect4610-4-3"
        style="display:inline;fill:#c23a33;fill-opacity:1;stroke-width:0.08671817" />

      <!-- PRIMERO -->
      <g v-for="(x, index) in [1.7, 4.53, 7.35, 10.13, 12.99, 15.81, 18.63, 21.43]" class="switch"
        v-on:click="switchIt(index)">
        <rect
          y="2.4"
          v-bind:x="x"
          height="5.4897709"
          width="2.2918363"
          id="rect4749-5"
          v-bind:class="{ on: state[0] }"
          style="fill:#f3f3f3;fill-opacity:1;stroke-width:0.23729624" />

        <rect
          v-bind:y="!state[index] ? 2.4 : 4.87"
          v-bind:x="x"
          height="2.94488"
          width="2.2918363"
          id="rect4749-5"
          v-bind:class="{ on: state[0] }"
          style="fill:#898989;fill-opacity:1;stroke-width:0.23729624" />
      </g>
    </g>
  </g>
</template>

<script>
  export default {
    data: function () {
      return {
        state: [false, false, false, false, false, false, false, false]
      }
    },

    methods: {
      switchIt: function (index) {
        this.$set(this.state, index, !this.state[index]);

        this.$emit('changed', this.getIntValue());
      },

      getIntValue: function () {
        var val = 0;

        for (var i = 0; i < 8; i++) {
          val = val << 1;
          val |= this.state[i];
        }

        return val;
      }
    },

    created: function () {
      console.log(this.value);
    }
  }
</script>

<style scoped>
  .switch {
    cursor: pointer;
  }
</style>