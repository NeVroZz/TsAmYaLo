<template>
  <div>
    <h1 v-if="!isAuthenticated">Connexion</h1>
    <h1 v-else>Bienvenue, {{ user?.username }}</h1>

    <form v-if="!isAuthenticated" @submit.prevent="login">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Se connecter</button>
    </form>

    <!-- Bouton de déconnexion -->
    <button v-else @click="logout">Se déconnecter</button>

    <!-- Lien pour s'inscrire -->
    <p v-if="!isAuthenticated">
      Pas encore de compte ? <router-link to="/register">Inscrivez-vous ici</router-link>
    </p>
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
