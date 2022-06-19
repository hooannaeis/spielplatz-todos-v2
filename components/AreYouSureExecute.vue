<template>
  <div
    class="w-full relative bg-transparent transition-all"
  >
    <span
      v-if="showDecision"
      class="absolute w-full h-full grid grid-cols-2 gap-2 animate-fade-in-down"
    >
      <button class="p-1 m-1 bg-red-300" @click="declineDecision">
        {{ declineText }}
      </button>
      <button class="p-1 m-1 bg-green-300" @click="acceptDecision">
        {{ acceptText }}
      </button>
    </span>
    <span
      v-else
      class="absolute w-full h-full top-0 left-0"
      @click="toggleDecisionMode"
    ></span>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    declineText: {
      default: 'no',
      type: String,
    },
    acceptText: {
      default: 'yes',
      type: String,
    },
  },
  data() {
    return {
      showDecision: false,
    }
  },
  methods: {
    declineDecision() {
      this.toggleDecisionMode()
      this.$emit('declineDecision')
    },
    acceptDecision() {
      this.toggleDecisionMode()
      this.$emit('acceptDecision')
    },
    toggleDecisionMode() {
      this.showDecision = !this.showDecision
    },
  },
}
</script>

<style>
.mh-2rem {
  min-height: 3rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
