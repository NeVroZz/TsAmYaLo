<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { computed } from 'vue';
import { useUserStore } from './stores/user'; // Import du store utilisateur
import { useRouter } from 'vue-router';

const userStore = useUserStore(); // Store utilisateur
const router = useRouter();

const isAuthenticated = computed(() => !!userStore.token); // Vérifie si l'utilisateur est connecté

const logout = () => {
  userStore.logout(); // Déconnecte l'utilisateur
  router.push('/login'); // Redirige vers la page de connexion
};
</script>

<template>
  <header class="navbar">
    <!-- Navigation -->
    <nav>
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/articles" class="nav-link">Articles</router-link>
      <router-link to="/favorites" class="nav-link">Favoris</router-link>
      <!-- Affiche "Login" si déconnecté, "Logout" si connecté -->
      <router-link v-if="isAuthenticated" to="/profile" class="nav-link">Profil</router-link>
      <router-link v-if="!isAuthenticated" to="/login" class="nav-link">Login</router-link>
      <button v-else @click="logout" class="logout-button">Logout</button>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #1e1e1e;
  z-index: 1000;
  padding: 1rem 0;
  display: flex;
  justify-content: center; /* Centre les liens horizontalement */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Navigation Links */
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; /* Ajoute un espace entre les liens */
}

.nav-link {
  color: #e0e0e0;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #007bff;
}

/* Logout Button */
.logout-button {
  background: none;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  color: #e0e0e0;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 5px;
}

.logout-button:hover {
  color: #ff4d4d;
  border-color: #ff4d4d;
}
</style>