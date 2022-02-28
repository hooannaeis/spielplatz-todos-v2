<template>
  <div class="h-full w-96 items-center justify-center flex">
    <div class="flex flex-col w-full">
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
      <button class="my-4 bg-gray-700 px-4" @click="trySignin">sign in</button>
    </div>
  </div>
</template>

<script>
export default {
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
        return
      }
      if (!this.password) {
        this.error = 'gib dein Passwort an.'
        return
      }
      this.error = undefined
      this.signIn()
    },
    signIn() {
      const that = this
      this.$fire.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(function (error) {
          that.error = error.message
        })
        .then((user) => {
          // we are signed in
          that.$router.push('/')
        })
    },
  },
}
</script>

<style></style>
