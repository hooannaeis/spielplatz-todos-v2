<template>
  <div class="w-full relative min-h-0 bg-transparent transition-all" :class="{ 'mh-2rem': showDecision }">
    <span v-if="showDecision" class="absolute w-full h-full bg-yellow-50">
      <button class="min-w-50 bg-red-300" @click="declineDecision">
        {{ declineText }}
      </button>
      <button class="min-w-50 bg-green-300" @click="acceptDecision">
        {{ acceptText }}
      </button>
    </span>
    <span
      v-else
      class="absolute w-full h-full"
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
    };
  },
  methods: {
    declineDecision() {
      this.toggleDecisionMode();
      this.$emit('declineDecision');
    },
    acceptDecision() {
      this.toggleDecisionMode();
      this.$emit('acceptDecision');
    },
    toggleDecisionMode() {
      this.showDecision = !this.showDecision;
    },
  },
};
</script>

<style>
.mh-2rem {
  min-height: 3rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>