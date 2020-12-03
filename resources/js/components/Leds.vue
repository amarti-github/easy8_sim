<template>
  <g
    inkscape:groupmode="layer"
    id="layer5"
    inkscape:label="Leds">
    <g
      style="display:inline"
      id="g5109"
      transform="translate(28,136)">
      <title
        id="title5154">Leds</title>

      <rect
        y="0"
        x="0"
        pppy="-39.217396"
        pppx="-77.494629"
        height="10.759797"
        width="25.523891"
        id="rect4610-4-3"
        style="display:inline;fill:#333333;fill-opacity:1;stroke-width:0.08671817" />

      <!-- PRIMERO -->
      <rect
        y="2.4"
        x="1.7"
        height="5.4897709"
        width="2.2918363"
        id="rect4749-5"
        v-bind:class="{ on: state[0] }"
        style="fill:#4d4d4d;fill-opacity:1;stroke-width:0.23729624" />

      <!-- SEGUNDO -->
      <rect
        y="2.4"
        x="4.53"
        height="5.4897709"
        width="2.2918363"
        id="rect4749-2-12"
        v-bind:class="{ on: state[1] }"
        style="fill:#4d4d4d;fill-opacity:1;stroke-width:0.23729624" />


      <!-- TERCERO -->
      <rect
        y="2.4"
        x="7.35"
        height="5.4897709"
        width="2.2918363"
        id="rect4749-2-1-9"
        v-bind:class="{ on: state[2] }"
        style="fill:#4d4d4d;fill-opacity:1;stroke-width:0.23729624" />

      <!-- CUARTO -->
      <rect
        y="2.4"
        x="10.13"
        height="5.4897709"
        width="2.2918363"
        id="rect4749-2-1-8-7"
        v-bind:class="{ on: state[3] }"
        style="fill:#4d4d4d;fill-opacity:1;stroke-width:0.23729624" />

      <!-- QUINTO -->
      <rect
        y="2.4"
        x="12.99"
        height="5.4897709"
        width="2.2918363"
        id="rect4749-8-6"
        v-bind:class="{ on: state[4] }"
        style="fill:#4d4d4d;fill-opacity:1;stroke-width:0.23729624" />

      <!-- SEXTO -->
      <rect
        y="2.4"
        x="15.81"
        height="5.4897709"
        width="2.2918363"
        id="rect4749-2-8-1"
        v-bind:class="{ on: state[5] }"
        style="fill:#4d4d4d;fill-opacity:1;stroke-width:0.23729624" />

      <!-- SEPTIMO -->
      <rect
        y="2.4"
        x="18.63"
        height="5.4897709"
        width="2.2918363"
        id="rect4749-2-1-3-9"
        v-bind:class="{ on: state[6] }"
        style="fill:#4d4d4d;fill-opacity:1;stroke-width:0.23729624" />

      <!-- OCTAVO -->
      <rect
        y="2.4"
        x="21.43"
        height="5.4897709"
        width="2.2918363"
        id="rect4749-2-1-8-0-2"
        v-bind:class="{ on: state[7] }"
        style="fill:#4d4d4d;fill-opacity:1;stroke-width:0.23729624" />
    </g>
  </g>
</template>

<script>
  export default {
    props: ['value'],
    data: function () {
      return {
        state: [false, false, false, false, false, false, false, false]
      }
    },

    watch: {
      value: function (val) {
        console.log(val);
        if (val === undefined) return;
        this.setValue(val);
      }
    },

    methods: {
      setValue: function (val) {
        for (var i = 0; i < 8; i++) {
          this.$set(this.state, 7 - i, val & 0x01);
          val = (val >> 1);
        }
      }
    },

    created: function () {
      this.setValue(this.value);
    }
  }
</script>

<style scoped>
  .on {
    fill: red !important;
  }
</style>