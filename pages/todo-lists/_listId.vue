<template>
  <div>
    <span class="flex items-center bg-gray-800 text-gray-100">
      <NuxtLink to="/"
        ><button class="rounded-l-lg bg-green-400">🏠</button></NuxtLink
      >
      <h2>
        {{ todoListObject.name }}
      </h2>
    </span>
    <div class="card">
      <h3>offen</h3>
      <div v-if="openTodos && openTodos.length < 1">Diese Liste ist leer</div>
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
            class="line-through"
            :initial-todo-description="doneTodo.description"
            :initial-todo-done="doneTodo.done"
            :todo-i-d="doneTodo['.key']"
          ></todo>
        </li>
      </ul>
      <button @click="toggleShowAllDoneTodos" class="font-light bg-green-800 rounded">
        {{ currentDoneTodoButtonText }}
      </button>
    </div>
    <div class="bg-red-300 card">
      <h3 @click="toggleDangerZone" class="cursor-pointer">🧽🧼🧺</h3>
      <div class="w-full">
        <div v-if="showDangerZone">
          <are-you-sure-execute
            v-if="doneTodos.length > 0"
            accept-text="löschen"
            decline-text="abbrechen"
            @acceptDecision="deleteAllDoneTodos"
          >
            <span>
              <button class="bg-gray-700">🗑️</button>
              erledigte Todos löschen
            </span>
          </are-you-sure-execute>
          <are-you-sure-execute
            accept-text="löschen"
            decline-text="abbrechen"
            @acceptDecision="deleteList"
          >
            <span>
              <button class="bg-gray-700">🗑️</button>
              Todoliste löschen
            </span>
          </are-you-sure-execute>
        </div>
      </div>
    </div>
    <AddNew type="todo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import Todo from '~/components/Todo.vue'
import AreYouSureExecute from '~/components/AreYouSureExecute.vue'

export default {
  components: { draggable, Todo, AreYouSureExecute },
  data() {
    return {
      drag: false,
      error: undefined,
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
  computed: {
    ...mapGetters('todos', ['openTodos', 'doneTodos']),
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
    const todoListRef = this.$fire.firestore.doc(this.$route.fullPath.slice(1))

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
        snapshot.docChanges().forEach((change) => {
          const todoUpdate = { '.key': change.doc.id, ...change.doc.data() }
          if (change.type === 'added') {
            console.log('New todo: ', todoUpdate)
            this.$store.commit('todos/add', todoUpdate)
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
  beforeDestroy() {
    this.$store.commit('todos/clearCurrentList')
  },
  methods: {
    toggleShowAllDoneTodos() {
      this.showAllDoneTodos = !this.showAllDoneTodos
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
        this.$fire.firestore
          .doc(this.$store.getters['todos/currentPath'])
          .collection('todos')
          .doc(movedItem['.key'])
          .update(rankUpdate)
          .then(() => {
            console.log('updated in firestore: ', rankUpdate)
            console.log('after')
            console.table(this.openTodos, ['description', 'rank'])
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    toggleDangerZone() {
      this.showDangerZone = !this.showDangerZone
    },
    deleteList() {
      this.$fire.firestore
        .doc(this.$store.getters['todos/currentPath'])
        .delete()
        .then(() => {
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
