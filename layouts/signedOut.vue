<template>
  <div
    class="app bg-gray-700 min-h-screen flex justify-center"
    style="box-sizing: border-box"
  >
    <Nuxt
      class="
        app_container
        text-gray-50
        min-h-screen
        pt-4
        pr-0
        pb-20
        pl-0
        w-full
        max-w-screen-md
        transition
        duration-150
        ease-in
      "
    />
  </div>
</template>

<script>

export default {
  watch: {
    $route(e) {
      this.$nextTick(() => {
        this.$fire.analytics.logEvent('page_view', {
          page_title: e.name,
          page_location: 'https://spielplatz-todo.web.app' + e.fullPath,
        })
      })
    },
  },
}
</script>

<style>
h1,
h2,
h3 {
  @apply mt-3 mb-3 p-1 pl-2 pr-2 font-serif;
}

h1 {
  @apply text-4xl font-bold;
}
h2 {
  @apply text-3xl font-bold;
}
h3 {
  @apply text-xl font-bold border-b-2;
}

textarea {
  overflow: auto;
  outline: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  resize: none; /*remove the resize handle on the bottom right*/
  @apply bg-transparent resize-none border-none  w-full;
}

input[type='text'], input[type='email'], input[type='password'] {
  overflow: auto;
  outline: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  @apply bg-transparent resize-none border-b-2 border-gray-50  w-full;
}

button {
  @apply text-yellow-50 cursor-pointer rounded-full font-bold p-2;
}

.card {
  @apply p-3 rounded-lg flex flex-col items-center;
}
</style>
