<template>
  <div>
    <ul v-if="documents.length">
      <li v-for="document in documents" :key="document.Id">
        {{ document.description }} - {{ document.module }}
      </li>
    </ul>
    <p v-if="showNoDocumentsMessage">No documents found.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      documents: [],
      showNoDocumentsMessage: false, // Controls the visibility of the no documents message
    };
  },
  created() {
    // Fetch documents when component is created
    this.fetchDocuments(this.$route.query.endpoint);
  },
  methods: {
    async fetchDocuments(endpoint) {
      if (endpoint) {
        try {
          const response = await this.$http.get(endpoint); // Ensure you use the correct HTTP client (Axios, VueResource, etc.)
          this.documents = response.data.documents || [];

          if (!this.documents.length) {
            this.showNoDocumentsMessage = true;
            setTimeout(() => {
              this.showNoDocumentsMessage = false;
            }, 3000);
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      }
    },
  },
};
</script>
