<template>
  <div>
    <div class="flex flex-col lg:flex-row items-center justify-between p-12 bg-gradient-to-r relative">
      <div class="w-full lg:w-1/2 p-6">
        <h1 class="text-5xl font-bold text-black animate-vibrate">Get in Touch</h1>
        <p class="mt-4 text-lg text-black">
          We would love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out. Our team is dedicated to providing you with the best support and assistance. Your inquiries are important to us, and we strive to respond promptly. Let's connect and work together to make your experience even better!
        </p>
      </div>
      <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow-lg p-8 w-full lg:w-1/2 mt-6 lg:mt-0">
        <h2 class="text-xl font-bold mb-4">Drop a Message</h2>
        <div class="mb-4">
          <label for="full-name" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            v-model="formData.fullName"
            type="text"
            id="full-name"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
          />
        </div>

        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
          <input
            v-model="formData.phone"
            type="tel"
            id="phone"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="formData.email"
            type="email"
            id="email"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
          />
        </div>

        <div class="mb-4">
          <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
          <input
            v-model="formData.subject"
            type="text"
            id="subject"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
          />
        </div>

        <div class="mb-4">
          <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            v-model="formData.message"
            id="message"
            rows="4"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        fullName: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },
  methods: {
    submitForm() {
      console.log('Form submitted:', this.formData);
      // Handle form submission, e.g., send data to an API
      this.formData = { fullName: '', phone: '', email: '', subject: '', message: '' }; // Reset the form
    }
  }
};
</script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(to top, #d9ccf2, #ffffff); /* Dark purple at the bottom, light purple at the top */
}

</style>
