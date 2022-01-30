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
      <nuxt-link to="/"> ✔️ </nuxt-link>
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
      <nuxt-link :to="recipePath"> 📓 </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
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
