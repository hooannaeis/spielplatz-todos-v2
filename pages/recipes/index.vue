<template>
  <div class="relative">
    <h1 class="bg-gray-800 text-gray-100 p-4">Rezepte</h1>
    <List :list="recipes" :link-path="/recipes/" />
    <add-recipe/>
  </div>
</template>

<script>
export default {
  layout: 'default',
  data() {
    return {
      recipes: [],
    }
  },
  mounted() {
    this.$fire.firestore.collection('recipes').onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const recipe = { ...doc.data(), id: doc.id }
        console.log(doc.id, ' => ', doc.data())
        this.recipes.push(recipe)
        this.$store.commit('recipes/addRecipe', recipe)
      })
    })
    this.$store.dispatch('analytics/track', {
      eventName: 'page_view',
      eventParams: {},
    })
  },
}
</script>
