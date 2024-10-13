<template>
  <div :class="['sidebar', { expanded: isExpanded }, 'bg-gradient-to-b from-[var(--color-teal-light)] to-[var(--color-blue-light)]']">
    <!-- Toggle Button -->
    <div class="toggle-btn" @click="toggleSidebar">
      <i class="icon">{{ isExpanded ? '◀️' : '▶️' }}</i>
    </div>

    <!-- User Profile Section -->
    <div class="user-profile">
      <div class="flex items-center gap-2 p-4 hover:bg-gray-50">
        <!-- Make the profile icon clickable to navigate to the update profile page -->
        <a href="#" @click.prevent="goToProfileUpdate" class="flex items-center">
          <img :src="userAvatar || defaultAvatar" alt="User Avatar" class="w-10 h-10 rounded-full object-cover" />
        </a>
        <div v-if="isExpanded">
          <p class="text-xs">
            <strong class="block font-medium">
              {{ user.userName || 'Fetching first name...' }} {{ user.userLName || 'Fetching last name...' }}
            </strong>
            <span>{{ user.email || 'Fetching email...' }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav>
      <ul>
        <li v-for="link in links" :key="link.text">
          <router-link :to="link.route" class="nav-link">
            <i class="icon">{{ link.icon }}</i>
            <span v-if="isExpanded">{{ link.text }}</span>
          </router-link>
        </li>
        <li>
          <!-- Logout Link -->
          <a href="#" @click="logout" class="nav-link">
            <i class="icon">🚪</i>
            <span v-if="isExpanded">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import defaultAvatar from '@/assets/images/profile.webp';

// Reactive references for user data, sidebar state, and avatar
const user = ref({ userName: '', userLName: '', email: '' });
const userAvatar = ref('');
const isExpanded = ref(true);
const router = useRouter();

// Navigation links
const token = localStorage.getItem('token');
const links = [
  { text: "Dashboard", icon: "🏠", route: `/public-user-dashboard?token=${token}` },
  { text: "Subject", icon: "📚", route: "/public-user-view-all-documents?token=${token}" },
  { text: "Search", icon: "🔍", route: "/public-user-search-results" },
  { text: "Contributors", icon: "👥", route: `/public-user-contributors?token=${token}` },
  { text: "FAQ", icon: "❓", route: `/public-user-faq?token=${token}` },
  { text: "Self Directed Learning", icon: "💡", route: `/public-user-self-directed-learning?token=${token}` }
];


// Method to toggle sidebar
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

// Navigate to the profile update page
const goToProfileUpdate = () => {
  router.push('/update-profile');
};

// Logout function
const logout = () => {
  localStorage.removeItem('token'); // Clear token
  localStorage.removeItem('user'); // Clear user data
  router.push('/login'); // Redirect to login page
};

// Function to fetch user info from API
const fetchUserFromAPI = async () => {
  const token = localStorage.getItem('token'); // Get token from local storage

  if (token) {
    try {
      const { userId } = parseToken(token); // Decode token to get user ID

      if (userId) {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/users/${userId}`; // Include user ID in the API URL

        // Fetch user data from API
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` } // Include token in headers
        });

        // Update user object with fetched data
        if (response.data) {
          user.value.userName = response.data.userName;
          user.value.userLName = response.data.userLName;
          user.value.email = response.data.email;
          getRandomAvatar(user.value.userName, user.value.userLName);
        }
        localStorage.setItem('user', JSON.stringify(response.data)); // Store user data
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
};

// Function to get a random avatar
const getRandomAvatar = (userName, userLName) => {
  const initials = `${userName.charAt(0).toUpperCase()}${userLName.charAt(0).toUpperCase()}`;
  userAvatar.value = `https://ui-avatars.com/api/?name=${initials}&size=285&background=random`;
};

// Function to decode token and extract user info
const parseToken = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));

    // Return userId
    return {
      userId: decoded.user_id || decoded.sub || decoded.id, // Adjust this based on your token's structure
    };
  } catch {
    return { userId: null }; // Return null if there's an error
  }
};

// Lifecycle hook to fetch user data
onMounted(() => {
  fetchUserFromAPI(); // Fetch user data when component is mounted
});
</script>

<style scoped>
:root {
  --color-teal-light: #81e6d9;
  --color-blue-light: #ebf8ff;
}

.sidebar {
  position: relative;
  top: 0;
  left: 0;
  width: 60px;
  height: 100vh;
  transition: width 0.3s ease;
  overflow-x: hidden;
  display: block;
  background: var(--color-teal-light);
  border-right: 2px solid rgba(255, 255, 255, 0.2);
  z-index: 100;
}

.sidebar.expanded {
  width: 250px;
  background: var(--color-blue-light);
}

.toggle-btn {
  background-color: #8b3197;
  color: #ffffff;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  margin: 10px;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  margin: 15px 0;
}

nav ul li .nav-link {
  text-decoration: none;
  color: #2d3748;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 25px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

nav ul li .nav-link:hover {
  background-color: rgba(50, 50, 50, 0.1);
  transform: scale(1.05);
}

.icon {
  font-size: 1.3em;
  margin-right: 10px;
  transition: margin 0.3s ease;
  display: inline-block;
}

.sidebar:not(.expanded) .icon {
  margin-right: 0;
}

.sidebar:not(.expanded) nav ul li .nav-link {
  justify-content: center;
}

.sidebar:not(.expanded) .user-profile div {
  display: none;
}

.user-profile {
  width: 100%;
  background-color: white; /* Optional: You can add a background color for better visibility */
}

.user-profile a {
  display: flex;
  align-items: center;
  padding: 10px;
  transition: background-color 0.3s ease; /* Add transition for background color */
}

.user-profile a:hover {
  background-color: rgba(200, 200, 200, 0.3); /* Change background color on hover */
}

.user-profile img {
  margin-right: 10px;
  transition: transform 0.3s ease; /* Add transition for scaling effect */
}

.user-profile a:hover img {
  transform: scale(1.1); /* Scale up the image on hover */
}

@media (max-width: 1023px) { 
  .sidebar {
    display: none;
  }
}
</style>
