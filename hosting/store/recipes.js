export const state = () => ({
  recipes: {
    "example/path/to/list": []
  },
  recipeCollectionName: "recipes"
})

export const mutations = {
  addRecipe(state, payload) {
    if (!payload.id) { throw new Error("missing id: ", payload) }
    state.recipes[payload.id] = payload
  },
  deleteById: (state) => (recipeId) => {
    state.recipes[recipeId] = undefined
  }
}

export const getters = {
  recipes: (state) => {
    return state.recipes
  },
  recipeById: (state) => (recipeId) => {
    if (state.recipes[recipeId]) return state.recipes[recipeId]
    return undefined
  },
}
