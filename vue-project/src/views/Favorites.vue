<template>
    <div>
      <h1>Mes Favoris</h1>
      <div v-if="favorites.length">
        <ul>
          <li v-for="article in favorites" :key="article.slug">
            <router-link :to="`/articles/${article.slug}`">{{ article.title }}</router-link>
          </li>
        </ul>
      </div>
      <p v-else>Aucun article dans vos favoris.</p>
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