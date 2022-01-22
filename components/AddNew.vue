<template>
  <div class="fixed z-10 bottom-0 w-full">
    <transition-group
      v-if="notDoneTopTodos && notDoneTopTodos.length"
      name="grow"
      tag="div"
      class="
        grid grid-flow-col
        auto-cols-max
        gap-x-4
        p-2
        bg-gray-700
        rounded-t-xl
        overflow-x-auto
      "
    >
      <div
        v-for="(topTodo, topTodoIndex) in notDoneTopTodos"
        :key="topTodo + topTodoIndex"
        class="rounded-xl bg-gray-500 border-gray-600 text-gray-50 p-2"
        @click="saveNewObject(topTodo)"
      >
        {{ topTodo }}
      </div>
    </transition-group>
    <div class="flex-row flex items-center bg-gray-800 p-5 border-t-2">
      <textarea
        id="new-object-name"
        ref="newObjectName"
        type="text"
        name="new-object-name"
        rows="1"
        :value="newObjectName"
        placeholder="neu"
        class="text-gray-100"
        @input="handleInput"
      />

      <button
        v-show="isSufficientInput"
        class="animate-fade-in-down bg-green-300 px-4"
        @click="saveNewObject"
      >
        +
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    type: {
      type: String,
      default: 'todos',
    },
    isSortable: { type: String, default: undefined },
    redirectToObjectPath: { type: String, default: undefined },
  },
  data() {
    return {
      error: false,
      newObjectName: '',
      inADDMode: false,
      addCardFlipped: true,
    }
  },
  computed: {
    ...mapGetters('todos', [
      'currentPath',
      'nextHighestRank',
      'topTodos',
      'openTodos',
    ]),
    todoSkelleton() {
      return {
        done: false,
        description: this.newObjectName,
        rank: 'a',
      }
    },
    todoListSkelleton() {
      return {
        name: this.newObjectName,
      }
    },
    isSufficientInput() {
      return this.newObjectName && this.newObjectName.length >= 1
    },
    notDoneTopTodos() {
      if (this.type !== 'todo' || !this.openTodos || !this.topTodos) {
        return
      }
      const openTodoArray = this.openTodos.map(function (obj) {
        return obj.description
      })
      const topTodoArray = this.topTodos.map(function (obj) {
        return obj.id
      })
      const notDoneTopTodos = topTodoArray.filter(
        (todo) => !openTodoArray.includes(todo)
      )
      const todosFilterdByInputText = notDoneTopTodos.filter((item) =>
        item.includes(this.newObjectName)
      )
      return todosFilterdByInputText
    },
  },
  methods: {
    handleInput(e) {
      this.error = undefined
      this.setTargetHeight(e.target)
      this.newObjectName = e.target.value
    },
    setTargetHeight(target) {
      this.$nextTick(() => {
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
      })
    },
    focusNewName() {
      if (this.inADDMode) {
        this.$nextTick(() => {
          this.$refs.newObjectName.focus()
        })
      }
    },
    incrementTodoCounter(firestoreCollection, todo) {
      const counterListRef = 'todo-counter'
      const docRef = this.$fire.firestore.collection(counterListRef).doc(todo)

      docRef.set(
        {
          counter: this.$fireModule.firestore.FieldValue.increment(1),
          list: firestoreCollection,
        },
        { merge: true }
      )
    },
    saveNewObject(descriptionOverride) {
      const FIRESTORE_COLLECTION =
        this.type === 'todo' ? `${this.currentPath}/todos` : 'todo-lists'
      let OBJECT_SKELLETON =
        this.type === 'todo' ? this.todoSkelleton : this.todoListSkelleton

      if (descriptionOverride && typeof(descriptionOverride) === 'string') {
        OBJECT_SKELLETON = {
          ...OBJECT_SKELLETON,
          description: descriptionOverride,
        }
      }
      console.log('adding new todo: ', OBJECT_SKELLETON)

      if (this.type === 'todo') {
        OBJECT_SKELLETON.rank = this.nextHighestRank
        this.$store.commit('todos/setNewHighestRank', this.nextHighestRank)
      }

      this.$fire.firestore
        .collection(FIRESTORE_COLLECTION)
        .add(OBJECT_SKELLETON)
        .then((doc) => {
          this.newObjectName = ''

          this.setTargetHeight(this.$refs.newObjectName)

          // this exists if we are creating a new list
          if (this.redirectToObjectPath) {
            this.$router.push({ path: doc.path })
          } else {
            this.incrementTodoCounter(
              FIRESTORE_COLLECTION,
              OBJECT_SKELLETON.description
            )
            this.focusNewName()
          }
        })
    },
  },
}
</script>

<style>
/* base */
.grow {
  backface-visibility: hidden;
  z-index: 1;
}

/* moving */
.grow-move {
  transition: all 600ms ease-in-out 50ms;
}

/* appearing */
.grow-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.grow-leave-active {
  transition: all 400ms ease-in;
  position: absolute;
  z-index: 0;
}

/* appear at / disappear to */
.grow-enter,
.grow-leave-to {
  opacity: 0;
}
</style>
