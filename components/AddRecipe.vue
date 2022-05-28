<template>
  <div class="" :class="[inAddMode ? 'fixed bottom-0 w-full h-full' : '']">
    <section class="flex justify-end fixed bottom-4 right-4 z-10">
      <button
        v-show="isSufficientInput && inAddMode"
        class="animate-fade-in-down bg-green-300 px-4 mr-4"
        @click="saveNew"
      >
        v
      </button>
      <button
        class="
          px-4
          transition-all
          transform
          duration-500
          ease-out
          rounded-full
          origin-center
        "
        :class="[inAddMode ? 'rotate-45 bg-red-300' : 'rotate-0 bg-blue-300']"
        @click="toggleAddMode"
      >
        +
      </button>
    </section>
    <section
      class="
        transform
        transition-transform
        duration-600
        ease-out
        bg-gray-800
        text-gray-50
        rounded-t-lg
        p-4
        pb-20
        overflow-auto
        h-full
      "
      :class="[inAddMode ? 'translate-y-0' : 'translate-y-full hiden']"
    >
      <h2>neues Rezept</h2>
      <div v-if="error" class="text-red-300">{{ error }}</div>
      <input
        id="newRecipeName"
        ref="newRecipeName"
        v-model="newRecipeName"
        type="text"
        name="newRecipeName"
        placeholder="Rezeptname"
      />
      <upload-images class="mt-8"></upload-images>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      inAddMode: false,
      newRecipeName: undefined,
      error: undefined,
    }
  },
  computed: {
    ...mapGetters('recipes', ['imagesToUploadMetaData']),
    isSufficientInput() {
      return this.newRecipeName && this.newRecipeName.length >= 1
    },
  },
  methods: {
    focusNewName() {
      if (this.inAddMode) {
        this.$nextTick(() => {
          this.$refs.newRecipeName.focus()
        })
      }
    },
    getKeyFromMetaDataObject(keyToGet) {
      const keysToGet = []
      for (const file in this.imagesToUploadMetaData) {
        const fileValues = this.imagesToUploadMetaData[file]
        console.log(fileValues)
        if (fileValues[keyToGet]) {
          keysToGet.push(fileValues[keyToGet])
        }
      }
      return keysToGet
    },
    toggleAddMode() {
      if (this.inAddMode) {
        this.inAddMode = false
        this.$store.commit('recipes/resetImageMetaData')
        this.newRecipeName = undefined
        this.error = undefined
        return
      }
      this.inAddMode = true
      this.focusNewName()
    },
    async saveNew() {
      if (!this.newRecipeName) {
        this.error = 'trage einen Rezeptnamen ein'
        return
      }

      const fileList = Array.from(this.$store.getters['recipes/imagesToUpload'])
      const fileRefs = await Promise.all(fileList.map(this.uploadFile))
      console.log(fileRefs)

      await Promise.all(fileRefs.map(this.getFileDownloadUrl))

      const imageUrls = this.getKeyFromMetaDataObject('downloadUrl')
      const fullPaths = this.getKeyFromMetaDataObject('fullPath')

      console.log(imageUrls)

      const newRecipe = { name: this.newRecipeName, imageUrls, fullPaths }
      this.$fire.firestore
        .collection('recipes')
        .add(newRecipe)
        .then((doc) => {
          this.error = undefined
          this.newRecipeName = ''
          this.$store.dispatch('analytics/track', {
            eventName: 'add',
            eventParams: { type: 'recipe', ...doc },
          })

          this.$router.push({ path: doc.path })
          this.$store.commit('recipes/saveNewRecipe')
        })
        .catch((err) => {
          this.error = err
        })
    },
    async uploadFile(file) {
      const fileName = file.name
      const storageRef = this.$fire.storage.ref().child(fileName)
      const metaData = {
        contentType: file.type,
      }
      try {
        const uploadTask = storageRef.put(file, metaData)
        let fileRef
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            this.$store.commit('recipes/setImageMetaData', {
              fileName,
              metaKey: 'uploadProgress',
              metaValue: progress,
            })
          },
          (error) => {
            console.error(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            fileRef = uploadTask.snapshot.ref
          }
        )
        await uploadTask
        return fileRef
      } catch (e) {
        console.error(e)
      }
    },
    async getFileDownloadUrl(fileRef) {
      const downloadUrl = await fileRef.getDownloadURL()
      this.$store.commit('recipes/setImageMetaData', {
        fileName: fileRef.name,
        metaKey: 'downloadUrl',
        metaValue: downloadUrl,
      })
      this.$store.commit('recipes/setImageMetaData', {
        fileName: fileRef.name,
        metaKey: 'fullPath',
        metaValue: fileRef.fullPath,
      })
    },
  },
}
</script>

<style></style>
