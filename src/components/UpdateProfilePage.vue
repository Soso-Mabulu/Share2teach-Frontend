<template>
  <div class="min-h-screen flex flex-col items-center bg-purple-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Dark mode toggle -->
    <div class="mt-4 mb-8">
      <button @click="toggleDarkMode" class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none bg-purple-300 dark:bg-purple-700" :class="{ 'bg-purple-600': isDarkMode }">
        <span class="sr-only">Toggle dark mode</span>
        <span class="inline-block w-4 h-4 transform transition duration-200 ease-in-out bg-white rounded-full shadow-sm" :class="[isDarkMode ? 'translate-x-6' : 'translate-x-1']"></span>
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-1 w-3 h-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" :class="{ 'opacity-100': !isDarkMode, 'opacity-0': isDarkMode }">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-1 w-3 h-3 text-purple-200" viewBox="0 0 20 20" fill="currentColor" :class="{ 'opacity-0': !isDarkMode, 'opacity-100': isDarkMode }">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
    </div>

    <div class="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 class="text-3xl font-bold mb-6 text-purple-700 dark:text-purple-300">Update Profile</h1>
      <form @submit.prevent="updateProfile" class="w-full max-w-lg">
        <div class="mb-4">
          <label for="userName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
          <input
            type="text"
            id="userName"
            v-model="form.userName"
            class="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-purple-600 dark:text-white"
          />
        </div>
        <div class="mb-4">
          <label for="userLName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
          <input
            type="text"
            id="userLName"
            v-model="form.userLName"
            class="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-purple-600 dark:text-white"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-purple-600 dark:text-white"
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-purple-700 dark:hover:bg-purple-800"
          >
            Update Profile
          </button>
          <button
            type="button"
            @click="$router.push('/user-dashboard')"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({
  userName: '',
  userLName: '',
  email: '',
});

const isDarkMode = ref(false);

const updateProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const { userId } = parseToken(token);

    if (!userId) {
      console.error('User ID not found in token');
      alert('User ID not found. Please log in again.');
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
      alert('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(response.data));
      router.push('/user-dashboard');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error updating profile:', error.response.data);
      alert(`Failed to update profile: ${error.response.data.message || 'Please try again.'}`);
    } else {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please check your network connection and try again.');
    }
  }
};

const parseToken = (token) => {
  if (!token) {
    return { userId: null };
  }

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: decoded.user_id || decoded.sub || decoded.id,
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return { userId: null };
  }
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value);
};

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (userData) {
    form.value.userName = userData.userName;
    form.value.userLName = userData.userLName;
    form.value.email = userData.email;
  }

  isDarkMode.value = localStorage.getItem('darkMode') === 'true';
});

watchEffect(() => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Add any additional global styles here */
body {
  @apply bg-purple-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200;
}
</style>