<template>
  <div class="alert" v-bind:class="[type]" v-if="visible"><slot></slot></div>
</template>

<script>
export default {
  props: ['type', 'visible']
}
</script>

<style scoped>
  .alert {
    padding: 15px;
    border: #f1f1f1 solid 1px;
    border-left: #f1f1f1 solid 4px;
    background-color: #fdfdfd;
  }

  .error {
    border-left-color: #c41212;
  }

  .success {
    border-left-color: #429146;
  }

  .info {
    border-left-color: rgb(21, 144, 192);
  }

</style>

<style>
    .keyboard {
        width: 200px;
    }

    .hex-keyboard {
        width: 200px;
        height: 200px;
        background-color: #fafafa;
        display: flex;
        flex-wrap: wrap;
    }

    .keyboard .display {
        padding: 5px;
        background-color: white;
        text-align: right;
        border: solid 1px #2e383c;
    }

    .hex-keyboard button {
        flex-basis: 25%;
    }
</style>