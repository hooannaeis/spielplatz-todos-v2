<template>
  <div>
    <div v-if="todoLists.length > 0" class="grid grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(listObject, listIndex) in todoLists"
        :key="listIndex"
        class="card"
      >
        <NuxtLink :to="'/todo-lists/' + listObject.id">
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
  data() {
    return {
      todoLists: [],
    }
  },
  mounted() {
    this.$fire.firestore
      .collection('todo-lists')
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data())
          this.todoLists.push({...doc.data(), id: doc.id})
        })
      })
  },
}
</script>
