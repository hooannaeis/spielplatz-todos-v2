<template>
  <div>
    <div
      v-if="Object.keys(imagesToUploadMetaData).length"
      id="image-preview"
      class="grid grid-cols-2 lg:grid-cols-3 place-items-center"
    >
      <pill
        v-for="(imageToUpload, imageToUploadIndex) in imagesToUploadMetaData"
        :key="imageToUpload + imageToUploadIndex"
        class="relative"
      >
        <img
          v-if="imageToUpload.localFileUrl"
          :src="imageToUpload.localFileUrl"
          alt="ein Rezeptvorschaubild"
        />
        <upload-indicator
          v-if="imageToUpload.uploadProgress"
          class="bottom-0 left-0 rounded-b-lg"
          :current-progress="imageToUpload.uploadProgress"
        />
      </pill>
    </div>
    <div
      class="
        border-2 border-dashed border-gray-50
        cursor-pointer
        w-full
        rounded-lg
        text-center
        flex
      "
    >
      <label for="uploadImage" class="w-full cursor-pointer p-4"
        ><span
          ><span v-if="Object.keys(imagesToUploadMetaData).length > 0"
            >weitere </span
          >Bilder hinzufügen</span
        >
        <input
          id="uploadImage"
          ref="uploadImage"
          class="hidden"
          type="file"
          name="uploadImage"
          multiple
          @change="handleFileUploads($event)"
        />
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      unsubscribe: undefined,
    }
  },
  computed: {
    ...mapGetters('recipes', ['imagesToUploadMetaData']),
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'recipes/saveNewRecipe') {
        this.$refs.saveNewRecipe.value = null
      }
    })
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    handleFileUploads(event) {
      this.$store.commit('recipes/resetImageMetaData')
      this.$store.commit('recipes/setImagesToUpload', event.target.files)
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i]
        if (!file.name) {
          continue
        }
        this.$store.commit('recipes/setImageMetaData', {
          fileName: file.name,
          metaKey: 'localFileUrl',
          metaValue: URL.createObjectURL(file),
        })
      }
    },
  },
}
</script>

<style></style>
