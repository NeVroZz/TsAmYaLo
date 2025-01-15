<template>
  <div id="login-container">
    <div id="login-box">
      <!-- Affiche le titre de la page en fonction de l'état de connexion -->
      <h1 v-if="!isAuthenticated">Connexion</h1>
      <h1 v-else>Bienvenue, {{ user?.username }}</h1>

      <!-- Formulaire de connexion -->
      <form v-if="!isAuthenticated" @submit.prevent="login">
        <div class="input-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <div class="input-group">
          <label for="password">Mot de passe</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button class="action-button" type="submit">Se connecter</button>
      </form>

      <!-- Bouton pour se déconnecter -->
      <button v-else class="action-button" @click="logout">
        Se déconnecter
      </button>

      <!-- Lien vers la page d'inscription -->
      <p v-if="!isAuthenticated">
        Pas encore de compte ?
        <router-link to="/register">Inscrivez-vous ici</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const userStore = useUserStore(); // Store utilisateur pour gérer l'état de connexion
    const router = useRouter(); // Permet la navigation entre les pages
    const email = ref(""); // Stocke l'email saisi par l'utilisateur
    const password = ref(""); // Stocke le mot de passe saisi par l'utilisateur

    // Vérifie si l'utilisateur est connecté
    const isAuthenticated = computed(() => !!userStore.token);

    // Récupère les informations de l'utilisateur connecté
    const user = computed(() => userStore.user);

    // Fonction pour gérer la connexion
    const login = async () => {
      try {
        await userStore.login(email.value, password.value); // Appelle l'action de connexion dans le store
        router.push("/articles"); // Redirige l'utilisateur vers la liste des articles après connexion
      } catch (error) {
        alert("Erreur lors de la connexion"); // Affiche un message d'erreur en cas d'échec
      }
    };

    // Fonction pour gérer la déconnexion
    const logout = () => {
      userStore.logout(); // Déconnecte l'utilisateur via le store
      router.push("/login"); // Redirige vers la page de connexion
    };

    return { email, password, login, logout, isAuthenticated, user }; // Expose les données et fonctions au template
  },
});
</script>

<style scoped>
#login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #181818;
  color: #e0e0e0;
}
#login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #2e2e2e;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  padding: 2rem;
  width: 400px;
  max-width: 90%;
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: white;
}

.input-group {
  margin-bottom: 1rem;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #e0e0e0;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2e2e2e;
  color: #e0e0e0;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.8);
}

.action-button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 100%;
}

.action-button:hover {
  background-color: #0056b3;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

p {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>
