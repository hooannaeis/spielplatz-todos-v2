<template>
  <div class="absolute h-2 bg-green-500 transition-all" :style="'width: ' + progress + '%'">
    <div class=""></div>
  </div>
</template>

<script>
export default {
  props: {
    currentProgress: { type: Number, default: 0 },
  },
  computed: {
    progress() {
      return Math.ceil(this.currentProgress)
    },
  },
}
</script>

<style></style>
