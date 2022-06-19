<template>
  <pill class="flex flex-col items-start z-10 bg-gray-500 rounded shadow">
    <icon-base viewBox="0 0 39 39" width="25px" @click.native="toggleOptions">
      <expandable-arrow ref="expandableArrow"></expandable-arrow>
    </icon-base>
    <div v-show="todoListOptionsVisible" class="grid gap-y-2">
      <slot></slot>
    </div>
  </pill>
</template>

<script>
import { mapGetters } from 'vuex'
import ExpandableArrow from './icons/ExpandableArrow.vue'
import IconBase from './icons/IconBase.vue'
export default {
  components: { ExpandableArrow, IconBase },
  computed: {
    ...mapGetters('todos', ['todoListOptionsVisible']),
  },
  watch: {
    todoListOptionsVisible(newVal, oldVal) {
      this.$refs.expandableArrow.toggleExpansion()
    },
  },
  methods: {
    toggleOptions() {
      this.$store.commit('todos/toggleTodoListOptionsVisible')
    },
  },
}
</script>

<style></style>
