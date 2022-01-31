<template>
  <div class="w-full">
    <section class="w-full flex justify-end fixed bottom-4 right-4 z-10">
      <button
        v-show="isSufficientInput && inAddMode"
        class="animate-fade-in-down bg-green-300 px-4"
        @click="saveNew"
      >
        v
      </button>
      <button
        class="
          px-4
          transition-all
          transform
          duration-500
          ease-out
          rounded-full
          origin-center
        "
        :class="[inAddMode ? 'rotate-45 bg-red-300' : 'rotate-0 bg-blue-300']"
        @click="toggleAddMode"
      >
        +
      </button>
    </section>
    <section
      class="
        transform
        transition-transform
        duration-300
        ease-out
        bg-gray-800
        text-gray-50
        rounded-t-lg
        p-4
        pb-20
      "
      :class="[inAddMode ? 'translate-y-0' : 'translate-y-full']"
    >
      <h2>neues Rezept anlegen</h2>
      <div v-if="error" class="text-red-300">{{error}}</div>
      <input
        id="newRecipeName"
        v-model="newRecipeName"
        type="text"
        name="newRecipeName"
        placeholder="Rezeptname"
      />
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inAddMode: false,
      newRecipeName: undefined,
      error: undefined,
    }
  },
  computed: {
    isSufficientInput() {
      return this.newRecipeName && this.newRecipeName.length >= 1
    },
  },
  methods: {
    toggleAddMode() {
      this.inAddMode = !this.inAddMode
    },
    saveNew() {
      if (!this.newRecipeName ) {
        this.error = "trage einen Rezeptnamen ein"
        return
      }
      const newRecipe = { name: this.newRecipeName }
      this.$fire.firestore
        .collection('recipes')
        .add(newRecipe)
        .then((doc) => {
          this.error = undefined
          this.newRecipeName = ''

          // this exists if we are creating a new list
          this.$router.push({ path: doc.path })
        })
        .catch((err) => {
          this.error = err
        })
    },
  },
}
</script>

<style></style>
