<template>
  <ul class="flex flex-row gap-5">
    <li
      class="
        flex
        rounded-b-lg
        p-4
        bg-gray-900
        text-gray-50
        shadow-lg
        transition-all
        duration-150
        ease-out
      "
      :class="{ '-mb-5 bg-green-900': !inRecipeMode }"
    >
      <nuxt-link to="/">
        <icon-base viewBox="0 0 80 80" icon-name="check-box" width="25">
          <icon-check></icon-check>
        </icon-base>
      </nuxt-link>
    </li>
    <li
      class="
        flex
        rounded-b-lg
        p-4
        bg-gray-900
        text-gray-50
        shadow-lg
        transition-all
        duration-150
        ease-out
      "
      :class="{ '-mb-5 bg-blue-900': inRecipeMode }"
    >
      <nuxt-link :to="recipePath">
        <icon-base viewBox="0 0 80 80" icon-name="check-box" width="25">
          <icon-book></icon-book> </icon-base
      ></nuxt-link>
    </li>
  </ul>
</template>

<script>
import IconBase from '~/components/icons/IconBase.vue'
import IconCheck from '~/components/icons/IconCheck.vue'
import IconBook from '~/components/icons/IconBook.vue'

export default {
  components: {
    IconBase,
    IconCheck,
    IconBook,
  },
  data() {
    return {
      recipePath: '/recipes',
      todoListPath: '/',
    }
  },
  computed: {
    inRecipeMode() {
      return this.$route.fullPath.includes(this.recipePath)
    },
  },
}
</script>

<style></style>
