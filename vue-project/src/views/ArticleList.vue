<template>
  <div v-if="articlesStore.articles.length">
    <ul>
      <li v-for="article in articlesStore.articles" :key="article.slug">
        <router-link :to="`/articles/${article.slug}`">{{ article.title }}</router-link>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Aucun article disponible ou non connecté.</p>
  </div>
</template>



<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useArticlesStore } from '../stores/articles';

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore();

    onMounted(() => {
      articlesStore.fetchArticles();
    });

    const toggleFavorite = async (article: any) => {
      if (article.favorited) {
        await articlesStore.unfavoriteArticle(article.slug);
      } else {
        await articlesStore.favoriteArticle(article.slug);
      }
      articlesStore.fetchArticles(); // Recharger les articles pour refléter les modifications
    };

    return { articlesStore, toggleFavorite };
  },
});
</script>
