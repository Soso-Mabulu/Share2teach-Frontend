<template>
    <div class="profile-update-container" :class="{ 'dark-mode': isDarkMode }">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-container">
            <img :src="avatarUrl" alt="User Avatar" class="avatar" />
            <div class="avatar-overlay">
              <span>{{ getInitials(form.userName, form.userLName) }}</span>
            </div>
          </div>
          <h1>{{ form.userName }} {{ form.userLName }}</h1>
          <p class="user-role">{{ userRole === 'moderator' ? 'Moderator' : 'User' }}</p>
        </div>
        <div class="profile-body">
            <!-- Success Message -->
            <div v-if="successMessage" class="success-message">
            <span class="success-icon">✔️</span>
            {{ successMessage }}
            </div>
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="userName">First Name</label>
              <input type="text" id="userName" v-model="form.userName" />
            </div>
            <div class="form-group">
              <label for="userLName">Last Name</label>
              <input type="text" id="userLName" v-model="form.userLName" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" />
            </div>
            <div class="interests-section">
              <h2>Interests</h2>
              <div class="interests-cloud">
                <span v-for="(interest, index) in interests" :key="index" class="interest-tag" @click="removeInterest(index)">
                  {{ interest }}
                </span>
              </div>
              <div class="add-interest">
                <input type="text" v-model="newInterest" placeholder="Add a new interest" @keyup.enter="addInterest" />
                <button type="button" @click="addInterest" class="add-btn">+</button>
              </div>
            </div>
            <div class="action-buttons">
              <button type="button" @click="navigateToDashboard" class="back-btn">Back to Dashboard</button>
              <button type="submit" class="update-btn">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
      <div class="theme-toggle" @click="toggleDarkMode">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  
  const isDarkMode = ref(false);
  const form = ref({ userName: '', userLName: '', email: '' });
  const interests = ref([]);
  const newInterest = ref('');
  const userRole = ref('');
  const avatarUrl = ref('');

  const successMessage = ref(''); // Add this line
  
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const { userId, role } = parseToken(token);
      userRole.value = role;
  
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const { userName, userLName, email, userInterests } = response.data;
      form.value = { userName, userLName, email };
      interests.value = userInterests || [];
      generateAvatar(userName, userLName);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedData = { ...form.value, interests: interests.value };
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/update`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.data) {
        successMessage.value = 'Profile updated successfully!'; // Show success message
        setTimeout(() => {
            successMessage.value = ''; // Clear message after 3 seconds
        }, 3000);
        localStorage.setItem('user', JSON.stringify(response.data));
        } else {
            successMessage.value = 'Failed to update profile. Please try again.';
        }

      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  
  
  const parseToken = (token) => {
    if (!token) return { userId: null, role: null };
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: decoded.user_id || decoded.sub || decoded.id,
        role: decoded.role || 'user',
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return { userId: null, role: null };
    }
  };
  
  const generateAvatar = (firstName, lastName) => {
    const initials = getInitials(firstName, lastName);
    avatarUrl.value = `https://ui-avatars.com/api/?name=${initials}&size=200&background=random`;
  };
  
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('darkMode', isDarkMode.value);
  };
  
  const addInterest = () => {
    if (newInterest.value.trim() && !interests.value.includes(newInterest.value.trim())) {
      interests.value.push(newInterest.value.trim());
      newInterest.value = '';
    }
  };
  
  const removeInterest = (index) => {
    interests.value.splice(index, 1);
  };
  
  onMounted(() => {
    fetchUserData();
    isDarkMode.value = localStorage.getItem('darkMode') === 'true';
  });
  
  watch(isDarkMode, (newValue) => {
    document.body.classList.toggle('dark-mode', newValue);
  });
  </script>
  
  <style scoped>
  .profile-update-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
    transition: background 0.3s ease;
  }
  
  .profile-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100%;
    max-width: 600px;
    transition: all 0.3s ease;
  }
  
  .profile-header {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    text-align: center;
    position: relative;
  }
  
  .avatar-container {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
  }
  
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .avatar-overlay span {
    color: white;
    font-size: 36px;
    font-weight: bold;
  }
  
  .avatar-container:hover .avatar-overlay {
    opacity: 1;
  }
  
  .profile-header h1 {
    font-size: 24px;
    margin: 0;
  }
  
  .user-role {
    font-size: 14px;
    opacity: 0.8;
    margin-top: 5px;
  }
  
  .profile-body {
    padding: 30px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }
  
  .form-group input:focus {
    border-color: #667eea;
    outline: none;
  }
  
  .interests-section {
    margin-top: 30px;
  }
  
  .interests-section h2 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #555;
  }
  
  .interests-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .interest-tag {
    background: #f0f0f0;
    color: #333;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .interest-tag:hover {
    background: #e0e0e0;
  }
  
  .add-interest {
    display: flex;
    gap: 10px;
  }
  
  .add-interest input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .add-btn {
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .add-btn:hover {
    background: #5a6fe0;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
  
  .back-btn, .update-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .back-btn {
    background: #f0f0f0;
    color: #333;
  }
  
  .back-btn:hover {
    background: #e0e0e0;
  }
  
  .update-btn {
    background: #667eea;
    color: white;
  }
  
  .update-btn:hover {
    background: #5a6fe0;
  }
  
  .theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
    background: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .theme-toggle:hover {
    transform: scale(1.1);
  }
  
  /* Dark mode styles */
  .dark-mode {
    background: linear-gradient(135deg, #2c3e50 0%, #1a1a1a 100%);
  }
  
  .dark-mode .profile-card {
    background: #2c3e50;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .dark-mode .profile-header {
    background: linear-gradient(45deg, #4a00e0 0%, #8e2de2 100%);
  }
  
  .dark-mode .form-group label,
  .dark-mode .interests-section h2 {
    color: #f0f0f0;
  }
  
  .dark-mode .form-group input,
  .dark-mode .add-interest input {
    background: #3a4d63;
    border-color: #4a5f76;
    color: white;
  }
  
  .dark-mode .interest-tag {
    background: #4a5f76;
    color: #f0f0f0;
  }
  
  .dark-mode .interest-tag:hover {
    background: #5a6f86;
  }
  
  .dark-mode .back-btn {
    background: #4a5f76;
    color: #f0f0f0;
  }
  
  .dark-mode .back-btn:hover {
    background: #5a6f86;
  }
  
  .dark-mode .update-btn {
    background: #4a00e0;
  }
  
  .dark-mode .update-btn:hover {
    background: #5a10f0;
  }
  
  .dark-mode .theme-toggle {
    background: #2c3e50;
    color: #f0f0f0;
  }
  .success-message {
  background-color: #d4edda; /* Light green background */
  color: #155724; /* Dark green text */
  border: 1px solid #c3e6cb; /* Border color */
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  animation: fadeIn 0.5s ease-in-out; /* Fade-in effect */
}

.success-icon {
  margin-right: 8px; /* Space between icon and text */
  font-size: 20px; /* Icon size */
}

/* Animation for success message */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
  </style>