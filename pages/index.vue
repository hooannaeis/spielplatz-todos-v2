<template>
  <div class="relative">
    <h1 class="bg-gray-800 text-gray-100 p-4">Todo Listen</h1>
    <List :list="todoLists" />
    <AddNew type="todo-lists" redirect-to-object-path="true" />
  </div>
</template>

<script>
export default {
  layout: 'default',
  data() {
    return {
      todoLists: [],
    }
  },
  head() {
    return {
      title: 'todo-lists',
    }
  },
  mounted() {
    this.$fire.firestore
      .collection('todo-lists')
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data())
          this.todoLists.push({ ...doc.data(), id: doc.id })
        })
      })
    this.$store.dispatch('analytics/track', {
      eventName: 'page_view',
      eventParams: {
        page_location: document.location.href,
        page_title: document.title,
      },
    })
  },
}
</script>
