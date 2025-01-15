<template>
  <!-- Composant de création d'article -->
  <div class="article-create">
    <h1>Créer un nouvel article</h1>
    <!-- Formulaire de création -->
    <form @submit.prevent="handleSubmit" class="article-form">
      <!-- Champ pour le titre -->
      <div class="form-group">
        <label for="title">Titre</label>
        <input v-model="form.title" id="title" required />
      </div>
      <!-- Champ pour la description -->
      <div class="form-group">
        <label for="description">Description</label>
        <input v-model="form.description" id="description" required />
      </div>
      <!-- Champ pour le contenu principal -->
      <div class="form-group">
        <label for="body">Contenu</label>
        <textarea v-model="form.body" id="body" rows="5" required></textarea>
      </div>
      <!-- Champ pour les tags -->
      <div class="form-group">
        <label for="tags">Tags (séparés par des virgules)</label>
        <input
          v-model="form.tags"
          id="tags"
          placeholder="Ex: technologie, programmation"
        />
      </div>
      <!-- Message d'erreur (affiché uniquement si une erreur survient) -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <!-- Bouton de soumission -->
      <button type="submit" class="submit-btn">Créer</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue"; // Import des outils Vue nécessaires
import { useRouter } from "vue-router"; // Import du routeur pour la redirection
import { useArticlesStore } from "../stores/articles"; // Import du store des articles

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore(); // Récupère le store pour interagir avec les articles
    const router = useRouter(); // Permet de gérer la navigation

    // Objet réactif pour stocker les données du formulaire
    const form = reactive({
      title: "",
      description: "",
      body: "",
      tags: "",
    });

    const errorMessage = ref(""); // Message d'erreur réactif

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async () => {
      try {
        errorMessage.value = ""; // Réinitialise le message d'erreur

        // Transforme la chaîne de tags en tableau
        const tagsArray = form.tags
          .split(",")
          .map((tag) => tag.trim()) // Supprime les espaces autour des tags
          .filter((tag) => tag !== ""); // Retire les tags vides

        // Appelle la méthode pour créer un nouvel article
        await articlesStore.createArticle({
          title: form.title,
          description: form.description,
          body: form.body,
          tagList: tagsArray,
        });

        alert("Article créé avec succès !"); // Confirme la réussite
        router.push("/articles"); // Redirige vers la liste des articles
      } catch (error) {
        console.error("Erreur lors de la création de l'article :", error);

        // Définit un message d'erreur basé sur la réponse du serveur
        errorMessage.value =
          error?.response?.data?.message || "Une erreur est survenue.";
        alert("Erreur lors de la création de l'article."); // Affiche une alerte en cas d'échec
      }
    };

    // Retourne les données et méthodes nécessaires au template
    return { form, errorMessage, handleSubmit };
  },
});
</script>

<style scoped>
.article-create {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-radius: 8px;
}

.article-create h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.article-form .form-group {
  margin-bottom: 1.5rem;
}

.article-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.article-form input,
.article-form textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #2e2e2e;
  color: #e0e0e0;
}

.article-form input:focus,
.article-form textarea:focus {
  outline: none;
  border-color: #007bff;
}

.article-form .submit-btn {
  display: block;
  width: 100%;
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.article-form .submit-btn:hover {
  background-color: #0056b3;
}

.error-message {
  margin-bottom: 1rem;
  color: #ff4d4f;
  font-weight: bold;
  text-align: center;
}
</style>
