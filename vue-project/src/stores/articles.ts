import { defineStore } from 'pinia';
import axios from '../plugins/axios'; // Assurez-vous que l'instance Axios est configurée

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as any[],
    articlesCount: 0,
    currentArticle: null as any | null,
  }),
  actions: {
    // Récupérer la liste des articles
    async fetchArticles(params = {}) {
      try {
        const response = await axios.get('/articles', { params });
        this.articles = response.data.articles;
        this.articlesCount = response.data.articlesCount;
      } catch (error) {
        console.error('Erreur lors du chargement des articles :', error);
      }
    },

    // Récupérer un article par son slug
    async fetchArticle(slug: string) {
      try {
        const response = await axios.get(`/articles/${slug}`);
        return response.data.article;
      } catch (error) {
        console.error('Erreur lors du chargement de l’article :', error);
        throw error;
      }
    },
    
    // Ajouter un article en favoris
    async favoriteArticle(slug: string) {
      try {
        const response = await axios.post(`/articles/${slug}/favorite`);
        return response.data.article;
      } catch (error) {
        console.error('Erreur lors de l’ajout aux favoris :', error);
        throw error;
      }
    },

    // Retirer un article des favoris
    async unfavoriteArticle(slug: string) {
      try {
        const response = await axios.delete(`/articles/${slug}/favorite`);
        return response.data.article;
      } catch (error) {
        console.error('Erreur lors du retrait des favoris :', error);
        throw error;
      }
    },
  },
});
