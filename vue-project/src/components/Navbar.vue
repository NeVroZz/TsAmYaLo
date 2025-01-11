<template>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/articles">Articles</router-link>
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
      <button v-else @click="logout">Logout</button>
    </nav>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useUserStore } from '../stores/user';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const userStore = useUserStore();
      const router = useRouter();
  
      const isAuthenticated = computed(() => !!userStore.token); // Vérifie si l'utilisateur est connecté
  
      const logout = () => {
        userStore.logout(); // Supprime le token
        router.push('/login'); // Redirige vers la page de connexion
      };
  
      return { isAuthenticated, logout };
    },
  });
  </script>
  