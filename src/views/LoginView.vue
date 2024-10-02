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
          <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
        </div>
      </div>
      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="font-medium"> Email </label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
        </div>
        <div>
          <label class="font-medium"> Password </label>
          <input
            type="password"
            v-model="password"
            required
            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
        </div>
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-x-3">
            <input type="checkbox" id="remember-me-checkbox" class="checkbox-item peer hidden" />
            <label
              for="remember-me-checkbox"
              class="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
            ></label>
            <span>Remember me</span>
          </div>
          <a @click="forgotPassword" class="text-center text-indigo-600 hover:text-indigo-500"
            >Forgot password?</a
          >
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 flex items-center justify-center gap-2"
        >
          <!-- Display loading spinner or text based on loading state -->
          <span v-if="loading" class="loader"></span>
          <span v-else>Sign in</span>
        </button>
      </form>
      <button
        class="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
        @click="loginWithGoogle"
      >
        <img
          src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
          alt="Google"
          class="w-5 h-5"
        />
        Continue with Google
      </button>
      <p class="text-center">
        Don't have an account?
        <router-link to="/signup" class="font-medium text-indigo-600 hover:text-indigo-500"
          >Sign up</router-link
        >
      </p>
      <p v-if="errorMessage" class="text-red-600 text-center">{{ errorMessage }}</p>
    </div>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      errorMessage: '' // Added error message state
    }
  },
  methods: {
    base64UrlDecode(str) {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(atob(base64))
    },

    async login() {
      this.loading = true // Set loading to true at the beginning
      this.errorMessage = '' // Reset error message
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
          email: this.email,
          password: this.password
        })

        const token = response.data.token
        localStorage.setItem('token', token)

        const payload = token.split('.')[1]
        const decodedToken = this.base64UrlDecode(payload)

        const userRole = decodedToken.role

        if (userRole === 'admin') {
          this.$router.push({ path: '/admin-dashboard', query: { token } })
        } else {
          this.$router.push({ path: '/user-dashboard', query: { token } })
        }
      } catch (error) {
        // Handle errors appropriately
        if (error.response) {
          // Server responded with a status other than 2xx
          this.errorMessage = error.response.data.message || 'Login failed. Please try again.' // Set error message from the server response
        } else if (error.request) {
          // Request was made but no response received
          this.errorMessage = 'Network error. Please check your connection.'
        } else {
          // Something else happened
          this.errorMessage = 'An unexpected error occurred. Please try again.'
        }
      } finally {
        this.loading = false // Reset loading state after try/catch
      }
    },

    forgotPassword() {
      // Logic for forgot password (if applicable)
      this.$router.push('/forgot-password') // Redirect to the forgot password page
    },

    loginWithGoogle() {
      // Logic for Google login (if applicable)
      // You can implement Google login here
    }
  }
}
</script>

<style scoped>
/* Add any scoped styles here if necessary */
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
