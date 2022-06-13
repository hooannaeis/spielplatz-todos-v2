<template>
    <pill class="flex flex-col place-items-start z-10 bg-gray-500 rounded shadow">
      <icon-base viewBox="0 0 39 39" width="25px" @click.native="toggleOptions">
        <expandable-arrow ref="expandableArrow"></expandable-arrow>
      </icon-base>
    <div
      v-show="showOptions"
      class="grid gap-y-4 animate-fade-in-down"
    >
      <slot></slot>
    </div>
    </pill>
</template>

<script>
import ExpandableArrow from './icons/ExpandableArrow.vue'
import IconBase from './icons/IconBase.vue'
export default {
  components: { ExpandableArrow, IconBase },
  data() {
    return {
      showOptions: false,
    }
  },
  methods: {
    toggleOptions() {
      this.$refs.expandableArrow.toggleExpansion()
      this.showOptions = !this.showOptions
    },
  },
}
</script>

<style></style>
