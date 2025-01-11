import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as any | null,
    token: localStorage.getItem('token') || '',
  }),
  actions: {
    // Inscription
    async register(username: string, email: string, password: string) {
      try {
        const response = await axios.post('/users', {
          user: { username, email, password },
        });
        this.token = response.data.user.token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Token ${this.token}`;
      } catch (error) {
        console.error('Erreur lors de l’inscription :', error);
        throw error;
      }
    },

    // Connexion
    async login(email: string, password: string) {
      try {
        const response = await axios.post('/users/login', {
          user: { email, password },
        });
        this.token = response.data.user.token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Token ${this.token}`;
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw error;
      }
    },

    // Déconnexion
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },

    // Vérification utilisateur connecté
    async fetchCurrentUser() {
      try {
        const response = await axios.get('/user');
        this.user = response.data.user;
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      }
    },
  },
});
