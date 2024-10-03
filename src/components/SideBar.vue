<template>
  <div :class="['sidebar', { expanded: isExpanded }]">
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
          <router-link :to="link.route">
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
.sidebar {
  width: 60px;
  background-color: #a8b5c5;
  height: 100vh;
  transition: width 0.3s ease;
  overflow-x: hidden;
  position: relative;
}

.sidebar.expanded {
  width: 200px;
}

.toggle-btn {
  background-color: #8191a0;
  color: #ffffff;
  padding: 10px;
  text-align: center;
  cursor: pointer;
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

nav ul li a {
  text-decoration: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 10px 20px;
}

nav ul li a:hover {
  background-color: #8191a0;
}

.icon {
  font-size: 1.5em;
  margin-right: 15px;
  transition: margin 0.3s ease;
}

.sidebar:not(.expanded) .icon {
  margin-right: 0;
}

.sidebar:not(.expanded) nav ul li a {
  justify-content: center;
}
</style>
