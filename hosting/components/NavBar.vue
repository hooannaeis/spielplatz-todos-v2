<template>
  <ul class="flex flex-row gap-5">
    <li class="rounded-b-lg p-4 bg-gray-900 text-gray-50 shadow-lg">
      <nuxt-link to="/"> ✔️ </nuxt-link>
    </li>
    <li class="rounded-b-lg p-4 bg-gray-900 text-gray-50 shadow-lg">
      <nuxt-link :to="recipePath"> 📓 </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      recipePath: "/recipes"
    }
  }
}
</script>

<style></style>
