<template>
    <div :class="['sidebar', { expanded: isExpanded }, 'bg-gradient-to-b from-[var(--color-teal-light)] to-[var(--color-blue-light)]']">
      <!-- Toggle Button -->
      <div class="toggle-btn" @click="toggleSidebar">
        <i class="icon">{{ isExpanded ? '◀️' : '▶️' }}</i>
      </div>
    <!-- User Profile Section -->
      <div class="user-profile">
        <a href="#" class="flex items-center gap-2 p-4 hover:bg-gray-50">
          <img :src="userAvatar || defaultAvatar" alt="User Avatar" class="w-10 h-10 rounded-full object-cover" />
          <div v-if="isExpanded">
            <p class="text-xs">
                <strong class="block font-medium">
                    {{ user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : 'Guest User' }}
                </strong>
                <span>{{ user.email || 'guest@example.com' }}</span>
            </p>

          </div>
        </a>
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
        </ul>
      </nav>
  

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // Default avatar image
  import defaultAvatar from '@/assets/images/profile.webp';
  
  // Reactive reference for user data
  const user = ref({
    firstName: "Firstname",
    lastName: "Lastname",
    email: ''
  });
  
  // Avatar reference (random avatar generation)
  const userAvatar = ref(defaultAvatar);
  
  // Reactive reference for sidebar state
  const isExpanded = ref(true);
  

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

// Navigation links
const links = ref([
    { text: "Dashboard", icon: "🏠", route: `/admin-dashboard?token=${token}` },
    { text: "Admin Panel", icon: "👮", route: `/admin-panel?token=${token}` }, // New Admin Panel link
    { text: "Subject", icon: "📚", route: `/admin-subject?token=${token}` },
    { text: "Search", icon: "🔍", route: `/admin-search?token=${token}` },
    { text: "Contributors", icon: "👥", route: `/admin-contributors?token=${token}` },
    { text: "FAQ", icon: "❓", route: `/admin-faq?token=${token}` },
    { text: "Self Directed Learning", icon: "💡", route: `/admin-self-learning?token=${token}` },
    { text: "Upload Documents", icon: "📤", route: `/admin-upload-documents?token=${token}` },
    { text: "Moderate Documents", icon: "⚖️", route: `/admin-moderate-documents?token=${token}` },
    { text: "View Reported Documents", icon: "📜", route: `/admin-view-reported-documents?token=${token}` },
    { text: "Advanced Reports", icon: "📊", route: `/admin-advanced-reports?token=${token}` }, // New link
    { text: "System Matrix", icon: "🔧", route: `/admin-system-matrix?token=${token}` }, // New link
    { text: "Logout", icon: "🚪", route: `/logout?token=${token}` },
]);
  
  // Method to toggle sidebar
  const toggleSidebar = () => {
    isExpanded.value = !isExpanded.value;
  };
  
  // Function to fetch user info from API based on token
  const fetchUserFromToken = async () => {
    const token = new URLSearchParams(window.location.search).get('token');
  
    if (token) {
      try {
        const userId = parseToken(token); // Decode token and extract user ID
        const apiUrl = `${import.meta.env.VITE_API_URL}api/v1/users/${userId}`; // Updated endpoint
  
        // Fetch user data from the API
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}` // Include token in the request headers
          }
        });
  
        // Update user data based on the API response
        user.value.firstName = response.data.userName; // Update to match response structure
        user.value.lastName = response.data.userLName; // Update to match response structure
        user.value.email = response.data.email; // Store email
        localStorage.setItem('user', JSON.stringify(response.data));
        getRandomAvatar(user.value.firstName, user.value.lastName); // Pass first and last names to the avatar function
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Attempt to load user data from local storage if API call fails
        loadUserFromStorage();
      }
    } else {
      // Load user data from local storage if no token is present
      loadUserFromStorage();
    }
  };
  
  // Function to load user data from local storage
  const loadUserFromStorage = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      user.value.firstName = storedUser.userName; // Update to match stored data
      user.value.lastName = storedUser.userLName; // Update to match stored data
      user.value.email = storedUser.email; // Store email
      getRandomAvatar(user.value.firstName, user.value.lastName); // Pass names to avatar function
    }
  };
  
  // Function to get a random avatar based on user's initials
  const getRandomAvatar = (firstName, lastName) => {
    const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`; // Concatenate initials
    userAvatar.value = `https://ui-avatars.com/api/?name=${initials}&size=285&background=random`;
  };
  
  // Function to decode token and extract user_id
  const parseToken = (token) => {
    try {
      // Decode the token and parse the payload
      const decoded = JSON.parse(atob(token.split('.')[1]));
      // Extract the user ID from the decoded payload
      return decoded.id; // Adjusted to use the "id" field from the token
    } catch (error) {
      console.error("Token parsing error:", error);
      return null; // Return null if there's an error
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
    position: inherit;
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
  