<template>
  <div v-if="article">
    <h1>{{ article.title }}</h1>
    <p>{{ article.body }}</p>
    <button @click="toggleFavorite(article)">
      {{ article.favorited ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
    </button>
  </div>
  <div v-else-if="errorMessage">
    <p>{{ errorMessage }}</p>
  </div>
  <div v-else>
    <p>Chargement des détails de l'article...</p>
  </div>
</template>




<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useArticlesStore } from '../stores/articles';

export default defineComponent({
  setup() {
    // Variables locales
    const route = useRoute(); // Permet de récupérer le slug depuis l'URL
    const articlesStore = useArticlesStore(); // Store des articles
    const article = ref<any | null>(null); // Stocke l'article chargé
    const errorMessage = ref<string | null>(null); // Stocke un message d'erreur s'il y en a

    // Charger l'article au montage du composant
    onMounted(async () => {
      try {
        const slug = route.params.slug as string; // Récupération du slug dans l'URL
        article.value = await articlesStore.fetchArticle(slug); // Charge les données de l'article
      } catch (error) {
        errorMessage.value = 'Erreur : Impossible de charger l’article.'; // Message en cas d'erreur
        console.error('Erreur lors du chargement de l’article :', error);
      }
    });

    // Fonction pour gérer l'ajout ou le retrait des favoris
    const toggleFavorite = async (article: any) => {
      try {
        if (article.favorited) {
          await articlesStore.unfavoriteArticle(article.slug); // Retirer des favoris
        } else {
          await articlesStore.favoriteArticle(article.slug); // Ajouter aux favoris
        }
        article.value = await articlesStore.fetchArticle(article.slug); // Recharge l'article
      } catch (error) {
        errorMessage.value = 'Erreur lors de la modification des favoris.'; // Message en cas d'erreur
        console.error(error);
      }
    };

    // Retourne les données et fonctions pour le template
    return { article, errorMessage, toggleFavorite };
  },
});
</script>