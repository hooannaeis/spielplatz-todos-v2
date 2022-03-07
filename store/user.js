export const state = () => ({
  user: undefined
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}

export const getters = {
  getUser: (state) => {
    return state.user
  }
}

export const actions = {
  onAuthStateChangedAction(state, { authUser, claims }) {
    console.log(this)
    if (!authUser) {
      // remove state
      state.commit('setUser', null)
      this.$fire.analytics.setUserId(null)

      // redirect from here
      this.$router.push({
        path: '/auth/signin',
      })
    } else {
      const { uid, displayName } = authUser
      state.commit('setUser', { uid, displayName })
    }
  },
}

