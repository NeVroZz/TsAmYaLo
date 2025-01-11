import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as any | null, // Stockage des informations utilisateur
    token: localStorage.getItem('token') || '', // Récupération du token JWT depuis localStorage
  }),

  actions: {
    // Connexion de l'utilisateur
    async login(email: string, password: string) {
      try {
        const response = await axios.post('/users/login', {
          user: { email, password },
        });
        this.token = response.data.user.token; // Stockage du token
        this.user = response.data.user; // Stockage des infos utilisateur
        localStorage.setItem('token', this.token); // Sauvegarde dans localStorage
        axios.defaults.headers.common['Authorization'] = `Token ${this.token}`; // Ajout du token dans les en-têtes Axios
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw error;
      }
    },

    // Inscription de l'utilisateur
    async register(username: string, email: string, password: string) {
      try {
        const response = await axios.post('/users', {
          user: { username, email, password },
        });
        this.token = response.data.user.token; // Stockage du token
        this.user = response.data.user; // Stockage des infos utilisateur
        localStorage.setItem('token', this.token); // Sauvegarde dans localStorage
        axios.defaults.headers.common['Authorization'] = `Token ${this.token}`; // Ajout du token dans les en-têtes Axios
      } catch (error) {
        console.error('Erreur lors de l’inscription :', error);
        throw error;
      }
    },

    // Déconnexion de l'utilisateur
    logout() {
      this.token = ''; // Suppression du token
      this.user = null; // Réinitialisation des infos utilisateur
      localStorage.removeItem('token'); // Suppression du token de localStorage
      delete axios.defaults.headers.common['Authorization']; // Suppression du token des en-têtes Axios
    },

    // Récupération des informations utilisateur
    async fetchCurrentUser() {
      try {
        const response = await axios.get('/user', {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        });
        this.user = response.data.user; // Mise à jour des informations utilisateur
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
        throw error;
      }
    },

    // Mise à jour des informations utilisateur
    async updateUser(data: { email?: string; username?: string; bio?: string; image?: string }) {
      try {
        const response = await axios.put('/user', { user: data }, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        });
        this.user = response.data.user; // Mise à jour des informations utilisateur
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
        throw error;
      }
    },
  },
});