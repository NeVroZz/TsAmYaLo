<template>
  <div id="favorites-container">
    <div id="favorites-box">
      <h1>Mes Favoris</h1>
      <div v-if="favorites.length" class="favorites-list">
        <ul>
          <li v-for="article in favorites" :key="article.slug">
            <router-link :to="`/articles/${article.slug}`">{{ article.title }}</router-link>
          </li>
        </ul>
      </div>
      <p v-else>Aucun article dans vos favoris.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useArticlesStore } from '../stores/articles';

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore();

    // Récupère les articles favoris
    const favorites = computed(() =>
      articlesStore.articles.filter((article) => article.favorited)
    );

    // Charger les articles si ce n'est pas encore fait
    onMounted(async () => {
      if (articlesStore.articles.length === 0) {
        await articlesStore.fetchArticles();
      }
    });

    return { favorites };
  },
});
</script>

<style scoped>
/* Center the main container */
#favorites-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100vh; /* Full viewport height */
  background-color: transparent; /* Change this to match your page */
}

/* Favorites box */
#favorites-box {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  justify-content: center; /* Center content vertically */
  width: 400px; /* Fixed width */
  height: 400px; /* Fixed height (square shape) */
  background-color: #2e2e2e; /* Slightly lighter background */
  border: 1px solid #444; /* Border for separation */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Subtle shadow */
  padding: 1rem; /* Space around content */
  text-align: center;
  color: #e0e0e0;
}

/* Favorites list */
.favorites-list {
  width: 100%;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #3a3a3a;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Heading */
h1 {
  margin-bottom: 1rem;
  color: #ffffff;
}
</style>