<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black overflow-hidden relative">
      <!-- Animated stars -->
      <div class="stars"></div>
      <div class="twinkling"></div>
      
      <!-- Cosmic dust -->
      <div class="cosmic-dust"></div>
  
      <div class="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center">
        <div class="max-w-md w-full space-y-8 bg-purple-800 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-purple-500 border-opacity-30">
          <div>
            <h1 class="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2">
              Cosmic Profile
            </h1>
            <p class="text-center text-purple-200 text-lg">Update Personal Information</p>
          </div>
          <form @submit.prevent="updateProfile" class="mt-8 space-y-6">
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="userName" class="sr-only">First Name</label>
                <input
                  type="text"
                  id="userName"
                  v-model="form.userName"
                  placeholder="First Name"
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-300 placeholder-purple-400 text-purple-100 rounded-t-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-purple-700 bg-opacity-50"
                />
              </div>
              <div>
                <label for="userLName" class="sr-only">Last Name</label>
                <input
                  type="text"
                  id="userLName"
                  v-model="form.userLName"
                  placeholder="Last Name"
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-300 placeholder-purple-400 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-purple-700 bg-opacity-50"
                />
              </div>
              <div>
                <label for="email" class="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  placeholder="Email"
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-300 placeholder-purple-400 text-purple-100 rounded-b-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-purple-700 bg-opacity-50"
                />
              </div>
            </div>
  
            <!-- Success Message Display -->
            <div v-if="successMessage" class="text-green-400 font-bold text-center animate-pulse">
              {{ successMessage }}
            </div>
  
            <div class="flex items-center justify-between space-x-4">
              <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-purple-300 group-hover:text-purple-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                Update Profile
              </button>
              <button
                type="button"
                @click="$router.push('/public-user-dashboard?token=${token}')"
                class="group relative w-full flex justify-center py-2 px-4 border border-purple-400 text-sm font-medium rounded-md text-purple-300 bg-transparent hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const form = ref({
    userName: '',
    userLName: '',
    email: '',
  });
  const successMessage = ref('');
  
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { userId } = parseToken(token);
  
      if (!userId) {
        console.error('User ID not found in token');
        return;
      }
  
      const requestData = {
        userName: form.value.userName,
        userLName: form.value.userLName,
        email: form.value.email,
      };
  
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/update`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.data) {
        successMessage.value = 'Profile updated successfully!';
        localStorage.setItem('user', JSON.stringify(response.data));
        setTimeout(() => {
          router.push('/public-user-dashboard?token=${token}');
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
    }
  };
  
  const parseToken = (token) => {
    if (!token) return { userId: null };
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return { userId: decoded.user_id || decoded.sub || decoded.id };
    } catch (error) {
      console.error('Error parsing token:', error);
      return { userId: null };
    }
  };
  
  onMounted(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      form.value.userName = userData.userName;
      form.value.userLName = userData.userLName;
      form.value.email = userData.email;
    }
  });
  </script>
  
  <style scoped>
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
  
  /* Cosmic background */
  @keyframes move-twink-back {
    from {background-position: 0 0;}
    to {background-position: -10000px 5000px;}
  }
  
  .stars, .twinkling {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .stars {
    background: #000 url(http://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
    z-index: 0;
  }
  
  .twinkling {
    background: transparent url(http://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
    z-index: 1;
    animation: move-twink-back 200s linear infinite;
  }
  
  /* Cosmic dust */
  .cosmic-dust {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 2;
  }
  
  .cosmic-dust::after {
    content: '';
    position: absolute;
    top: -10rem;
    left: -10rem;
    width: calc(100% + 20rem);
    height: calc(100% + 20rem);
    background-image: 
      radial-gradient(circle at 20% 25%, rgba(255, 166, 241, 0.07) 0%, rgba(255, 166, 241, 0) 50%),
      radial-gradient(circle at 80% 75%, rgba(191, 129, 255, 0.09) 0%, rgba(191, 129, 255, 0) 50%),
      radial-gradient(circle at 50% 50%, rgba(143, 143, 255, 0.06) 0%, rgba(143, 143, 255, 0) 60%);
    animation: cosmic-dust-float 60s linear infinite;
  }
  
  @keyframes cosmic-dust-float {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(-5%, 5%) rotate(360deg); }
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(139, 92, 246, 0.1);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.5);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.7);
  }
  </style>
  