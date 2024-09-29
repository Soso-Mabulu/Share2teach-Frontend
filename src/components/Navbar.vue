<script>
import {RouterLink} from 'vue-router';

export default {
    name: 'Navbar',
};
</script>

<template>
    <nav class="bg-blue-400 p-4 ">
        <div class="container mx-auto flex justify-between items-center">
            <div class="text-white text-lg font-bold">
                Share2Teach
            </div>
            <ul class="flex space-x-4">
                <li>
                    <a href="/" class="text-white hover:text-gray-200">Home</a>
                </li>
                <li>
                    <a href="/about" class="text-white hover:text-gray-200">About</a>
                </li>
                <li>
                    <a href="/courses" class="text-white hover:text-gray-200">Courses</a>
                </li>
                <li>
                    <a href="/contact" class="text-white hover:text-gray-200">Contact</a>
                </li>
            </ul>
        </div>
    </nav>
</template>


<style scoped>
/* Add any additional styling here if needed */
</style>