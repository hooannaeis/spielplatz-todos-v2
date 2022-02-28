<template>
  <div class="h-full w-96 items-center justify-center flex">
    <div class="flex flex-col w-full mx-4 bg-gray-600 rounded-xl p-4">
      <h2>Sign in, bidde</h2>
      <div
        v-show="error"
        class="bg-red-300 rounded-xl m-2 p-2 text-center animate-fade-in-down"
      >
        {{ error }}
      </div>
      <label for="signin-email">Email</label>
      <input
        id="signin-email"
        v-model="email"
        class="mb-8"
        type="email"
        name="singin-email"
        placeholder="your@email.com"
        @input="resetError"
      />
      <label for="signin-password">Passwort</label>
      <input
        id="signin-password"
        v-model="password"
        class="mb-8"
        type="password"
        name="singin-password"
        placeholder="your secret password"
        @input="resetError"
      />
      <button
        class="my-4 bg-gray-700 px-4 flex justify-center items-center"
        @click="trySignin"
      >
        <icon-base viewBox="0 0 159 153" width="30px" class="mr-4">
          <padlock ref="padlock" @openPadlockDone="signinRedirect"></padlock>
        </icon-base>
        sign in
      </button>
    </div>
  </div>
</template>

<script>
import IconBase from '~/components/icons/IconBase.vue'
import Padlock from '~/components/icons/Padlock.vue'

export default {
  components: { IconBase, Padlock },
  layout: 'signedOut',
  data() {
    return {
      email: undefined,
      password: undefined,
      error: undefined,
    }
  },
  methods: {
    resetError() {
      this.error = undefined
    },
    trySignin() {
      if (!this.email) {
        this.error = 'gib deine Email-Adresse an.'
        this.$refs.padlock.shakePadlock()
        return
      }
      if (!this.password) {
        this.error = 'gib dein Passwort an.'
        this.$refs.padlock.shakePadlock()
        return
      }
      this.error = undefined
      this.signIn()
    },
    signinRedirect() {
      this.$router.push('/')
    },
    signIn() {
      const that = this
      this.$fire.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(function (error) {
          that.$refs.padlock.shakePadlock()
          that.error = error.message
        })
        .then((user) => {
          console.log(user)
          if (user) {
            that.$refs.padlock.openPadlock()
            // we are signed in
          }
        })
    },
  },
}
</script>

<style></style>
