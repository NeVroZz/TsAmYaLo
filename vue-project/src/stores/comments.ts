import { defineStore } from "pinia";
import axios from "../plugins/axios";

export const useCommentsStore = defineStore("comments", {
  state: () => ({
    comments: [] as any[],
  }),
  actions: {
    // Récupérer les commentaires d’un article
    async fetchComments(slug: string) {
      try {
        const response = await axios.get(`/articles/${slug}/comments`);
        this.comments = response.data.comments;
      } catch (error) {
        console.error("Erreur lors du chargement des commentaires :", error);
      }
    },

    // Ajouter un commentaire
    async addComment(slug: string, commentBody: string) {
      try {
        const response = await axios.post(`/articles/${slug}/comments`, {
          comment: { body: commentBody },
        });
        this.comments.push(response.data.comment);
      } catch (error) {
        console.error("Erreur lors de l’ajout du commentaire :", error);
        throw error;
      }
    },

    // Supprimer un commentaire
    async deleteComment(slug: string, commentId: number) {
      try {
        await axios.delete(`/articles/${slug}/comments/${commentId}`);
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
      } catch (error) {
        console.error("Erreur lors de la suppression du commentaire :", error);
        throw error;
      }
    },
  },
});
