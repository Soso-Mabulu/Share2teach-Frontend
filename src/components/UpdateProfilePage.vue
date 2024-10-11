<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Update Profile</h1>
    <form @submit.prevent="updateProfile" class="max-w-lg">
      <div class="mb-4">
        <label for="userName" class="block text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          id="userName"
          v-model="form.userName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="mb-4">
        <label for="userLName" class="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          id="userLName"
          v-model="form.userLName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

const updateProfile = async () => {
  try {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    // Parse the token to get user ID and role
    const { userId } = parseToken(token);

    // Log user details
    console.log('User ID:', userId);

    // Check if userId is available
    if (!userId) {
      console.error('User ID not found in token');
      alert('User ID not found. Please log in again.');
      return;
    }

    // Prepare the request body
    const requestData = {
      userName: form.value.userName,
      userLName: form.value.userLName,
      email: form.value.email,
    };

    // Sending the request to the update endpoint
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/update`, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    // Handle successful response
    if (response.data) {
      alert('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(response.data)); // Save updated user data
      router.push('/user-dashboard'); // Redirect to dashboard
    }
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error('Error updating profile:', error.response.data);
      alert(`Failed to update profile: ${error.response.data.message || 'Please try again.'}`);
    } else {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please check your network connection and try again.');
    }
  }
};

// Update parseToken function to retrieve userId from the token
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

