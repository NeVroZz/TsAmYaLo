<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
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
  <header>
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <div class="wrapper">
      <HelloWorld msg="Ca marche" />

      <!-- Navigation -->
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/articles">Articles</router-link>
        <router-link to="/favorites">Favoris</router-link>
        <!-- Affiche "Login" si déconnecté, "Logout" si connecté -->
        <router-link v-if="isAuthenticated" to="/profile">Profil</router-link>
        <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
        <button v-else @click="logout">Logout</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

button {
  border: none;
  background: none;
  padding: 0 1rem;
  color: var(--color-text);
  cursor: pointer;
}

button:hover {
  text-decoration: underline;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
