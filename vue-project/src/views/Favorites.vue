<template>
  <div id="favorites-container">
    <div id="favorites-box">
      <h1>Mes Favoris</h1>
      <!-- Affiche la liste des articles favoris si elle contient des articles -->
      <div v-if="favorites.length" class="favorites-list">
        <ul>
          <!-- Lien vers chaque article favori -->
          <li v-for="article in favorites" :key="article.slug">
            <router-link :to="`/articles/${article.slug}`">{{
              article.title
            }}</router-link>
          </li>
        </ul>
      </div>
      <!-- Message lorsque la liste des favoris est vide -->
      <p v-else>Aucun article dans vos favoris.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useArticlesStore } from "../stores/articles";

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore(); // Store pour gérer les articles

    // Récupère uniquement les articles marqués comme favoris
    const favorites = computed(() =>
      articlesStore.articles.filter((article) => article.favorited)
    );

    // Charge les articles si ce n'est pas déjà fait
    onMounted(async () => {
      if (articlesStore.articles.length === 0) {
        await articlesStore.fetchArticles(); // Récupère les articles depuis l'API
      }
    });

    return { favorites }; // Expose les favoris au template
  },
});
</script>

<style scoped>
#favorites-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
}

#favorites-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  background-color: #2e2e2e;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  padding: 1rem;
  text-align: center;
  color: #e0e0e0;
}

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
