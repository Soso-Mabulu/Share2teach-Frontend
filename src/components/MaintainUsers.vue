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
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
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
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  const users = ref([]);
  const searchQuery = ref('');
  const selectedUser = ref(null);
  
  const filteredUsers = computed(() => {
    return users.value.filter(user => 
      user.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.userLName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  onMounted(async () => {
    try {
      const response = await axios.get('/api/v1/users');
      users.value = response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Handle error (e.g., show notification to user)
    }
  });
  
  const getUserAvatar = (user) => {
    // Replace with actual logic to get user avatar
    return `https://api.dicebear.com/6.x/initials/svg?seed=${user.userName} ${user.userLName}`;
  };
  
  const openUserModal = (user) => {
    selectedUser.value = { ...user };
  };
  
  const closeUserModal = () => {
    selectedUser.value = null;
  };
  
  const updateUser = async () => {
    try {
      await axios.put(`/api/v1/users/${selectedUser.value.id}`, selectedUser.value);
      const index = users.value.findIndex(u => u.id === selectedUser.value.id);
      users.value[index] = { ...selectedUser.value };
      closeUserModal();
      // Show success notification
    } catch (error) {
      console.error('Failed to update user:', error);
      // Show error notification
    }
  };
  
  const deleteUser = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/v1/users/${selectedUser.value.id}`);
        users.value = users.value.filter(u => u.id !== selectedUser.value.id);
        closeUserModal();
        // Show success notification
      } catch (error) {
        console.error('Failed to delete user:', error);
        // Show error notification
      }
    }
  };
  </script>
  
  <style scoped>
  .maintain-users-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f5f7fa;
    min-height: 100vh;
  }
  
  .page-title {
    font-size: 2.5rem;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .search-container {
    margin-bottom: 2rem;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #3498db;
  }
  
  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .user-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .user-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .user-avatar {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    overflow: hidden;
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
    color: #2c3e50;
  }
  
  .user-info p {
    margin: 0.5rem 0;
    color: #7f8c8d;
  }
  
  .user-role {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  .user-role.admin {
    background-color: #e74c3c;
    color: #fff;
  }
  
  .user-role.moderator {
    background-color: #f39c12;
    color: #fff;
  }
  
  .user-role.user {
    background-color: #3498db;
    color: #fff;
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
    background-color: #fff;
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal-content h2 {
    margin-top: 0;
    color: #2c3e50;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #34495e;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-primary {
    background-color: #3498db;
    color: #fff;
  }
  
  .btn-primary:hover {
    background-color: #2980b9;
  }
  
  .btn-danger {
    background-color: #e74c3c;
    color: #fff;
  }
  
  .btn-danger:hover {
    background-color: #c0392b;
  }
  
  .btn-secondary {
    background-color: #95a5a6;
    color: #fff;
  }
  
  .btn-secondary:hover {
    background-color: #7f8c8d;
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