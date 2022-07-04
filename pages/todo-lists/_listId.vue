<template>
  <div>
    <span class="flex items-center bg-gray-800 text-gray-100">
      <h2>
        {{ todoListObject.name }}
      </h2>
    </span>
    <loading-todo v-if="loading" class="m-5"></loading-todo>
    <loading-todo v-if="loading" class="m-5"></loading-todo>
    <div v-else class="card">
      <section class="relative w-full items-center text-center">
        <expandable-options class="top-0 left-0 absolute">
          <pill @click.native="sortTodos">sortieren</pill>
          <are-you-sure-execute
            v-if="doneTodos && doneTodos.length && doneTodos.length > 0"
            accept-text="👍🏻"
            decline-text="👎🏻"
            @acceptDecision="deleteAllDoneTodos"
          >
            <pill> erledigte Todos löschen </pill>
          </are-you-sure-execute>
          <are-you-sure-execute
            accept-text="👍🏻"
            decline-text="👎🏻"
            @acceptDecision="deleteList"
          >
            <pill> Todoliste löschen </pill>
          </are-you-sure-execute>
        </expandable-options>
        <h3>offen</h3>
      </section>
      <div v-if="!openTodos">Diese Liste ist leer</div>
      <draggable
        tag="div"
        delay="300"
        v-bind="dragOptions"
        class="list-group w-full"
        ghost-class="ghost"
        @start="drag = true"
        @end="handleItemDragging"
      >
        <transition-group
          type="transition"
          :name="!drag ? 'flip-list' : null"
          tag="ul"
        >
          <li
            v-for="openTodo in openTodos"
            :key="openTodo['.key']"
            class="list-group-item"
          >
            <todo
              class=""
              :initial-todo-description="openTodo.description"
              :initial-todo-done="openTodo.done"
              :todo-i-d="openTodo['.key']"
            ></todo>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div
      v-if="doneTodos && doneTodos.length && doneTodos.length > 0"
      class="card"
    >
      <h3>erledigt</h3>
      <ul class="w-full">
        <li
          v-for="doneTodo in doneTodos.slice(0, currentMaxDoneTodoIndex)"
          :key="doneTodo['.key']"
        >
          <todo
            class="line-through bg-green-200"
            :initial-todo-description="doneTodo.description"
            :initial-todo-done="doneTodo.done"
            :todo-i-d="doneTodo['.key']"
          ></todo>
        </li>
      </ul>
      <section class="grid justify-items-center">
        <button
          v-show="
            doneTodos &&
            doneTodos.length &&
            doneTodos.length > defaultMaxDoneTodoIndex
          "
          class="
            font-light
            bg-green-200
            border-2 border-yellow-50
            rounded
            text-gray-700
          "
          @click="toggleShowAllDoneTodos"
        >
          {{ currentDoneTodoButtonText }}
        </button>
      </section>
    </div>
    <AddNew type="todo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import Todo from '~/components/Todo.vue'
import AreYouSureExecute from '~/components/AreYouSureExecute.vue'
import LoadingTodo from '~/components/loadingTodo.vue'

export default {
  components: { draggable, Todo, AreYouSureExecute, LoadingTodo },
  data() {
    return {
      drag: false,
      error: undefined,
      loading: true,
      todoListObject: {},
      showDangerZone: false,
      showAllDoneTodos: false,
      defaultMaxDoneTodoIndex: 3,
      dragOptions: {
        animation: 300,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      },
    }
  },
  head() {
    return {
      title: this.todoListObject.name,
    }
  },
  computed: {
    ...mapGetters('todos', ['openTodos', 'doneTodos', 'currentPath']),
    currentMaxDoneTodoIndex() {
      if (this.showAllDoneTodos) {
        return this.doneTodos.length
      }
      return this.defaultMaxDoneTodoIndex
    },
    currentDoneTodoButtonText() {
      if (this.showAllDoneTodos) {
        return 'weniger anzeigen'
      }
      return 'alle anzeigen'
    },
  },
  mounted() {
    this.$store.commit('todos/updateCurrentPath', this.$route.fullPath.slice(1))

    this.getTodos()
    this.setTopTodos()
    this.$store.dispatch('analytics/track', {
      eventName: 'page_view',
      eventParams: {},
    })
  },
  beforeDestroy() {
    this.$store.commit('todos/clearCurrentList')
    this.$store.commit('todos/clearTopTodos')
  },
  methods: {
    toggleShowAllDoneTodos() {
      this.showAllDoneTodos = !this.showAllDoneTodos
    },
    getTodos() {
      const todoListRef = this.$fire.firestore.doc(
        this.$route.fullPath.slice(1)
      )

      // retrieve the general todo-list
      todoListRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log('Document data:', doc.data())
            this.todoListObject = doc.data()
          } else {
            // doc.data() will be undefined in this case
            this.error = 'diese Liste exisitiert nicht'
            console.log('No such document!')
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error)
        })

      // get the collection of todos inside the todo-list object
      todoListRef
        .collection('todos')
        .orderBy('rank')
        .onSnapshot((snapshot) => {
          this.loading = false
          snapshot.docChanges().forEach((change) => {
            const todoUpdate = { '.key': change.doc.id, ...change.doc.data() }
            if (change.type === 'added') {
              if (!this.isTodoInOpenTodos(change.doc.id)) {
                console.log('New todo: ', todoUpdate)
                this.$store.commit('todos/add', todoUpdate)
              }
            }
            if (change.type === 'modified') {
              console.log('Modified todo: ', todoUpdate)
              this.$store.commit('todos/modify', todoUpdate)
            }
            if (change.type === 'removed') {
              console.log('Removed todo: ', todoUpdate)
              this.$store.commit('todos/remove', todoUpdate)
            }
          })
        })
    },
    isTodoInOpenTodos(todoId) {
      if (!this.openTodos || !this.openTodos.length) return false

      const existingTodosWithThisId = this.openTodos.filter((todo) => {
        return todo['.key'] === todoId
      })
      const isInOpenTodos =
        existingTodosWithThisId &&
        existingTodosWithThisId.length &&
        existingTodosWithThisId.length > 0
      console.log(
        'checking if ',
        todoId,
        ' already in open todos: ',
        isInOpenTodos
      )

      return isInOpenTodos
    },
    setTopTodos() {
      // get the most used todos in this list
      const todoCounterRef = this.$fire.firestore.collection('todo-counter')
      this.$store.commit('todos/clearTopTodos')

      todoCounterRef
        .where('list', '==', this.currentPath + '/todos')
        .where('counter', '>', 1)
        .orderBy('counter', 'desc')
        .limit(10)
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            const todoUpdate = { id: change.doc.id, ...change.doc.data() }
            if (change.type === 'added') {
              console.log('New top todo: ', todoUpdate)
              this.$store.commit('todos/addTopTodo', todoUpdate)
            }
          })
        })
    },
    updateTodo(todoKey, update) {
      this.$fire.firestore
        .doc(this.$store.getters['todos/currentPath'])
        .collection('todos')
        .doc(todoKey)
        .update(update)
        .then(() => {
          console.log('updated in firestore: ', update)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleItemDragging(e) {
      console.log('change', e)
      this.drag = false
      const movedItem = this.openTodos[e.oldIndex]
      if (e.type && e.type === 'end') {
        const newRank = this.$store.getters['todos/getRankBetweenRanks'](
          e.newIndex,
          e.oldIndex
        )
        const rankUpdate = { rank: newRank }
        const todoKey = movedItem['.key']
        this.updateTodo(todoKey, rankUpdate)
      }
    },
    getLabelArray() {
      const labelArray = []
      this.openTodos.forEach((todo) => {
        labelArray.push(todo.description)
      })
      return labelArray
    },
    async sortTodos() {
      this.$store.commit('todos/toggleTodoListOptionsVisible')

      if (!this.openTodos || this.openTodos.length < 2) return
      const labelArray = this.getLabelArray()
      const response = await this.$fire.functions
        .httpsCallable('getLabelOrder')({
          listID: this.currentPath,
          labels: labelArray,
        })
        .catch((error) => {
          console.error(error)
        })
      const labelOrder = response?.data?.labelOrder
      console.log(labelOrder)

      const todoCopy = JSON.parse(JSON.stringify(this.openTodos))
      const sortUpdates = []
      for (let i = 0; i < labelOrder.length; i++) {
        // go through the labelOrder in reverse
        const label = labelOrder[labelOrder.length - i - 1]
        const firestoreLabel = todoCopy.find(
          ({ description }) => description === label
        )
        if (firestoreLabel && firestoreLabel['.key']) {
          const nextHighestRank = this.$store.getters['todos/nextHighestRank']
          const update = { rank: nextHighestRank }
          const todoKey = firestoreLabel['.key']
          this.$store.commit('todos/setNewHighestRank', nextHighestRank)
          sortUpdates.push({ todoKey, update })
        }
      }
      console.log('sortUdates: ', sortUpdates)

      sortUpdates.forEach((sortUpdate) => {
        this.updateTodo(sortUpdate.todoKey, sortUpdate.update)
      })
    },
    toggleDangerZone() {
      this.showDangerZone = !this.showDangerZone
    },
    deleteList() {
      this.$store.commit('todos/toggleTodoListOptionsVisible')
      this.$fire.firestore
        .doc(this.$store.getters['todos/currentPath'])
        .delete()
        .then(() => {
          this.$store.dispatch('analytics/track', {
            eventName: 'delete',
            eventParams: {},
          })

          console.log(
            `deleted todo-list: ${this.$store.getters['todos/currentPath']}`
          )
          this.$router.push({ path: '/' })
        })
        .catch((err) => {
          console.error(err)
          this.addError = err
        })
    },
    deleteAllDoneTodos() {
      this.$store.commit('todos/toggleTodoListOptionsVisible')
      this.doneTodos.forEach((doneTodo) => {
        const docRef = this.$fire.firestore
          .doc(this.$store.getters['todos/currentPath'])
          .collection('todos')
          .doc(doneTodo['.key'])
        console.log(docRef)
        docRef
          .delete()
          .then(() => {
            console.log('deleted: ', doneTodo['.key'])
          })
          .catch((err) => {
            console.error(err)
          })
      })
    },
  },
}
</script>

<style>
.ghost {
  opacity: 0.8;
  background: var(--bright-3);
}

.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
