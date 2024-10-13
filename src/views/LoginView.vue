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
        <h3 class="mt-4 text-purple-800 text-2xl font-bold">Log in to your account</h3>
      </div>
      <form @submit.prevent="login" class="space-y-5">
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
        </div>
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center">
            <input type="checkbox" id="remember-me-checkbox" class="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out" />
            <label for="remember-me-checkbox" class="ml-2 block text-purple-700">Remember me</label>
          </div>
          <a @click="forgotPassword" class="text-purple-600 hover:text-purple-800 font-medium">Forgot password?</a>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 text-white font-medium bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-150 ease-in-out flex items-center justify-center"
        >
          <span v-if="loading" class="loader mr-2"></span>
          <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
        </button>
      </form>
      <div id="googleButton"></div>
      <p class="text-center">
        Don't have an account?
        <router-link to="/signup" class="font-medium text-purple-600 hover:text-purple-800">Sign up</router-link>
      </p>
      <p v-if="errorMessage" class="text-red-600 text-center text-sm">{{ errorMessage }}</p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Define reactive state variables
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Use router
const router = useRouter()

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

// Function to handle Google Sign-In response
function handleCredentialResponse(response) {
  axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/google`, {
    token: response.credential
  })
  .then(res => {
    const { token, redirectUrl } = res.data;
    localStorage.setItem('token', token);
    window.location.href = redirectUrl;
  })
  .catch(error => {
    console.error('Google login error:', error);
    errorMessage.value = 'Google login failed. Please try again.';
  });
// Function to handle Google Sign-In response
function handleCredentialResponse(response) {
  axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/google`, {
    token: response.credential
  })
  .then(res => {
    const { token, redirectUrl } = res.data;
    localStorage.setItem('token', token);
    window.location.href = redirectUrl;
  })
  .catch(error => {
    console.error('Google login error:', error);
    errorMessage.value = 'Google login failed. Please try again.';
  });
}

// Function to decode base64 URL-encoded token
function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return JSON.parse(window.atob(padded))
}

onMounted(() => {
  // Load the Google Sign-In API script
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });
    window.google.accounts.id.renderButton(
      document.getElementById('googleButton'),
      { theme: 'outline', size: 'large' }  // Customization attributes
    );
  };

  // Handle token from redirect (if any)
  handleTokenFromRedirect();
});

// Function to handle token from redirect
onMounted(() => {
  // Load the Google Sign-In API script
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });
    window.google.accounts.id.renderButton(
      document.getElementById('googleButton'),
      { theme: 'outline', size: 'large' }  // Customization attributes
    );
  };

  // Handle token from redirect (if any)
  handleTokenFromRedirect();
});

// Function to handle token from redirect
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
    else if (userRole === 'moderator') {
      router.push({ path: '/moderator-dashboard' })
    }
    else if (userRole === 'moderator') {
      router.push({ path: '/moderator-dashboard' })
    }
    else {
      router.push({ path: '/public-user-dashboard' })
    }
  }
}
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>