<template>
  <div class="min-h-screen flex flex-col items-center bg-purple-50 transition-colors duration-200">
    <div class="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 class="text-3xl font-bold mb-6 text-purple-700">Update Profile</h1>
      <form @submit.prevent="updateProfile" class="w-full max-w-lg">
        <div class="mb-4">
          <label for="userName" class="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="userName"
            v-model="form.userName"
            class="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label for="userLName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="userLName"
            v-model="form.userLName"
            class="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
        </div>
        
        <!-- Success Message Display -->
        <div v-if="successMessage" class="mb-4 text-green-600 font-bold">
          {{ successMessage }}
        </div>
        
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Profile
          </button>
          <button
            type="button"
            @click="$router.push('/user-dashboard')"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
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
const successMessage = ref(''); // Reactive variable for success message

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
      successMessage.value = 'Profile updated successfully!'; // Set the success message
      localStorage.setItem('user', JSON.stringify(response.data));
      router.push('/user-dashboard');
    }
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
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

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (userData) {
    form.value.userName = userData.userName;
    form.value.userLName = userData.userLName;
    form.value.email = userData.email;
  }
});
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Add any additional global styles here */
body {
  @apply bg-purple-50 text-gray-900;
}
</style>
