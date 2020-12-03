<template>
  <g
    inkscape:groupmode="layer"
    id="layer4"
    v-bind:transform="'translate(' + x + ', ' + y + ')'"
    x=""
    y=""
    inkscape:label="EchoDisplay">
    <g
      id="g4746">
      <rect
        style="fill:#333333;fill-opacity:1;stroke-width:0.23512554"
        id="rect4648"
        width="29.633333"
        height="19.314583"

      />
      <text x="3.04" y="13.20"
            font-family="monospace"
            font-size="10" style="fill: white">
        <slot></slot>
      </text>
    </g>
  </g>
</template>

<script>
  export default {
    props: {
      x: {
        type: Number,
        default: 116.15208
      },
      y: {
        type: Number,
        default: 136.66251
      }
    }
  }
</script>