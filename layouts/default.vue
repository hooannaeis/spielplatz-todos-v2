<template>
  <div class="app bg-dark-700 min-h-screen flex justify-center">
    <Nuxt
      class="
        app_container
        text-dark-700
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
  @apply bg-transparent resize-none h-8 border-0 border-b-2 p-1 w-full italic;
}

button {
  @apply text-yellow-50 cursor-pointer text-lg rounded-full font-bold bg-green-400 p-2 m-2;
}

.card {
  @apply bg-yellow-50 p-3 m-4 rounded-lg flex flex-col items-center shadow-lg;
}
</style>
