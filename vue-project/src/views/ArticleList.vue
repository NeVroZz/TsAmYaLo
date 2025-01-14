<template>
  <div>
    <h1>Liste des articles</h1>
    <button @click="goToCreate">Créer un nouvel article</button>
    <div v-if="articles.length">
      <ul>
        <li v-for="article in articles" :key="article.slug">
          <router-link :to="`/articles/${article.slug}`">{{ article.title }}</router-link>
          <button @click="deleteArticle(article.slug)">Supprimer</button>
          <button @click="goToEdit(article.slug)">Modifier</button>
        </li>
      </ul>
    </div>
    <p v-else>Aucun article disponible.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useArticlesStore } from "../stores/articles";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore();
    const router = useRouter();

    // Charger les articles au montage
    onMounted(async () => {
      await articlesStore.fetchArticles();
    });

    const articles = computed(() => articlesStore.articles);

    const deleteArticle = async (slug: string) => {
      if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
        try {
          await articlesStore.deleteArticle(slug); // Supprime l'article
          alert("Article supprimé avec succès !");
        } catch (error) {
          alert("Erreur lors de la suppression de l'article.");
          console.error(error);
        }
      }
    };

    const goToCreate = () => {
      router.push("/articles/create"); // Redirige vers la page de création
    };

    const goToEdit = (slug: string) => {
      router.push(`/articles/${slug}/edit`); // Redirige vers la page d'édition
    };

    return { articles, deleteArticle, goToCreate, goToEdit };
  },
});
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
