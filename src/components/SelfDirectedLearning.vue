<template>
    <div class="self-directed-learning-page">
      <h1 class="page-title">Self-Directed Learning Resources</h1>
      
      <div class="search-filter-container">
        <div class="search-bar-wrapper">
          <input v-model="searchQuery" type="text" placeholder="Search resources..." class="search-bar" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-options">
          <select v-model="selectedType" class="type-filter">
            <option value="All">All Types</option>
            <option v-for="type in resourceTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>
  
      <div v-for="type in resourceTypes" :key="type" class="resource-section" v-show="selectedType === 'All' || selectedType === type">
        <h2 class="resource-type-title">{{ type }}</h2>
        <div class="resources-grid">
          <div v-for="resource in filteredResourcesByType(type)" :key="resource.id" class="resource-card">
            <img :src="resource.imageUrl" :alt="resource.title" class="resource-image" />
            <div class="resource-info">
              <h3 class="resource-title">{{ resource.title }}</h3>
              <p class="resource-author">By {{ resource.author }}</p>
              <p class="resource-description">{{ resource.description }}</p>
              <a :href="resource.link" target="_blank" rel="noopener noreferrer" class="resource-link">Access Resource</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
        selectedType: 'All',
        learningResources: [
            {
                "id": 1,
                "type": "Book",
                "title": "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
                "author": "James Clear",
                "description": "This book can help you build good learning habits and create a conducive environment for self-directed learning.",
                "imageUrl": "https://m.media-amazon.com/images/I/81ANaVZk5LL._SL1500_.jpg",
                "link": "https://www.amazon.com/Atomic-Habits-Build-Good-Break/dp/0735211299"
            },
            {
                "id": 2,
                "type": "Book",
                "title": "Mindset: The New Psychology of Success",
                "author": "Carol S. Dweck",
                "description": "This book explores the importance of a growth mindset for lifelong learning and resilience.",
                "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/41491875-5L.jpg",
                "link": "https://www.amazon.com/Mindset-New-Psychology-Success/dp/0345472300"
            },
            {
                "id": 3,
                "type": "Article",
                "title": "The Importance of Self-Directed Learning in the 21st Century",
                "author": "Forbes",
                "description": "An article discussing the relevance of self-directed learning in today's rapidly changing world.",
                "imageUrl": "https://www.forbes.com/sites/forbes-coaches-council/2023/11/01/the-importance-of-self-directed-learning-in-the-21st-century/",
                "link": "https://www.forbes.com/sites/forbes-coaches-council/2023/11/01/the-importance-of-self-directed-learning-in-the-21st-century/"
            },
            {
                "id": 4,
                "type": "Article",
                "title": "How to Become a Self-Directed Learner: A Step-by-Step Guide",
                "author": "The Muse",
                "description": "A practical guide to developing the skills and mindset of a self-directed learner.",
                "imageUrl": "https://themuse.com/advice/how-to-become-a-self-directed-learner",
                "link": "https://themuse.com/advice/how-to-become-a-self-directed-learner"
            },
            {
                "id": 5,
                "type": "Course",
                "title": "Learning How to Learn",
                "author": "Coursera",
                "description": "A popular Coursera course that teaches you how to learn more effectively and efficiently.",
                "imageUrl": "https://d3nvu70yv6obhv.cloudfront.net/f_u321/1640320238/Learning_How_to_Learn_2023_03.jpg",
                "link": "https://www.coursera.org/learn/learning-how-to-learn"
            },
            {
                "id": 6,
                "type": "Course",
                "title": "The Self-Directed Learner Specialization",
                "author": "edX",
                "description": "A comprehensive specialization on edX that covers the principles, practices, and tools for self-directed learning.",
                "imageUrl": "https://images.edx.org/course-cover/image/Self-Directed_Learner_Specialization/6198_1.jpg",
                "link": "https://www.edx.org/professional/self-directed-learner-specialization"
            },
            {
                "id": 7,
                "type": "Video",
                "title": "The Power of Self-Directed Learning",
                "author": "TED",
                "description": "A TED talk by Daphne Koller that highlights the importance of self-directed learning in the digital age.",
                "imageUrl": "https://i.ytimg.com/vi/pBv0KEZWldk/hqdefault.jpg",
                "link": "https://www.youtube.com/watch?v=pBv0KEZWldk"
            },
            {
                "id": 8,
                "type": "Video",
                "title": "How to Learn Anything: The Anki Method",
                "author": "YouTube",
                "description": "A tutorial on using Anki, a popular flashcard app, for efficient learning.",
                "imageUrl": "https://i.ytimg.com/vi/j4q-X-5r30w/hqdefault.jpg",
                "link": "https://www.youtube.com/watch?v=j4q-X-5r30w"
            },
            {
                "id": 9,
                "type": "Tool",
                "title": "Anki",
                "author": "Anki",
                "description": "A powerful flashcard program for efficient memorization.",
                "imageUrl": "https://apps.ankiweb.net/images/anki-logo.png",
                "link": "https://apps.ankiweb.net/"
            },
            {
                "id": 10,
                "type": "Tool",
                "title": "Evernote",
                "author": "Evernote",
                "description": "A versatile note-taking and organization tool for managing learning materials.",
                "imageUrl": "https://www.evernote.com/favicon.ico",
                "link": "https://www.evernote.com/"
            },
            {
                "id": 11,
                "type": "Book",
                "title": "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
                "author": "James Clear",
                "description": "This book can help you build good learning habits and create a conducive environment for self-directed learning.",
                "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/716+5205-RL.jpg",
                "link": "https://www.amazon.com/Atomic-Habits-Build-Good-Break/dp/0735211299"
            },
            {
                "id": 12,
                "type": "Book",
                "title": "Mindset: The New Psychology of Success",
                "author": "Carol S. Dweck",
                "description": "This book explores the importance of a growth mindset for lifelong learning and resilience.",
                "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/41491875-5L.jpg",
                "link": "https://www.amazon.com/Mindset-New-Psychology-Success/dp/0345472300"
            },
            {
                "id": 13,
                "type": "Article",
                "title": "The Importance of Self-Directed Learning in the 21st Century",
                "author": "Forbes",
                "description": "An article discussing the relevance of self-directed learning in today's rapidly changing world.",
                "imageUrl": "https://www.forbes.com/sites/forbes-coaches-council/2023/11/01/the-importance-of-self-directed-learning-in-the-21st-century/",
                "link": "https://www.forbes.com/sites/forbes-coaches-council/2023/11/01/the-importance-of-self-directed-learning-in-the-21st-century/"
            },
            {
                "id": 14,
                "type": "Article",
                "title": "How to Become a Self-Directed Learner: A Step-by-Step Guide",
                "author": "The Muse",
                "description": "A practical guide to developing the skills and mindset of a self-directed learner.",
                "imageUrl": "https://themuse.com/advice/how-to-become-a-self-directed-learner",
                "link": "https://themuse.com/advice/how-to-become-a-self-directed-learner"
            },
            {
                "id": 15,
                "type": "Course",
                "title": "Learning How to Learn",
                "author": "Coursera",
                "description": "A popular Coursera course that teaches you how to learn more effectively and efficiently.",
                "imageUrl": "https://d3nvu70yv6obhv.cloudfront.net/f_u321/1640320238/Learning_How_to_Learn_2023_03.jpg",
                "link": "https://www.coursera.org/learn/learning-how-to-learn"
            },
            {
                "id": 16,
                "type": "Course",
                "title": "The Self-Directed Learner Specialization",
                "author": "edX",
                "description": "A comprehensive specialization on edX that covers the principles, practices, and tools for self-directed learning.",
                "imageUrl": "https://images.edx.org/course-cover/image/Self-Directed_Learner_Specialization/6198_1.jpg",
                "link": "https://www.edx.org/professional/self-directed-learner-specialization"
            },
            {
                "id": 17,
                "type": "Video",
                "title": "The Power of Self-Directed Learning",
                "author": "TED",
                "description": "A TED talk by Daphne Koller that highlights the importance of self-directed learning in the digital age.",
                "imageUrl": "https://i.ytimg.com/vi/pBv0KEZWldk/hqdefault.jpg",
                "link": "https://www.youtube.com/watch?v=pBv0KEZWldk"
            },
            {
                "id": 18,
                "type": "Video",
                "title": "How to Learn Anything: The Anki Method",
                "author": "YouTube",
                "description": "A tutorial on using Anki, a popular flashcard app, for efficient learning.",
                "imageUrl": "https://i.ytimg.com/vi/j4q-X-5r30w/hqdefault.jpg",
                "link": "https://www.youtube.com/watch?v=j4q-X-5r30w"
            },
            {
                "id": 19,
                "type": "Tool",
                "title": "Anki",
                "author": "Anki",
                "description": "A powerful flashcard program for efficient memorization.",
                "imageUrl": "https://apps.ankiweb.net/images/anki-logo.png",
                "link": "https://apps.ankiweb.net/"
            },
            {
                "id": 20,
                "type": "Tool",
                "title": "Evernote",
                "author": "Evernote",
                "description": "A versatile note-taking and organization tool for managing learning materials.",
                "imageUrl": "https://www.evernote.com/favicon.ico",
                "link": "https://www.evernote.com/"
            }
        ]
      };
    },
    computed: {
      resourceTypes() {
        return [...new Set(this.learningResources.map(r => r.type))];
      }
    },
    methods: {
      filteredResourcesByType(type) {
        return this.learningResources.filter(resource => 
          resource.type === type &&
          (resource.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
           resource.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      }
    }
  };
  </script>
  
  <style scoped>
  .self-directed-learning-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    z-index: -1;
  }
  
  .page-title {
    text-align: center;
    font-size: 2.5em;
    color: #2c3e50;
    margin-bottom: 30px;
  }
  
  .search-filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .search-bar-wrapper {
    position: relative;
    width: 50%;
  }
  
  .search-bar {
    width: 100%;
    padding: 10px 40px 10px 20px;
    border: 2px solid #3498db;
    border-radius: 25px;
    font-size: 16px;
  }
  
  .search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #3498db;
  }
  
  .type-filter {
    padding: 10px;
    border: 2px solid #3498db;
    border-radius: 25px;
    font-size: 16px;
    background-color: white;
    color: #2c3e50;
  }
  
  .resource-section {
    margin-bottom: 40px;
  }
  
  .resource-type-title {
    font-size: 1.8em;
    color: #2c3e50;
    margin-bottom: 20px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
  }
  
  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
  }
  
  .resource-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: white;
  }
  
  .resource-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .resource-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .resource-info {
    padding: 20px;
  }
  
  .resource-title {
    font-size: 1.2em;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  .resource-author {
    font-size: 0.9em;
    color: #7f8c8d;
    margin-bottom: 10px;
  }
  
  .resource-description {
    font-size: 0.9em;
    color: #34495e;
    margin-bottom: 15px;
  }
  
  .resource-link {
    display: inline-block;
    padding: 10px 20px;
    background-color: #9834db;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  .resource-link:hover {
    background-color: #9729b9;
  }
  </style>