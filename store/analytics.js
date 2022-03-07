export const actions = {
  track(state, payload) {
    this.$fire.analytics.logEvent(payload.eventName, {
      uid: state.rootState?.user?.user?.uid,
      ...payload.eventParams
    })
  }
}