<template>
    <div>
      <h3>Commentaires</h3>
      <form @submit.prevent="submitComment">
        <textarea v-model="newComment" placeholder="Ajoutez un commentaire"></textarea>
        <button type="submit">Ajouter</button>
      </form>
  
      <ul>
        <li v-for="comment in comments" :key="comment.id">
          <p><strong>{{ comment.author.username }}</strong>: {{ comment.body }}</p>
          <button v-if="isAuthor(comment)" @click="deleteComment(comment.id)">Supprimer</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, computed } from "vue";
  import { useArticlesStore } from "../stores/articles";
  import { useUserStore } from "../stores/user";
  
  export default defineComponent({
    props: {
      slug: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const articlesStore = useArticlesStore();
      const userStore = useUserStore();
      const newComment = ref("");
  
      const comments = computed(() => articlesStore.comments);
  
      const submitComment = async () => {
        if (newComment.value.trim() === "") return;
        try {
          await articlesStore.addComment(props.slug, newComment.value);
          newComment.value = "";
        } catch (error) {
          console.error("Erreur lors de l'ajout du commentaire :", error);
          alert("Impossible d'ajouter le commentaire.");
        }
      };
  
      const deleteComment = async (commentId: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
          try {
            await articlesStore.deleteComment(props.slug, commentId);
          } catch (error) {
            console.error("Erreur lors de la suppression du commentaire :", error);
            alert("Impossible de supprimer le commentaire.");
          }
        }
      };
  
      const isAuthor = (comment: any) => {
        return comment.author.username === userStore.user?.username;
      };
  
      onMounted(() => {
        articlesStore.fetchComments(props.slug);
      });
  
      return { comments, newComment, submitComment, deleteComment, isAuthor };
    },
  });
  </script>
  
  <style scoped>
  textarea {
    width: 100%;
    height: 80px;
    margin-bottom: 10px;
  }
  button {
    margin-top: 5px;
  }
  </style>
  