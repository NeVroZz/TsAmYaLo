<template>
  <div id="app">
    <h1>Liste des articles</h1>
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

    const filters = reactive({
      author: "",
      tag: "",
      favorited: "",
    });

    const loadArticles = async () => {
      await articlesStore.fetchArticles(filters);
    };

    const applyFilters = async () => {
      await loadArticles();
    };

    const resetFilters = async () => {
      filters.author = "";
      filters.tag = "";
      filters.favorited = "";
      await loadArticles();
    };

    const deleteArticle = async (slug: string) => {
      if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
        await articlesStore.deleteArticle(slug);
        await loadArticles();
      }
    };

    const goToCreate = () => {
      router.push("/articles/create");
    };

    onMounted(loadArticles);

    return {
      articles: computed(() => articlesStore.articles),
      filters,
      applyFilters,
      resetFilters,
      deleteArticle,
      goToCreate,
    };
  },
});
</script>

<style scoped>/* Main app container */
#app {
  display: flex;
  flex-direction: column;
  align-items: center; /* Horizontal centering */
  justify-content: flex-start; /* Align content to the top */
  width: 100%;
  max-width: 800px; /* Limit width for readability */
  padding: 2rem;
  background-color: #2e2e2e; /* Slightly lighter background for the app */
  height: auto; /* Automatically adjust height to fit content */
  border-radius: 8px; /* Optional: Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Optional: Subtle shadow */
}

/* Filters container */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center filters horizontally */
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  padding: 5px;
}

/* Articles container */
.artdiv {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center articles horizontally */
  justify-content: flex-start; /* Align articles from the top */
  width: 100%;
  max-width: 800px; /* Limit the container width */
  height: 50vh; /* Set a fixed height for the scrollable area */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #444; /* Add a border for visual separation */
  padding: 1rem;
  border-radius: 8px; /* Optional: Rounded corners */
  background-color: #1e1e1e; /* Slightly darker background for contrast */
}

/* Articles list */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Add spacing between articles */
}

/* Individual article */
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #2e2e2e;
  width: 100%; /* Take full width of the container */
  box-sizing: border-box; /* Include padding and border in width */
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
