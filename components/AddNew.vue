<template>
  <div class="fixed z-10 bottom-0 w-full">
    <div class="flex-row flex items-center bg-gray-800 p-5">
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
        class=" animate-fade-in-down"
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
    isSufficientInput() {
      return this.newObjectName && this.newObjectName.length >= 1
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
    toggleAddMode() {
      this.inADDMode = !this.inADDMode
      this.newObjectName = undefined
      this.error = false

      this.focusNewName()
    },
    saveNewObject() {
      console.log(this.$refs.newObjectName)
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

          this.setTargetHeight(this.$refs.newObjectName)
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
