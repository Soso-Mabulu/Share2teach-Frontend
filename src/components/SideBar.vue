<template>
  <div :class="['sidebar', { expanded: isExpanded }, 'bg-gradient-to-b from-[var(--color-teal-light)] to-[var(--color-blue-light)]']">
    <!-- Toggle Button -->
    <div class="toggle-btn" @click="toggleSidebar">
      <i class="icon">{{ isExpanded ? '◀️' : '▶️' }}</i>
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

    <!-- User Profile Section -->
    <div class="user-profile">
      <a href="#" class="flex items-center gap-2 p-4 hover:bg-gray-50">
        <img :src="userAvatar || defaultAvatar" alt="User Avatar" class="w-10 h-10 rounded-full object-cover" />
        <div v-if="isExpanded">
          <p class="text-xs">
            <strong class="block font-medium">{{ user.name || 'Guest User' }}</strong>
            <span>{{ user.email || 'guest@example.com' }}</span>
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import Vue Router

// Default avatar image
import defaultAvatar from '@/assets/images/profile.webp';

// Reactive reference for user data
const user = ref({
  firstName: "Firstname",
  lastName: "Lastname",
  email: ''
});

// Avatar reference (random avatar generation)
const userAvatar = ref('');

// Reactive reference for sidebar state
const isExpanded = ref(true);

// Use Vue Router for navigation
const router = useRouter();

// Navigation links (without logout)
const links = ref([
  { text: "Dashboard", icon: "🏠", route: "/dashboard" },
  { text: "Subject", icon: "📚", route: "/subject" },
  { text: "Search", icon: "🔍", route: "/search" },
  { text: "Contributors", icon: "👥", route: "/contributors" },
  { text: "FAQ", icon: "❓", route: "/faq" },
  { text: "Self Directed Learning", icon: "💡", route: "/self-learning" },
]);

// Method to toggle sidebar
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

// Logout function
const logout = () => {
  localStorage.removeItem('token'); // Clear the token
  localStorage.removeItem('user'); // Clear user data
  router.push('/login'); // Redirect to login page
};

// Function to fetch user info from API based on token
const fetchUserFromToken = async () => {
  const token = new URLSearchParams(window.location.search).get('token');

  if (token) {
    try {
      const userId = parseToken(token); // Decode token and extract user ID
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/user/${userId}`; // Updated endpoint

      // Fetch user data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}` // Include token in the request headers
        }
      });

      user.value.name = `${response.data.firstname} ${response.data.lastname}`; 
      user.value.email = response.data.email; // Store email
      localStorage.setItem('user', JSON.stringify(response.data));
      getRandomAvatar(user.value.name); 
    } catch (error) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        user.value.name = `${storedUser.firstname} ${storedUser.lastname}`;
        user.value.email = storedUser.email;
        getRandomAvatar(user.value.name);
      }
    }
  } else {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      user.value.name = `${storedUser.firstname} ${storedUser.lastname}`;
      user.value.email = storedUser.email;
      getRandomAvatar(user.value.name);
    }
  }
};

// Function to get a random avatar based on user's initials
const getRandomAvatar = (name) => {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  userAvatar.value = `https://ui-avatars.com/api/?name=${initials}&size=285&background=random`;
};

// Function to decode token and extract user_id
const parseToken = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.user_id; 
  } catch (error) {
    return null;
  }
};

onMounted(() => {
  fetchUserFromToken(); 
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
  position: absolute;
  bottom: 0;
  width: 100%;
}

.user-profile a {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #ddd;
}

.user-profile img {
  margin-right: 10px;
}

.sticky {
  position: sticky;
}

@media (max-width: 1023px) { /* Hide sidebar on mobile */
  .sidebar {
    display: none;
  }
}
</style>
