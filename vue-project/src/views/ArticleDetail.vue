<template>
  <div class="article-detail">
    <div v-if="loading">
      <p>Chargement des détails de l'article...</p>
    </div>
    <div v-else-if="article">
      <div v-if="isEditing">
        <h1>Modifier l'article</h1>
        <!-- Formulaire pour modifier l'article -->
        <form @submit.prevent="submitUpdate" class="form">
          <input v-model="updatedTitle" placeholder="Titre" />
          <textarea
            v-model="updatedDescription"
            placeholder="Description"
          ></textarea>
          <textarea v-model="updatedBody" placeholder="Contenu"></textarea>
          <div class="form-buttons">
            <button type="submit">Enregistrer les modifications</button>
            <button type="button" @click="cancelEdit">Annuler</button>
          </div>
        </form>
      </div>
      <div v-else>
        <!-- Affichage des détails de l'article -->
        <h1>{{ article.title }}</h1>
        <p class="description">
          <strong>Description :</strong> {{ article.description }}
        </p>
        <p class="body"><strong>Contenu :</strong> {{ article.body }}</p>
        <p class="favorites-count-small">
          Favoris : {{ article.favoritesCount }}
        </p>
        <div class="buttons">
          <button @click="toggleFavorite">
            {{
              article.favorited ? "Retirer des favoris" : "Ajouter aux favoris"
            }}
          </button>
          <button @click="startEdit">Modifier l'article</button>
        </div>
      </div>

      <section class="comments-section">
        <h2>Commentaires</h2>
        <!-- Formulaire pour ajouter un commentaire -->
        <form @submit.prevent="submitComment" class="comment-form">
          <textarea
            v-model="newComment"
            placeholder="Écrire un commentaire..."
            rows="3"
          ></textarea>
          <button type="submit">Ajouter un commentaire</button>
        </form>

        <!-- Liste des commentaires -->
        <ul v-if="comments.length" class="comments-list">
          <li
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-content">
              <p>{{ comment.body }}</p>
              <small
                >Écrit par : {{ comment.author?.username || "Inconnu" }}</small
              >
            </div>
            <button @click="deleteComment(comment.id)" class="delete-btn">
              Supprimer
            </button>
          </li>
        </ul>
        <p v-else>Aucun commentaire pour cet article.</p>
      </section>
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
    const articlesStore = useArticlesStore(); // Store des articles
    const route = useRoute(); // Récupération des paramètres de la route

    const article = ref(null);
    const comments = ref([]);
    const newComment = ref("");
    const loading = ref(true);

    // État et champs pour la modification
    const isEditing = ref(false);
    const updatedTitle = ref("");
    const updatedDescription = ref("");
    const updatedBody = ref("");

    // Chargement initial de l'article et des commentaires
    onMounted(async () => {
      try {
        const slug = route.params.slug as string;
        if (!slug) throw new Error("Slug manquant");
        await articlesStore.fetchArticle(slug);
        await articlesStore.fetchComments(slug);
        article.value = articlesStore.article;
        comments.value = articlesStore.comments;
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        alert("Impossible de charger l'article.");
      } finally {
        loading.value = false;
      }
    });

    // Gestion des favoris (ajouter/retirer)
    const toggleFavorite = async () => {
      if (!article.value) return;

      try {
        const slug = article.value.slug;
        if (article.value.favorited) {
          await articlesStore.unfavoriteArticle(slug);
        } else {
          await articlesStore.favoriteArticle(slug);
        }
        article.value = articlesStore.article; // Mise à jour locale
      } catch (error) {
        alert("Erreur lors de la gestion des favoris.");
      }
    };

    // Activer le mode édition
    const startEdit = () => {
      if (!article.value) return;
      isEditing.value = true;
      updatedTitle.value = article.value.title;
      updatedDescription.value = article.value.description;
      updatedBody.value = article.value.body;
    };

    // Annuler l'édition
    const cancelEdit = () => {
      isEditing.value = false;
    };

    // Soumettre les modifications
    const submitUpdate = async () => {
      try {
        const slug = article.value?.slug;
        if (!slug) return;

        await articlesStore.updateArticle(slug, {
          title: updatedTitle.value,
          description: updatedDescription.value,
          body: updatedBody.value,
        });

        isEditing.value = false;
        article.value = articlesStore.article;
        alert("Article modifié avec succès !");
      } catch (error) {
        alert("Erreur lors de la modification de l'article.");
      }
    };

    // Ajouter un commentaire
    const submitComment = async () => {
      if (!newComment.value.trim()) return;

      try {
        const slug = article.value?.slug;
        if (!slug) return;

        await articlesStore.addComment(slug, newComment.value);
        comments.value = articlesStore.comments;
        newComment.value = ""; // Réinitialise le champ
        alert("Commentaire ajouté avec succès !");
      } catch (error) {
        alert("Erreur lors de l'ajout du commentaire.");
      }
    };

    // Supprimer un commentaire
    const deleteComment = async (commentId: number) => {
      try {
        const slug = article.value?.slug;
        if (!slug) return;

        await articlesStore.deleteComment(slug, commentId);
        comments.value = articlesStore.comments;
        alert("Commentaire supprimé avec succès !");
      } catch (error) {
        alert("Erreur lors de la suppression du commentaire.");
      }
    };

    return {
      article,
      comments,
      newComment,
      loading,
      isEditing,
      updatedTitle,
      updatedDescription,
      updatedBody,
      toggleFavorite,
      startEdit,
      cancelEdit,
      submitUpdate,
      submitComment,
      deleteComment,
    };
  },
});
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  color: #e0e0e0;
  background-color: #1e1e1e;
  padding: 1.5rem;
  border-radius: 8px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.favorites-count-small {
  font-size: 0.8rem;
  color: #ffbf00;
  margin-top: 1rem;
}

.description,
.body {
  margin-bottom: 1rem;
}

.buttons,
.form-buttons {
  margin-top: 1rem;
}

button {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

button:hover {
  background-color: #0056b3;
}

textarea {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.comments-section {
  margin-top: 2rem;
}

.comments-list {
  list-style: none;
  padding: 0;
}

.comment-item {
  border-bottom: 1px solid #333;
  padding: 1rem 0;
}

.comment-item:last-child {
  border-bottom: none;
}

small {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #bbb;
}

.delete-btn {
  background-color: #dc3545;
}

.delete-btn:hover {
  background-color: #a71d2a;
}

.comment-form {
  margin-bottom: 2rem;
}
</style>
