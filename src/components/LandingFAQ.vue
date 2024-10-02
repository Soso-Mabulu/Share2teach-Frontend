<template>
  <section class="bg-white">
    <div class="container max-w-4xl px-6 py-10 mx-auto">
      <h1 class="text-2xl font-semibold text-center text-gray-800 lg:text-3xl">
        Frequently Asked Questions
      </h1>

      <div class="mt-12 space-y-8">
        <div v-if="faqs.length === 0" class="text-center text-gray-500">Loading FAQs...</div>
        <div
          v-for="faq in faqs.slice(0, 5)"
          :key="faq.faqId"
          class="border-2 border-gray-300 rounded-lg bg-white shadow-lg"
        >
          <button
            @click="toggleFAQ(faq.faqId)"
            class="flex items-center justify-between w-full p-8 transition-colors duration-300"
          >
            <h1 class="font-semibold text-gray-800">{{ faq.question }}</h1>
            <span
              :class="faqOpen[faq.faqId] ? 'text-white bg-blue-500' : 'text-gray-400 bg-gray-200'"
              class="rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="faqOpen[faq.faqId] ? 'M12 6v6m0 0v6m0-6h6m-6 0H6' : 'M18 12H6'"
                />
              </svg>
            </span>
          </button>
          <hr class="border-gray-300" />
          <p v-if="faqOpen[faq.faqId]" class="p-8 text-sm text-gray-600">
            {{ faq.answer }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive properties
const faqs = ref([])
const faqOpen = ref({})

// Function to fetch FAQs from the API
const fetchFAQs = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/faq/`)
    const data = await response.json()
    if (response.ok) {
      faqs.value = data // Store FAQs in reactive property
      // Initialize FAQ open states
      faqs.value.forEach((faq) => {
        faqOpen.value[faq.faqId] = false
      })
    }
  } catch (error) {
    console.error('Failed to fetch FAQs:', error)
  }
}

// Function to toggle FAQ visibility
const toggleFAQ = (faqId) => {
  faqOpen.value[faqId] = !faqOpen.value[faqId]
}

// Fetch FAQs when the component is mounted
onMounted(fetchFAQs)
</script>

<style scoped>
/* Additional styles for better presentation */
button {
  transition:
    background-color 0.3s,
    color 0.3s;
}

button:hover {
  background-color: rgba(37, 99, 235, 0.1);
}

svg {
  transition: transform 0.3s;
}

button:focus {
  outline: none;
}
</style>
