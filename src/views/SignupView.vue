<template>
  <main class="w-full h-screen flex flex-col items-center justify-center px-4">
    <div class="max-w-sm w-full text-gray-600 space-y-5">
      <div class="text-center pb-8">
        <img
          src="@/assets/logo.jpg"
          width="150"
          class="mx-auto rounded-xl"
          alt="Vault-Xpence Logo"
        />
        <div class="mt-5">
          <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">Create an account</h3>
        </div>
      </div>
      <form @submit.prevent="signup" class="space-y-5">
        <div>
          <label class="font-medium">First Name</label>
          <input
            type="text"
            v-model="firstname"
            required
            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
        </div>
        <div>
          <label class="font-medium">Last Name</label>
          <input
            type="text"
            v-model="lastname"
            required
            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
        </div>
        <div>
          <label class="font-medium">Email</label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
        </div>
        <div>
          <label class="font-medium">Password</label>
          <input
            type="password"
            v-model="password"
            required
            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 flex items-center justify-center gap-2"
        >
          <!-- Display loading spinner or text based on loading state -->
          <span v-if="loading" class="loader"></span>
          <span v-else>Sign up</span>
        </button>
      </form>
      <button
        class="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
        @click="signupWithGoogle"
      >
        <img
          src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
          alt="Google"
          class="w-5 h-5"
        />
        Continue with Google
      </button>
      <p class="text-center">
        Already have an account?
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500"
          >Log in</router-link
        >
      </p>
      <p v-if="errorMessage" class="text-red-600 text-center">{{ errorMessage }}</p>
    </div>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignupView',
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      passwordError: '',
      loading: false,
      errorMessage: '' // For displaying errors
    }
  },
  methods: {
    validatePassword(password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
      return regex.test(password)
    },
    async signup() {
      this.loading = true // Set loading to true at the beginning
      this.passwordError = '' // Reset error message
      if (!this.validatePassword(this.password)) {
        this.passwordError =
          'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.'
        this.loading = false // Reset loading state after validation
        return
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/signup`, {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password
        })

        console.log(response.data)
        this.$router.push('/login') // Redirecting to login page
      } catch (error) {
        console.error('Signup Error:', error)
        if (error.response && error.response.data) {
          this.passwordError = error.response.data.message || 'An error occurred. Please try again.'
        } else {
          this.passwordError = 'An unexpected error occurred.'
        }
      } finally {
        this.loading = false // Reset loading state after try/catch
      }
    },
    signupWithGoogle() {
      // Logic for Google signup (if applicable)
      console.log('Google signup initiated')
      // Implement your Google sign-in logic here.
    }
  }
}
</script>

<style scoped>
/* Add any additional styles if needed */
.loader {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
