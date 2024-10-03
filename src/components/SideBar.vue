<template>
  <div :class="['sidebar', { expanded: isExpanded }, 'bg-gradient-to-b from-[var(--color-purple-light)] to-[var(--color-purple-lighter)]']">
    <!-- Toggle Button -->
    <div class="toggle-btn" @click="toggleSidebar">
      <i class="icon">{{ isExpanded ? '◀️' : '▶️' }}</i>
    </div>

    <!-- User Info -->
    <div v-if="isExpanded" class="user-info">
      <p>{{ user.firstName }} {{ user.lastName }}</p>
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

<script>
export default {
  data() {
    return {
      isExpanded: true,
      user: {
        firstName: "Firstname",
        lastName: "Lastname",
      },
      links: [
        { text: "Dashboard", icon: "🏠", route: "/dashboard" },
        { text: "Subject", icon: "📚", route: "/subject" },
        { text: "Search", icon: "🔍", route: "/search" },
        { text: "Contributors", icon: "👥", route: "/contributors" },
        { text: "FAQ", icon: "❓", route: "/faq" },
        { text: "Self Directed Learning", icon: "💡", route: "/self-learning" },
        { text: "Logout", icon: "🚪", route: "/logout" },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>

<style scoped>
nav {
  --color-purple-light: #9333ea; /* Lighter purple */
  --color-purple-lighter: #e09ef8; /* Even lighter purple */
}

.sidebar {
  width: 60px; /* Width when collapsed */
  height: 100vh;
  transition: width 0.3s ease;
  overflow-x: hidden;
  position: relative;
  display: none; /* Initially hide the sidebar */
  background: linear-gradient(to bottom, #9333ea, #e09ef8);
  border-right: 2px solid rgba(255, 255, 255, 0.2);
}

.sidebar.expanded {
  width: 250px; /* Width when expanded */
}

/* New style for the collapsed state */
.sidebar:not(.expanded) {
  width: 60px; /* Collapsed state width */
}

.toggle-btn {
  background-color: #9333ea;
  color: #ffffff;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  margin: 10px;
}

.user-info {
  padding: 20px;
  color: #ffffff;
  text-align: center;
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
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 5px 15px; /* Smaller link padding */
  border-radius: 25px; /* Round links */
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 0.9em; /* Smaller font size */
}

nav ul li .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05); /* Slight scale effect on hover */
}

.icon {
  font-size: 1.3em; /* Slightly smaller icon size */
  margin-right: 10px; /* Reduced margin */
  transition: margin 0.3s ease;
  display: inline-block; /* Ensure icons are inline */
}

.sidebar:not(.expanded) .icon {
  margin-right: 0;
}

.sidebar:not(.expanded) nav ul li .nav-link {
  justify-content: center;
}

/* Responsive styles */
@media (min-width: 768px) { /* Show sidebar on larger screens */
  .sidebar {
    display: block;
    width: 12%; /* Responsive width when expanded */
  }
}

@media (min-width: 1200px) { /* Increase sidebar width on larger screens */
  .sidebar {
    width: 15%; /* Adjust width for larger screens */
  }
}

@media (max-width: 600px) { /* Hide sidebar on mobile */
  .sidebar {
    display: none;
  }
}
</style>
