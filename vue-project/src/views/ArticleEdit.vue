<template>
  <div>
    <!-- Affiche un message de chargement pendant la récupération des données -->
    <div v-if="loading">
      <p>Chargement de l'article...</p>
    </div>

    <!-- Formulaire pour modifier l'article si les données sont disponibles -->
    <div v-else-if="form.title">
      <h1>Modifier l'article</h1>
      <form @submit.prevent="updateArticle">
        <div>
          <label for="title">Titre</label>
          <input v-model="form.title" type="text" id="title" required />
        </div>
        <div>
          <label for="description">Description</label>
          <input
            v-model="form.description"
            type="text"
            id="description"
            required
          />
        </div>
        <div>
          <label for="body">Contenu</label>
          <textarea v-model="form.body" id="body" required></textarea>
        </div>
        <button type="submit">Enregistrer les modifications</button>
      </form>
    </div>

    <!-- Affiche un message si aucun article n'est trouvé -->
    <div v-else>
      <p>Aucun article trouvé pour ce slug.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useArticlesStore } from "../stores/articles";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore(); // Store pour gérer les articles
    const route = useRoute(); // Accès aux paramètres de la route
    const router = useRouter(); // Permet de rediriger après modification

    // Objet pour stocker les données de l'article
    const form = ref({
      title: "",
      description: "",
      body: "",
    });
    const loading = ref(true); // Indique si les données sont en cours de chargement

    // Chargement des données lors du montage du composant
    onMounted(async () => {
      try {
        const slug = route.params.slug as string; // Récupère le slug de l'article depuis l'URL
        await articlesStore.fetchArticle(slug); // Récupère l'article depuis le store
        const article = articlesStore.article;

        if (article) {
          // Remplit le formulaire avec les données de l'article
          form.value.title = article.title;
          form.value.description = article.description;
          form.value.body = article.body;
        } else {
          console.error("Article non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'article :", error);
      } finally {
        loading.value = false; // Fin du chargement
      }
    });

    // Fonction pour mettre à jour l'article
    const updateArticle = async () => {
      try {
        const slug = route.params.slug as string; // Slug de l'article
        await articlesStore.updateArticle(slug, form.value); // Met à jour l'article via le store
        router.push("/articles"); // Redirige vers la liste des articles après la modification
      } catch (error) {
        alert("Erreur lors de la modification de l'article.");
      }
    };

    return { form, loading, updateArticle }; // Données et fonctions accessibles au template
  },
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

label {
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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
