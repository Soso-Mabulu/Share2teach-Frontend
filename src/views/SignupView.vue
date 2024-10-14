<template>
  <main class="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-purple-50">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div class="text-center">
        <img
          src="@/assets/logo.jpg"
          width="120"
          class="mx-auto rounded-full border-4 border-purple-200"
          alt="Vault-Xpence Logo"
        />
        <h3 class="mt-4 text-purple-800 text-2xl font-bold">Create an account</h3>
      </div>
      <form @submit.prevent="signup" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-purple-700 mb-1">First Name</label>
          <input
            type="text"
            v-model="firstname"
            required
            class="w-full px-3 py-2 text-purple-700 bg-purple-50 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-purple-700 mb-1">Last Name</label>
          <input
            type="text"
            v-model="lastname"
            required
            class="w-full px-3 py-2 text-purple-700 bg-purple-50 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-purple-700 mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full px-3 py-2 text-purple-700 bg-purple-50 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-purple-700 mb-1">Password</label>
          <input
            type="password"
            v-model="password"
            required
            class="w-full px-3 py-2 text-purple-700 bg-purple-50 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 text-white font-medium bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-150 ease-in-out flex items-center justify-center"
        >
          <span v-if="loading" class="loader mr-2"></span>
          <span>{{ loading ? 'Signing up...' : 'Sign up' }}</span>
        </button>
      </form>
      <button
        class="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-100 duration-150 active:bg-purple-200"
        @click="signupWithGoogle"
      >
        <img
          src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
          alt="Google"
          class="w-5 h-5"
        />
        Continue with Google
      </button>
      <p class="text-center text-purple-700">
        Already have an account?
        <router-link to="/login" class="font-medium text-purple-600 hover:text-purple-800">Log in</router-link>
      </p>
      <p v-if="errorMessage" class="text-red-600 text-center text-sm">{{ errorMessage }}</p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// Define reactive variables
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const passwordError = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Use router for navigation
const router = useRouter()

// Validate password function
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
  return regex.test(password)
}

// Signup function
async function signup() {
  loading.value = true // Set loading to true at the beginning
  passwordError.value = '' // Reset error message

  if (!validatePassword(password.value)) {
    passwordError.value =
      'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.'
    loading.value = false // Reset loading state after validation
    return
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/signup`, {
      userName: firstname.value,
      userLName: lastname.value,
      email: email.value,
      password: password.value
    })

    console.log(response.data)
    router.push('/login') // Redirecting to login page
  } catch (error) {
    console.error('Signup Error:', error)
    if (error.response && error.response.data) {
      passwordError.value = error.response.data.message || 'An error occurred. Please try again.'
    } else {
      passwordError.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false // Reset loading state after try/catch
  }
}

// Signup with Google function
async function signupWithGoogle() {
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

// Handle token from redirect function (you can keep your existing logic)
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
    } else {
      router.push({ path: '/user-dashboard' })
    }
  }
}

// Call handleTokenFromRedirect() after your component mounts
handleTokenFromRedirect()
</script>

<style scoped>
.loader {
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  border-top: 2px solid #8b5cf6;
  width: 18px;
  height: 18px;
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
