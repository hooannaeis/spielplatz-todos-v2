<template>
  <div class="app bg-gray-700 min-h-screen flex justify-center" style="box-sizing: border-box">
    <Nuxt
      class="
        app_container
        text-gray-700
        bg-green-400
        min-h-screen
        pt-4
        pr-0
        pb-20
        pl-0
        w-full
        max-w-screen-md
      "
    />
  </div>
</template>

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
  @apply bg-transparent resize-none h-8 border-0 border-b-2 p-1 w-full;
}

button {
  @apply text-yellow-50 cursor-pointer rounded-full font-bold p-2;
}

.card {
  @apply p-3 rounded-lg flex flex-col items-center;
}
</style>
