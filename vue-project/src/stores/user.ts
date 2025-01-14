import { defineStore } from "pinia";
import axios from "../plugins/axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as any | null, // Stocke l'utilisateur connecté
    token: localStorage.getItem("token") || "", // Récupère le token JWT depuis le localStorage
  }),

  actions: {
    // Connexion de l'utilisateur
    async login(email: string, password: string) {
      try {
        const response = await axios.post("/users/login", {
          user: { email, password },
        });
        this.token = response.data.user.token;
        this.user = response.data.user;
        localStorage.setItem("token", this.token); // Stocke le token dans le localStorage
        axios.defaults.headers.common["Authorization"] = `Token ${this.token}`;
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        throw error;
      }
    },

    // Inscription de l'utilisateur
    async register(username: string, email: string, password: string) {
      try {
        const response = await axios.post("/users", {
          user: { username, email, password },
        });
        this.token = response.data.user.token;
        this.user = response.data.user;
        localStorage.setItem("token", this.token);
        axios.defaults.headers.common["Authorization"] = `Token ${this.token}`;
      } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        throw error;
      }
    },

    // Déconnexion de l'utilisateur
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },

    // Récupération des informations utilisateur
    async fetchCurrentUser() {
      try {
        if (!this.token) return; // Pas de token, pas besoin de récupérer l'utilisateur
        const response = await axios.get("/user", {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        });
        this.user = response.data.user;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        this.user = null; // Réinitialise l'utilisateur en cas d'erreur
      }
    },

    // Mise à jour de l'utilisateur
    async updateUser(data: { username?: string; bio?: string }) {
      try {
        const response = await axios.put(
          "/user",
          { user: data },
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        );
        this.user = response.data.user;
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        throw error;
      }
    },
  },
});
