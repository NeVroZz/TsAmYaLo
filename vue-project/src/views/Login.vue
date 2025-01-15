<template>
  <div id="login-container">
    <div id="login-box">
      <h1 v-if="!isAuthenticated">Connexion</h1>
      <h1 v-else>Bienvenue, {{ user?.username }}</h1>

      <!-- Login Form -->
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

      <!-- Logout Button -->
      <button v-else class="action-button" @click="logout">Se déconnecter</button>

      <!-- Link to Register -->
      <p v-if="!isAuthenticated">
        Pas encore de compte ? <router-link to="/register">Inscrivez-vous ici</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const isAuthenticated = computed(() => !!userStore.token); // Vérifie si l'utilisateur est connecté
    const user = computed(() => userStore.user); // Récupère les infos utilisateur

    const login = async () => {
      try {
        await userStore.login(email.value, password.value);
        router.push('/articles'); // Redirige après connexion
      } catch (error) {
        alert('Erreur lors de la connexion');
      }
    };

    const logout = () => {
      userStore.logout();
      router.push('/login'); // Redirige vers la page de connexion
    };

    return { email, password, login, logout, isAuthenticated, user };
  },
});
</script>

<style scoped>
/* Main container */
#login-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  min-height: 40vh; /* Full viewport height */
  background-color: #1e1e1e; /* Match dark theme */
  color: #e0e0e0; /* Text color */
}

/* Login box */
#login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #2e2e2e; /* Slightly lighter background */
  border: 1px solid #444; /* Border for separation */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Subtle shadow */
  padding: 2rem; /* Padding inside the box */
  width: 400px; /* Fixed width */
  max-width: 90%; /* Ensure it doesn't overflow smaller screens */
  text-align: center;
}

/* Heading */
h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: white;
}

/* Input fields */
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

/* Buttons */
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

/* Link to register */
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
