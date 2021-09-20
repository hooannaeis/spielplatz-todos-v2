import Vue from "vue";
import { LexoRank } from "lexorank";

export const state = () => ({
  lists: {
    "example/path/to/list": []
  },
  currentPath: undefined,
  currentHighestRank: undefined
})

export const mutations = {
  updateCurrentPath(state, update) {
    Vue.set(state, "currentPath", update)
  },
  clearCurrentList(state) {
    Vue.set(state.lists, state.currentPath, [])
    state.currentHighestRank = undefined;
  },
  add(state, update) {
    if (!state.lists[state.currentPath]) {
      Vue.set(state.lists, state.currentPath, [])
      // state.lists[state.currentPath] = []
    }
    state.lists[state.currentPath].push(update)
  },
  remove(state, update) {
    const indexToDelete = state.lists[state.currentPath].findIndex(item => item[".key"] === update[".key"])
    state.lists[state.currentPath].splice(indexToDelete, 1)
  },
  modify(state, update) {
    const replaceAtIndex = state.lists[state.currentPath].findIndex(item => item[".key"] === update[".key"])
    // vuex is blind to updating indexes directly, therefore we need to use the .splice method here
    state.lists[state.currentPath].splice(replaceAtIndex, 1, update)
  },
  setNewHighestRank(state, update) {
    Vue.set(state, "currentHighestRank", update)
  }
}

export const getters = {
  doneTodos: (state) => {
    if (state.lists[state.currentPath]) {
      return state.lists[state.currentPath].filter(item => item.done)
    }
    return undefined
  },
  openTodos: (state) => {
    if (state.lists[state.currentPath]) {
      return state.lists[state.currentPath].filter(item => !item.done).sort((a, b) => a.rank.localeCompare(b.rank))
    }
    return undefined
  },
  currentPath: (state) => {
    return state.currentPath
  },
  getRankBetweenRanks: (state, getters) => (newIndex, oldIndex) => {
    const sortedTodos = getters.openTodos;
    const replacedItemRank = LexoRank.parse(sortedTodos[newIndex].rank)
    let replacedItemSiblingRank
    console.log('before')
    console.table(sortedTodos, ['description', 'rank'])
    if (newIndex === 0) {
      console.log('placing item on top')
      // if we move an item to the top,
      // we want it to have a rank-value higher
      // thatn the one currently on top
      replacedItemSiblingRank = LexoRank.min()
    } else if (newIndex === sortedTodos.length - 1) {
      console.log('placing item at the bottom')
      replacedItemSiblingRank = LexoRank.max()
    }
    if (!replacedItemSiblingRank) {
      const siblingIndex = oldIndex < newIndex ? newIndex + 1 : newIndex - 1
      console.log(
        'placing item between index ',
        newIndex,
        ' and ',
        siblingIndex
      )
      replacedItemSiblingRank = LexoRank.parse(sortedTodos[siblingIndex].rank)
    }
    console.log(
      'placing bettween ranks: ',
      replacedItemRank.value,
      ' and ',
      replacedItemSiblingRank.value
    )
    return replacedItemRank.between(replacedItemSiblingRank).toString()
  },
  nextHighestRank: (state, getters) => {
    let rank;
    if (state.currentHighestRank) {
      // here, we have created a new todo
      // in the current lifecycle before
      // therefore we can parse the current highest index from the data-object
      const parsedLexoRank = LexoRank.parse(state.currentHighestRank);
      rank = parsedLexoRank.genPrev().toString();
    } else if (getters.openTodos.length) {
      // here, we have not created a todo in the current
      // lifecylce before, but there are todos created in the past
      // therefore, we can parse the current highest index from all openTodos
      const parsedLexoRank = LexoRank.parse(getters.openTodos[0].rank);
      rank = parsedLexoRank.genPrev().toString();
    } else {
      // the list is empty and we need to create a new middle index
      rank = LexoRank.middle().toString();
    }
    return rank;
  }
}
