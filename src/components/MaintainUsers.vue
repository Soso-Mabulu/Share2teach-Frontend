<template>
  <div class="maintain-users-page">
    <h1 class="page-title">Maintain Users</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users..."
        class="search-input"
      />
    </div>

    <div class="users-grid">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="user-card"
        @click="openUserModal(user)"
      >
        <div class="user-avatar">
          <img :src="getUserAvatar(user)" :alt="user.userName" />
        </div>
        <div class="user-info">
          <h3>{{ user.userName }} {{ user.userLName }}</h3>
          <p>{{ user.email }}</p>
          <span :class="['user-role', user.userType]">{{ user.userType }}</span>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <transition name="modal">
      <div v-if="selectedUser" class="modal-overlay" @click="closeUserModal">
        <div class="modal-content" @click.stop>
          <h2>Edit User: {{ selectedUser.userName }}</h2>
          <form @submit.prevent="updateUser">
            <div class="form-group">
              <label for="userName">First Name:</label>
              <input v-model="selectedUser.userName" id="userName" required />
            </div>
            <div class="form-group">
              <label for="userLName">Last Name:</label>
              <input v-model="selectedUser.userLName" id="userLName" required />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input v-model="selectedUser.email" id="email" type="email" required />
            </div>
            <div class="form-group">
              <label for="userType">Role:</label>
              <select v-model="selectedUser.userType" id="userType">
                <option value="public">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="educator">Educator</option>
              </select>
            </div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary">Update User</button>
              <button type="button" class="btn btn-danger" @click="deleteUser">Delete User</button>
              <button type="button" class="btn btn-secondary" @click="closeUserModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Notification -->
    <transition name="fade">
      <div v-if="notification" :class="['notification', notification.type]">
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Define your API URL (replace this with your actual base URL from environment variables)
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Retrieve the token from localStorage (or Vuex if you're using it)
const token = localStorage.getItem('token');

// Axios configuration with token included in headers
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// State variables
const users = ref([]);
const searchQuery = ref('');
const selectedUser = ref(null);
const notification = ref(null);

// Computed property for filtered users based on search query
const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.userLName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Fetch users from backend when component is mounted
onMounted(async () => {
  try {
    const response = await axiosInstance.get('api/v1/users');
    users.value = response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    showNotification('Failed to fetch users. Please try again.', 'error');
  }
});

// Function to get user avatar (customizable)
const getUserAvatar = (user) => {
  // Replace with actual logic to get user avatar
  return `https://api.dicebear.com/6.x/initials/svg?seed=${user.userName} ${user.userLName}`;
};

// Function to open modal with selected user
const openUserModal = (user) => {
  selectedUser.value = { ...user };
};

// Function to close user modal
const closeUserModal = () => {
  selectedUser.value = null;
};

// Function to show notification
const showNotification = (message, type = 'success') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 3000);
};

// Function to update a user
const updateUser = async () => {
  try {
    await axiosInstance.put(`api/v1/users/${selectedUser.value.userId}`, selectedUser.value);
    const index = users.value.findIndex(u => u.id === selectedUser.value.id);
    users.value[index] = { ...selectedUser.value };
    closeUserModal();
    showNotification('User updated successfully!');
  } catch (error) {
    console.error('Failed to update user:', error);
    showNotification('Failed to update user. Please try again.', 'error');
  }
};

// Function to delete a user
const deleteUser = async () => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await axiosInstance.delete(`api/v1/users/${selectedUser.value.id}`);
      users.value = users.value.filter(u => u.id !== selectedUser.value.id);
      closeUserModal();
      showNotification('User deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user:', error);
      showNotification('Failed to delete user. Please try again.', 'error');
    }
  }
};
</script>

<style scoped>
.maintain-users-page {
  font-family: 'Roboto', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa, #e8eaf6);
  min-height: 100vh;
  z-index: -1;
}

.page-title {
  font-size: 2.5rem;
  color: #4a148c;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 300;
  letter-spacing: 1px;
}

.search-container {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 50px;
  background: white;
  box-shadow: 0 4px 6px rgba(74, 20, 140, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.2);
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(74, 20, 140, 0.15);
}

.user-avatar {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #4a148c;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  text-align: center;
}

.user-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #4a148c;
  font-weight: 500;
}

.user-info p {
  margin: 0.5rem 0;
  color: #666;
}

.user-role {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 0.5rem;
}

.user-role.admin {
  background-color: #ff9800;
  color: white;
}

.user-role.moderator {
  background-color: #4caf50;
  color: white;
}

.user-role.user {
  background-color: #2196f3;
  color: white;
}

.user-role.educator {
  background-color: #9c27b0;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h2 {
  margin-top: 0;
  color: #4a148c;
  font-weight: 300;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a148c;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1c4e9;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4a148c;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, #6a1b9a, #4a148c);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4a148c, #6a1b9a);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(74, 20, 140, 0.2);
}

.btn-danger {
  background: linear-gradient(135deg, #d32f2f, #b71c1c);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(183, 28, 28, 0.2);
}

.btn-secondary {
  background: linear-gradient(135deg, #757575, #616161);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #616161, #757575);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(97, 97, 97, 0.2);
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  z-index: 1001;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.notification.success {
  background: linear-gradient(135deg, #43a047, #2e7d32);
}

.notification.error {
  background: linear-gradient(135deg, #e53935, #c62828);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>