<template>
  <div>
    <div v-if="loading">
      <p>Chargement des détails de l'article...</p>
    </div>
    <div v-else-if="article">
      <h1>{{ article.title }}</h1>
      <p><strong>Description :</strong> {{ article.description }}</p>
      <p><strong>Contenu :</strong> {{ article.body }}</p>
      <button @click="toggleFavorite">
        {{ article.favorited ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
      </button>
    </div>
    <div v-else>
      <p>Aucun article trouvé pour ce slug.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useArticlesStore } from "../stores/articles";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore();
    const route = useRoute();

    const article = ref(null);
    const loading = ref(true);

    onMounted(async () => {
      try {
        const slug = route.params.slug as string;
        await articlesStore.fetchArticle(slug);
        article.value = articlesStore.article;
      } catch (error) {
        console.error("Erreur lors du chargement des détails de l'article :", error);
        alert("Impossible de charger l'article.");
      } finally {
        loading.value = false;
      }
    });

    const toggleFavorite = async () => {
      if (!article.value) return;

      try {
        const slug = article.value.slug;
        if (article.value.favorited) {
          await articlesStore.unfavoriteArticle(slug);
        } else {
          await articlesStore.favoriteArticle(slug);
        }
        article.value = articlesStore.article; // Met à jour localement
      } catch (error) {
        alert("Erreur lors de la gestion des favoris.");
      }
    };

    return { article, loading, toggleFavorite };
  },
});
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}

button {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>