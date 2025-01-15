<template>
  <div id="app">
    <h1>Liste des articles</h1>
    <!-- Bouton pour naviguer vers la création d'un nouvel article -->
    <button @click="goToCreate">Créer un nouvel article</button>

    <!-- Champs de filtres -->
    <div class="filters">
      <input v-model="filters.author" placeholder="Auteur" />
      <input v-model="filters.tag" placeholder="Tag" />
      <input v-model="filters.favorited" placeholder="Favoris (utilisateur)" />
      <button @click="applyFilters">Appliquer les filtres</button>
      <button @click="resetFilters">Réinitialiser</button>
    </div>

    <!-- Liste des articles -->
    <div class="artdiv" v-if="articles.length">
      <ul>
        <li v-for="article in articles" :key="article.slug">
          <!-- Lien vers les détails d'un article -->
          <router-link :to="`/articles/${article.slug}`">{{
            article.title
          }}</router-link>
          <p>Auteur : {{ article.author.username }}</p>
          <!-- Bouton pour supprimer un article -->
          <button @click="deleteArticle(article.slug)">Supprimer</button>
        </li>
      </ul>
    </div>
    <!-- Message si aucun article n'est disponible -->
    <p v-else>Aucun article disponible.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "vue";
import { useArticlesStore } from "../stores/articles";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore(); // Store pour gérer les articles
    const router = useRouter(); // Router pour naviguer dans l'application

    // Données des filtres pour filtrer les articles
    const filters = reactive({
      author: "",
      tag: "",
      favorited: "",
    });

    // Charge les articles en fonction des filtres
    const loadArticles = async () => {
      await articlesStore.fetchArticles(filters);
    };

    // Applique les filtres
    const applyFilters = async () => {
      await loadArticles();
    };

    // Réinitialise les filtres
    const resetFilters = async () => {
      filters.author = "";
      filters.tag = "";
      filters.favorited = "";
      await loadArticles();
    };

    // Supprime un article et recharge la liste
    const deleteArticle = async (slug: string) => {
      if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
        await articlesStore.deleteArticle(slug);
        await loadArticles();
      }
    };

    // Redirige vers la page de création d'article
    const goToCreate = () => {
      router.push("/articles/create");
    };

    // Charge les articles au montage du composant
    onMounted(loadArticles);

    return {
      articles: computed(() => articlesStore.articles), // Liste des articles à afficher
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
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  background-color: #2e2e2e;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  padding: 5px;
}

.artdiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 800px;
  height: 50vh;
  overflow-y: auto;
  border: 1px solid #444;
  padding: 1rem;
  border-radius: 8px;
  background-color: #1e1e1e;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #2e2e2e;
  width: 100%;
  box-sizing: border-box;
}

/* Buttons */
button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* Heading */
h1 {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}
</style>
