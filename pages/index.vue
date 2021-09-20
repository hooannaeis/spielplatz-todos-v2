<template>
  <div class="relative">
    <h1 class="bg-gray-800 text-gray-100 p-4">Todo Listen</h1>
    <TodoLists />
    <AddNew type="todo-lists" redirect-to-object-path="true"/>
  </div>
</template>

<script>
export default {
  layout: 'default',
}
</script>
