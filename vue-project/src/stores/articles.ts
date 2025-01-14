import axios from "../plugins/axios";
import { defineStore } from "pinia";

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    articles: [] as any[], // Liste des articles
    article: null as any | null, // Article spécifique
  }),

  actions: {
    // Récupérer tous les articles
    async fetchArticles() {
      try {
        const response = await axios.get("/articles");
        this.articles = response.data.articles;
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        throw error;
      }
    },

    // Récupérer un article spécifique
    async fetchArticle(slug: string) {
      try {
        const response = await axios.get(`/articles/${slug}`);
        this.article = response.data.article;
      } catch (error) {
        console.error("Erreur lors de la récupération de l’article :", error);
        throw error;
      }
    },

    // Créer un nouvel article
    async createArticle(data: { title: string; description: string; body: string; tagList: string[] }) {
      try {
        const response = await axios.post("/articles", {
          article: data,
        });
        this.article = response.data.article; // Met à jour l'article dans le store
        return this.article; // Retourne l'article créé
      } catch (error) {
        console.error("Erreur lors de la création de l'article :", error);
        throw error;
      }
    },

    // Mettre à jour un article existant
    async updateArticle(slug: string, data: { title?: string; description?: string; body?: string; tagList?: string[] }) {
      try {
        const response = await axios.put(`/articles/${slug}`, {
          article: data,
        });
        this.article = response.data.article; // Met à jour l'article dans le store
        await this.fetchArticles(); // Recharge tous les articles depuis l'API
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'article :", error);
        throw error;
      }
    },

    // Supprimer un article
    async deleteArticle(slug: string) {
      try {
        await axios.delete(`/articles/${slug}`);
        this.articles = this.articles.filter((article) => article.slug !== slug); // Supprime immédiatement l'article localement
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article :", error);
        throw error;
      }
    },

    // Ajouter un article aux favoris
    async favoriteArticle(slug: string) {
      try {
        const response = await axios.post(`/articles/${slug}/favorite`);
        this.article = response.data.article; // Met à jour l'article
      } catch (error) {
        console.error("Erreur lors de l’ajout aux favoris :", error);
        throw error;
      }
    },

    // Retirer un article des favoris
    async unfavoriteArticle(slug: string) {
      try {
        const response = await axios.delete(`/articles/${slug}/favorite`);
        this.article = response.data.article; // Met à jour l'article
      } catch (error) {
        console.error("Erreur lors du retrait des favoris :", error);
        throw error;
      }
    },
  },
});
