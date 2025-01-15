<template>
  <div>
    <h1>Liste des articles</h1>
    <button @click="goToCreate">Créer un nouvel article</button>

    <!-- Champs de filtres -->
    <div>
      <input v-model="filters.author" placeholder="Auteur" />
      <input v-model="filters.tag" placeholder="Tag" />
      <input v-model="filters.favorited" placeholder="Favoris (utilisateur)" />
      <button @click="applyFilters">Appliquer les filtres</button>
      <button @click="resetFilters">Réinitialiser</button>
    </div>

    <!-- Liste des articles -->
    <div v-if="articles.length">
      <ul>
        <li v-for="article in articles" :key="article.slug">
          <router-link :to="`/articles/${article.slug}`">{{ article.title }}</router-link>
          <p>Auteur : {{ article.author.username }}</p>
          <button @click="deleteArticle(article.slug)">Supprimer</button>
        </li>
      </ul>
    </div>
    <p v-else>Aucun article disponible.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "vue";
import { useArticlesStore } from "../stores/articles";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore();
    const router = useRouter();

    // Filtres réactifs
    const filters = reactive({
      author: "",
      tag: "",
      favorited: "",
    });

    // Charger les articles
    const loadArticles = async () => {
      await articlesStore.fetchArticles(filters);
    };

    // Appliquer les filtres
    const applyFilters = async () => {
      await loadArticles();
    };

    // Réinitialiser les filtres
    const resetFilters = async () => {
      filters.author = "";
      filters.tag = "";
      filters.favorited = "";
      await loadArticles();
    };

    // Supprimer un article
    const deleteArticle = async (slug: string) => {
      if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
        await articlesStore.deleteArticle(slug);
        await loadArticles(); // Recharge les articles après suppression
      }
    };

    // Rediriger vers la création d'un nouvel article
    const goToCreate = () => {
      router.push("/articles/create");
    };

    onMounted(loadArticles);

    return {
      articles: computed(() => articlesStore.articles), // Utilisation de computed pour réactivité
      filters,
      applyFilters,
      resetFilters,
      deleteArticle,
      goToCreate,
    };
  },
});
</script>

<style scoped>
/* Exemple de styles (à personnaliser selon vos besoins) */
button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

input {
  margin: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
