<template>
  <div>
    <div class="fixed z-10 flex items-center right-1 bottom-1">
      <span
        class="
          bg-yellow-50
          pr-2
          rounded
          flex
          items-center
          transition-all
        "
        :class="[
          inADDMode ? ' opacity-100 w-full' : 'opacity-0 transform translate-x-full',
          error ? 'animate-shake-left-right' : '',
        ]"
      >
        <button class="bg-gray-700" @click="toggleAddMode">✖️</button>
        <textarea
          id="new-object-name"
          ref="newObjectName"
          type="text"
          name="new-object-name"
          rows="1"
          :value="newObjectName"
          placeholder="neu"
          @input="handleInput"
        />
      </span>
      <button v-if="!inADDMode" class="bg-gray-700" @click="toggleAddMode">
        ➕
      </button>
      <button v-else class="bg-gray-700" @click="saveNewObject">✔️</button>
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
      newObjectName: undefined,
      inADDMode: false,
      addCardFlipped: true,
    }
  },
  computed: {
    ...mapGetters('todos', ['currentPath', 'nextHighestRank']),
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
  },
  methods: {
    handleInput(e) {
      this.error = undefined
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
      this.newObjectName = e.target.value
    },
    focusNewName() {
      if (this.inADDMode) {
        this.$nextTick(() => {
          this.$refs.newObjectName.focus()
        })
      }
    },
    toggleAddMode() {
      this.inADDMode = !this.inADDMode
      this.newObjectName = undefined
      this.error = false

      this.focusNewName()
    },
    saveNewObject() {
      if (!this.newObjectName) {
        this.error = true
        return
      }

      const FIRESTORE_COLLECTION =
        this.type === 'todo' ? `${this.currentPath}/todos` : 'todo-lists'
      const OBJECT_SKELLETON =
        this.type === 'todo' ? this.todoSkelleton : this.todoListSkelleton

      if (this.type === 'todo') {
        OBJECT_SKELLETON.rank = this.nextHighestRank
        this.$store.commit('todos/setNewHighestRank', this.nextHighestRank)
      }

      this.$fire.firestore
        .collection(FIRESTORE_COLLECTION)
        .add(OBJECT_SKELLETON)
        .then((doc) => {
          this.newObjectName = undefined
          if (this.redirectToObjectPath) {
            this.$router.push({ path: doc.path })
          } else {
            this.focusNewName()
          }
        })
    },
  },
}
</script>

<style></style>
