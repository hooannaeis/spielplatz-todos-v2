<template>
  <div class="relative">
    <loading-todo v-if="loading" class="m-5"></loading-todo>
    <loading-todo v-else-if="deleting" class="m-5">deleting</loading-todo>
    <h1 v-else class="bg-gray-800 text-gray-100 p-4">{{ recipe.name }}</h1>
    <div v-if="!loading && recipe.imageUrls && recipe.imageUrls.length">
      <ul
        v-for="(imageUrl, imageUrlIndex) in recipe.imageUrls"
        :key="imageUrl + imageUrlIndex"
      >
        <pill>
          <img :src="imageUrl" :alt="'rezeptbeschreibung für ' + recipe.name" />
        </pill>
      </ul>
    </div>
    <section
      v-if="!loading"
      class="grid gap-y-4 justify-items-center bg-green-300 p-5 my-5"
    >
      <are-you-sure-execute
        accept-text="👍🏻"
        decline-text="👎🏻"
        @acceptDecision="deleteRecipe"
      >
        <button
          class="
            w-full
            bg-green-200
            border-2 border-red-400
            font-light
            text-gray-700
          "
        >
          Rezept löschen
        </button>
      </are-you-sure-execute>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'default',
  data() {
    return { recipe: { name: 'default Name' }, loading: true, deleting: false }
  },
  created() {
    this.recipe = this.$store.getters['recipes/recipeById'](
      this.$route.params.recipeId
    )
    if (this.recipe) {
      this.loading = false
    } else {
      const recipeRef = this.$fire.firestore.doc(this.$route.fullPath)

      // retrieve the general todo-list
      recipeRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log(doc.id, ' => ', doc.data())

            const recipe = { ...doc.data(), id: doc.id }

            this.recipe = recipe
            this.loading = false
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!')
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error)
        })
    }
  },
  methods: {
    async deleteRecipe() {
      this.deleting = true
      if (this.recipe.fullPaths) {
        for (let i = 0; i < this.recipe.fullPaths.length; i++) {
          const fullPath = this.recipe.fullPaths[i]

          // Create a reference to the file to delete
          const fileRef = this.$fire.storage.ref().child(fullPath)

          // Delete the file
          await fileRef
            .delete()
            .then(() => {
              console.log(`${fullPath} deleted`)
            })
            .catch((error) => {
              console.error(`error deleting: ${fullPath}...${error}`)
            })
        }
      }
      this.$fire.firestore
        .doc(this.$route.fullPath)
        .delete()
        .then(() => {
          console.log(`deleted recipe: ${this.$route.fullPath}`)
          this.$store.commit('recipes/deleteById', this.recipe.id)

          this.$router.push({ path: '/recipes' })
          this.deleting = false
        })
        .catch((err) => {
          console.error(err)
          this.addError = err
        })
    },
  },
}
</script>
