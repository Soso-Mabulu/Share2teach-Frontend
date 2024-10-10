<template>
  <div class="max-w-4xl mx-auto mt-24">
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
          Request Reset Password
        </h1>
        <p class="text-center mx-12">
          We’re here to save the day! Just enter your email and we'll send you the reset
          instructions.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6 w-full">
          <input
            v-model="email"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            type="email"
            placeholder="Email address"
            required
          />
          <div>
            <button
              type="submit"
              class="w-full px-4 py-2 font-medium text-center text-white bg-gradient-to-r from-purple-500 to-purple-700 transition-colors duration-200 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loader"></span>
              <span v-else>Send</span>
            </button>
          </div>
        </form>

        <div v-if="message" class="text-center mt-4 text-green-600">{{ message }}</div>
        <div v-if="isSuccess" class="text-center mt-2">
          <button @click="handleSubmit" class="mt-2 text-sm text-blue-500 hover:underline">
            Resend Email
          </button>
        </div>

        <div class="text-sm text-gray-600 items-center flex justify-between mt-6">
          <router-link
            to="/auth/signin"
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
          <p class="hover:text-blue-500 cursor-pointer">Need help?</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const message = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  message.value = ''
  isSuccess.value = false

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}api/v1/auth/password-reset-request`,
      {
        email: email.value
      }
    )

    if (response.status === 200) {
      message.value = 'Email sent successfully. Check your inbox for the magic link! ✉️'
      email.value = '' // Clear the email field after success
      isSuccess.value = true
    }
  } catch (error) {
    console.error('Error sending reset password email:', error)
    message.value = 'Oops! Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Add a basic loader */
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
