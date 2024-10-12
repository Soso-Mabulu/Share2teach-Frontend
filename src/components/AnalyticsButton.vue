<!-- ButtonComponent.vue -->
<template>
  <div class="button-container">
    <button class="view-all" @click="navigateToDetailView">
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    endpoint: {
      type: String,
      required: true,
    },
    buttonLabel: {
      type: String,
      default: "View Data",
    },
  },
  methods: {
    navigateToDetailView() {
      // Navigate to the detailed view with the endpoint as a query parameter
      this.$router.push({
        name: "DetailedView",
        query: { endpoint: this.endpoint },
      });
    },
  },
};
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.view-all {
  background: linear-gradient(to right, #739ea9, #f7f5f8, #2c4475);
  border: none;
  border-radius: 9999px;
  padding: 7px 20px;
  cursor: pointer;
  font-weight: bold;
  color: rgb(44, 25, 46);
  width: 150px;
  transition: transform 0.3s ease-in-out, background 0.3s ease-in-out;
}

.view-all:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #c2b2c7, #f8f1fa, #e4e3e4);
}
</style>
