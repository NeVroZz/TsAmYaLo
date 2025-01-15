<template>
  <div>
    <h1>Inscription</h1>
    <!-- Formulaire d'inscription -->
    <form @submit.prevent="register">
      <div>
        <label>Nom d'utilisateur</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">S'inscrire</button>
    </form>

    <!-- Lien pour rediriger vers la page de connexion -->
    <p>
      Déjà un compte ? <router-link to="/login">Connectez-vous ici</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const userStore = useUserStore(); // Store utilisateur pour gérer l'inscription
    const router = useRouter(); // Permet la navigation après inscription
    const username = ref(""); // Stocke le nom d'utilisateur saisi
    const email = ref(""); // Stocke l'email saisi
    const password = ref(""); // Stocke le mot de passe saisi

    // Fonction pour gérer l'inscription
    const register = async () => {
      try {
        await userStore.register(username.value, email.value, password.value); // Appelle l'action d'inscription dans le store
        router.push("/articles"); // Redirige vers la liste des articles après inscription réussie
      } catch (error) {
        alert("Erreur lors de l’inscription"); // Affiche un message d'erreur en cas d'échec
      }
    };

    return { username, email, password, register }; // Expose les données et la fonction au template
  },
});
</script>
