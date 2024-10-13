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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Define reactive state variables
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Use router
const router = useRouter()

// Function to decode base64 URL
// Removed duplicate function declaration

// Login function
async function login() {
  loading.value = true // Set loading to true at the beginning
  errorMessage.value = '' // Reset error message
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
      email: email.value,
      password: password.value
    })

    const token = response.data.token
    localStorage.setItem('token', token)

    const payload = token.split('.')[1]
    const decodedToken = base64UrlDecode(payload)

    const userRole = decodedToken.role

    if (userRole === 'admin') {
        router.push({ path: '/admin-dashboard', query: { token } });
    } 
    else if (userRole === 'educator') {
      router.push({ path: '/educator-dashboard', query: { token } });
    } 
    else if (userRole === 'moderator') {
      router.push({ path: '/moderator-dashboard', query: { token } });
    } 
    else {
      // Handle unknown roles or redirect to a default dashboard
      router.push({ path: '/public-user-dashboard', query: { token } });
    }

  } catch (error) {
    // Handle errors appropriately
    if (error.response) {
      errorMessage.value = error.response.data.message || 'Login failed. Please try again.' // Set error message from the server response
    } else if (error.request) {
      errorMessage.value = 'Network error. Please check your connection.'
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    loading.value = false // Reset loading state after try/catch
  }
}

// Function for forgot password
function forgotPassword() {
  router.push('/forgot-password') // Redirect to the forgot password page
}

// Google login function
async function loginWithGoogle() {
  try {
    // Redirect to your backend authentication route that handles Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`
  } catch (error) {
    // Handle any errors that occur during the redirect
    console.error('Google login error:', error) // Log the error for debugging
  }
}

// Function to decode base64 URL-encoded token
function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return JSON.parse(window.atob(padded))
}

// Use a route guard or mounted hook to handle the token after redirect
async function handleTokenFromRedirect() {
  const token = new URLSearchParams(window.location.search).get('token')
  if (token) {
    localStorage.setItem('token', token) // Save token to local storage
    const payload = token.split('.')[1] // Get the payload part of the token
    const decodedToken = base64UrlDecode(payload) // Decode the token

    const userRole = decodedToken.role // Get user role from the token

    // Redirect based on role
    if (userRole === 'admin') {
      router.push({ path: '/admin-dashboard' })
    } 
    else if (userRole === 'educator') {
      router.push({ path: '/educator-dashboard' })
    }
    else {
      router.push({ path: '/public-user-dashboard' })
    }
  }
}

// Call handleTokenFromRedirect() after your component mounts
handleTokenFromRedirect()
</script>

<style scoped>
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
