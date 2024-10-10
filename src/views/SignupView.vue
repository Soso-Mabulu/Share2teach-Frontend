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
// (This function is already declared earlier in the script)

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
    } else {
      router.push({ path: '/user-dashboard' })
    }
  }
}

// Call handleTokenFromRedirect() after your component mounts
handleTokenFromRedirect()

// Function to decode base64 URL-encoded token
function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return JSON.parse(window.atob(padded))
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
