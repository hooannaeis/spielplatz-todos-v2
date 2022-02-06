import Vue from "vue";

export const state = () => ({
  recipes: {
  },
  recipeCollectionName: "recipes",
  imagesToUpload: [],
  imagesToUploadMetaData: {}
})

export const mutations = {
  addRecipe(state, payload) {
    if (!payload.id) { throw new Error("missing id: ", payload) }
    state.recipes[payload.id] = payload
  },
  deleteById: (state) => (recipeId) => {
    state.recipes[recipeId] = undefined
  },
  setImagesToUpload(state, payload) {
    state.imagesToUpload = payload
  },

  setImageMetaData(state, payload) {
    if (!payload.fileName) { throw new Error("missing fileName: ", payload) }

    if (!state.imagesToUploadMetaData[payload.fileName]) {
      Vue.set(state.imagesToUploadMetaData, payload.fileName, {})
    }
    Vue.set(state.imagesToUploadMetaData[payload.fileName], payload.metaKey, payload.metaValue)
  },
  saveNewRecipe(state, payload) {
    state.imagesToUpload = []
    state.imagesToUploadMetaData = {}
  }
}

export const getters = {
  recipes: (state) => {
    return state.recipes
  },
  imagesToUpload: (state) => {
    return state.imagesToUpload
  },
  imagesToUploadMetaData: (state) => {
    return state.imagesToUploadMetaData
  },
  recipeById: (state) => (recipeId) => {
    if (state.recipes[recipeId]) return state.recipes[recipeId]
    return undefined
  },
}
