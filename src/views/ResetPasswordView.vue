<template>
  <div class="max-w-4xl mx-auto mt-24">
    <!-- Add the missing closing div tag here -->
  </div>
  <div class="flex flex-col items-center justify-center p-4 space-y-4 antialiased text-gray-900">
    <div
      class="w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16 shadow-lg relative"
      style="
        border-radius: 12px;
        border-width: 5px;
        background-clip: padding-box;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <div
        class="absolute inset-0 rounded-md p-1"
        style="background: linear-gradient(to right, #a855f7, #9333ea); z-index: -1"
      ></div>

      <h1
        class="mb-6 text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent"
      >
        Reset Password
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-6 w-full">
        <!-- New Password -->
        <div>
          <input
            v-model="newPassword"
            @input="validatePassword"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            type="password"
            placeholder="New Password"
            required
          />
          <p v-if="passwordFeedback" class="text-sm text-red-500 mt-2">{{ passwordFeedback }}</p>
          <p v-else class="text-sm text-green-500 mt-2">Password is secure</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <input
            v-model="confirmPassword"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            type="password"
            placeholder="Confirm Password"
            required
          />
          <p v-if="confirmPassword && !passwordsMatch" class="text-sm text-red-500 mt-2">
            Passwords do not match
          </p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full px-4 py-2 font-medium text-center text-white bg-gradient-to-r from-purple-500 to-purple-700 transition-colors duration-200 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
          >
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Reset Password</span>
          </button>
        </div>
      </form>

      <div v-if="message" class="text-center mt-4 text-green-600">{{ message }}</div>
      <div v-if="errorMessage" class="text-center mt-4 text-red-600">{{ errorMessage }}</div>
      <!-- Add a link to the login page -->
      <div v-if="message" class="text-center mt-6">
        <router-link to="/login" class="text-purple-700 hover:underline">
          Go back to login
        </router-link>
      </div>

      <!-- Here's where router-link comes in -->
      <div class="text-sm text-gray-600 items-center flex justify-between">
        <router-link
          to="/login"
          class="text-gray-800 cursor-pointer hover:text-blue-500 inline-flex items-center ml-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const newPassword = ref('')
const confirmPassword = ref('')
const passwordFeedback = ref('')
const message = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const isFormValid = ref(false)
const token = ref('')

// Extract the token from the URL
const route = useRoute()
onMounted(() => {
  token.value = route.query.token || ''
})

const validatePassword = () => {
  const password = newPassword.value
  // Basic password security check
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const isValidLength = password.length >= 8

  if (!isValidLength) {
    passwordFeedback.value = 'Password must be at least 8 characters long'
  } else if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    passwordFeedback.value =
      'Password must include uppercase, lowercase, number, and special character'
  } else {
    passwordFeedback.value = ''
    isFormValid.value = true
  }

  if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
    isFormValid.value = false
  }
}

const passwordsMatch = computed(() => {
  return newPassword.value === confirmPassword.value
})

const handleSubmit = async () => {
  isLoading.value = true
  message.value = ''
  errorMessage.value = ''

  if (!token.value) {
    errorMessage.value = 'Token is missing or invalid.'
    isLoading.value = false
    return
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/reset-password`,
      {
        token: token.value,
        newPassword: newPassword.value
      }
    )

    if (response.status === 200) {
      message.value = 'Password has been reset successfully.'
      newPassword.value = ''
      confirmPassword.value = ''
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      errorMessage.value = 'Invalid token or password.'
    } else if (error.response && error.response.status === 404) {
      errorMessage.value = 'Token or user not found.'
    } else {
      errorMessage.value = 'An error occurred. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9333ea;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
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
