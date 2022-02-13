<template>
  <div>
    <div v-if="list.length > 0" class="grid grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(listObject, listIndex) in list"
        :key="listIndex"
        class="card bg-yellow-50 m-4"
      >
        <NuxtLink :to="linkPath + listObject.id">
          <h3>
            {{ listObject.name }}
          </h3>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: { type: Array },
    linkPath: { type: String, default: '/todo-lists/' },
  },
}
</script>
