import axios from "../plugins/axios";
import { defineStore } from "pinia";

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    articles: [] as any[], // Liste des articles
    article: null as any | null, // Article spécifique
    comments: [] as any[], // Liste des commentaires pour un article
  }),

  actions: {
    // Récupérer tous les articles avec des filtres
    async fetchArticles(
      filters: { author?: string; tag?: string; favorited?: string } = {}
    ) {
      try {
        const params = new URLSearchParams();
        if (filters.author) params.append("author", filters.author);
        if (filters.tag) params.append("tag", filters.tag);
        if (filters.favorited) params.append("favorited", filters.favorited);

        console.log(
          "Requête envoyée à l'API :",
          `/articles?${params.toString()}`
        );
        const response = await axios.get(`/articles?${params.toString()}`);
        this.articles = response.data.articles;
        console.log("Articles reçus :", this.articles);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        throw new Error("Impossible de charger les articles.");
      }
    },

    // Récupérer un article spécifique
    async fetchArticle(slug: string) {
      if (!slug) throw new Error("Slug manquant pour récupérer l'article.");
      try {
        console.log("Chargement de l'article avec le slug :", slug);
        const response = await axios.get(`/articles/${slug}`);
        this.article = response.data.article;
        console.log("Article reçu :", this.article);
      } catch (error) {
        console.error("Erreur lors de la récupération de l’article :", error);
        throw new Error("Impossible de charger l'article.");
      }
    },

    // Récupérer les commentaires pour un article
    async fetchComments(slug: string) {
      if (!slug)
        throw new Error("Slug manquant pour récupérer les commentaires.");
      try {
        console.log(
          "Chargement des commentaires pour l'article avec le slug :",
          slug
        );
        const response = await axios.get(`/articles/${slug}/comments`);
        const comments = response.data.comments.map((comment: any) => {
          comment.authorDetails = { username: "Inconnu" }; // Définit "Inconnu" pour l'auteur
          return comment;
        });
        this.comments = comments;
        console.log("Commentaires enrichis :", this.comments);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des commentaires :",
          error
        );
        throw new Error("Impossible de charger les commentaires.");
      }
    },

    // Ajouter un commentaire à un article
    async addComment(slug: string, comment: string) {
      if (!slug || !comment.trim())
        throw new Error("Données manquantes pour ajouter un commentaire.");
      try {
        console.log("Ajout d'un commentaire à l'article avec le slug :", slug);
        const response = await axios.post(`/articles/${slug}/comments`, {
          comment: { body: comment },
        });

        const newComment = {
          ...response.data.comment,
          authorDetails: { username: "Inconnu" }, // Définit "Inconnu" pour l'auteur
        };

        this.comments.push(newComment); // Ajoute le commentaire localement
        console.log("Commentaire ajouté :", newComment);
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire :", error);
        throw new Error("Impossible d'ajouter le commentaire.");
      }
    },

    // Supprimer un commentaire
    async deleteComment(slug: string, commentId: number) {
      if (!slug || !commentId)
        throw new Error("Données manquantes pour supprimer le commentaire.");
      try {
        console.log(
          "Suppression du commentaire ID :",
          commentId,
          "pour l'article avec le slug :",
          slug
        );
        await axios.delete(`/articles/${slug}/comments/${commentId}`);
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        ); // Supprime localement
        console.log("Commentaire supprimé avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression du commentaire :", error);
        throw new Error("Impossible de supprimer le commentaire.");
      }
    },

    // Ajouter un article aux favoris
    async favoriteArticle(slug: string) {
      if (!slug)
        throw new Error("Slug manquant pour ajouter l'article aux favoris.");
      try {
        console.log("Ajout de l'article aux favoris avec le slug :", slug);
        const response = await axios.post(`/articles/${slug}/favorite`);
        this.article = response.data.article; // Met à jour l'article localement
        console.log("Article ajouté aux favoris :", this.article);
      } catch (error) {
        console.error("Erreur lors de l’ajout aux favoris :", error);
        throw new Error("Impossible d'ajouter aux favoris.");
      }
    },

    // Retirer un article des favoris
    async unfavoriteArticle(slug: string) {
      if (!slug)
        throw new Error("Slug manquant pour retirer l'article des favoris.");
      try {
        console.log("Retrait de l'article des favoris avec le slug :", slug);
        const response = await axios.delete(`/articles/${slug}/favorite`);
        this.article = response.data.article; // Met à jour l'article localement
        console.log("Article retiré des favoris :", this.article);
      } catch (error) {
        console.error("Erreur lors du retrait des favoris :", error);
        throw new Error("Impossible de retirer des favoris.");
      }
    },

    // Modifier un article
    async updateArticle(
      slug: string,
      data: { title: string; description: string; body: string }
    ) {
      if (!slug || !data.title || !data.description || !data.body)
        throw new Error("Données manquantes pour modifier l'article.");
      try {
        console.log(
          "Modification de l'article avec le slug :",
          slug,
          "Données :",
          data
        );
        const response = await axios.put(`/articles/${slug}`, {
          article: data,
        });
        this.article = response.data.article; // Met à jour l'article localement
        console.log("Article modifié :", this.article);
      } catch (error) {
        console.error("Erreur lors de la modification de l'article :", error);
        throw new Error("Impossible de modifier l'article.");
      }
    },

    // Créer un nouvel article
    async createArticle(data: {
      title: string;
      description: string;
      body: string;
      tagList: string[];
    }) {
      if (!data.title || !data.description || !data.body)
        throw new Error("Données manquantes pour créer l'article.");
      try {
        console.log("Création d'un nouvel article avec les données :", data);
        const response = await axios.post(`/articles`, {
          article: data,
        });
        this.articles.push(response.data.article); // Ajoute l'article localement
        console.log("Article créé avec succès :", response.data.article);
      } catch (error) {
        console.error("Erreur lors de la création de l'article :", error);
        throw new Error("Impossible de créer l'article.");
      }
    },

    // Supprimer un article
    async deleteArticle(slug: string) {
      if (!slug) throw new Error("Slug manquant pour supprimer l'article.");
      try {
        console.log("Tentative de suppression des commentaires...");
        const commentsResponse = await axios.get(`/articles/${slug}/comments`);
        console.log("Commentaires trouvés :", commentsResponse.data.comments);

        for (const comment of commentsResponse.data.comments) {
          console.log(`Suppression du commentaire avec l'ID : ${comment.id}`);
          await axios.delete(`/articles/${slug}/comments/${comment.id}`);
        }

        console.log("Tous les commentaires supprimés.");
        console.log("Tentative de suppression de l'article :", slug);
        await axios.delete(`/articles/${slug}`);
        this.articles = this.articles.filter(
          (article) => article.slug !== slug
        );
        console.log("Article supprimé avec succès :", slug);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'article ou des commentaires :",
          error
        );
        throw new Error("Impossible de supprimer l'article.");
      }
    },
  },
});
