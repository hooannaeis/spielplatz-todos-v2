<template>
  <pill>
    <input
      :id="'todo-checkbox-' + todoID"
      v-model="todoDone"
      class="checkbox-regular"
      type="checkbox"
      name="todo-done"
      @change="updateTodo({ done: todoDone })"
    />
    <span
      v-if="!inEditMode"
      ref="todoDescription"
      key="saved"
      @click="toggleEditMode"
    >
      {{ todoDescription }}
    </span>
    <div v-else key="editing" class="w-full">
      <textarea
        id="todo-description"
        ref="todoEditField"
        v-model="todoDescription"
        type="text"
        class="w-full"
        :style="{ height: textAreaHeight }"
        autocomplete="off"
        name="todo-description"
        :placeholder="todoDescription"
        @input="adjustTextAreaHeight"
      ></textarea>
      <div class="absolute bg-gray-600 rounded animate-fade-in-down p-2 mx-2">
        <button
          class="bg-red-100"
          @click="
            discardChanges()
            toggleEditMode()
          "
        >
          👎🏻
        </button>
        <button
          class="bg-green-100"
          @click="
            updateTodo({ description: todoDescription })
            toggleEditMode()
          "
        >
          👍🏻
        </button>
        <button
          v-if="todoDone"
          class="bg-red-300"
          @click="
            deleteTodo()
            toggleEditMode()
          "
        >
          💩
        </button>
      </div>
    </div>
  </pill>
</template>

<script>
export default {
  props: {
    initialTodoDescription: {
      type: String,
      default: 'Beschreibung',
    },
    initialTodoDone: {
      type: Boolean,
      default: undefined,
    },
    todoID: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      inEditMode: false,
      todoDone: false,
      todoDescription: undefined,
      textAreaHeight: '23px',
    }
  },
  created() {
    this.initializeTodo()
  },
  methods: {
    initializeTodo() {
      if (!this.initialTodoDescription) {
        this.inEditMode = true
        return
      }
      this.todoDescription = this.initialTodoDescription
      this.todoDone = this.initialTodoDone
    },
    toggleEditMode() {
      if (!this.inEditMode) {
        this.inEditMode = true
        this.$nextTick(() => {
          this.adjustTextAreaHeight(this.$refs.todoEditField)
          this.$refs.todoEditField.focus()
        })
      } else {
        this.inEditMode = false
      }
    },
    adjustTextAreaHeight(input) {
      const realTarget = input.target || input
      realTarget.style.height = 'auto'
      realTarget.style.height = `${realTarget.scrollHeight}px`
    },
    discardChanges() {
      this.todoDescription = this.initialTodoDescription
    },
    updateTodo(updates) {
      const docRef = this.$fire.firestore
        .doc(this.$route.path)
        .collection('todos')
        .doc(this.todoID)

      docRef
        .update(updates)
        .then(() => {
          console.log('updated in firestore: ', updates, docRef)

          // in case we are marking a todo as done,
          // we want to add the done count to the
          // tracking payload
          if (updates.done) {
            const doneItemCount = this.$store.getters[
              'analytics/getNextDoneItemCount'
            ](this.$route.path)
            updates.done_item_count = doneItemCount
          }
          this.$store.dispatch('analytics/track', {
            eventName: 'change',
            eventParams: {
              type: 'todo',
              label: this.todoDescription,
              firesotre_collection: this.$route.path,
              ...updates,
            },
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },
    deleteTodo() {
      const docRef = this.$fire.firestore
        .doc(this.$route.path)
        .collection('todos')
        .doc(this.todoID)

      console.log(docRef)
      docRef
        .delete()
        .then(() => {
          console.log('deleted: ', this.todoID)
          this.$store.dispatch('analytics/track', {
            eventName: 'delete',
            eventParams: {
              type: 'todo',
              firesotre_collection: this.$route.path,
              label: this.todoDescription,
            },
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
</script>

<style>
.checkbox-regular {
  -webkit-appearance: none;
  background-color: transparent;
  border-radius: 50%;
  border: 1px dashed black;
  padding: 0.6rem;
  margin: 0.5rem;
  display: inline-block;
  position: relative;
}

.checkbox-regular:checked {
  border: 1px solid black;
}

.checkbox-regular:checked:after {
  content: '\2714';
  font-size: 1.2rem;
  position: absolute;
  top: -0.4rem;
  left: 0px;
  color: #99a1a7;
}
</style>
