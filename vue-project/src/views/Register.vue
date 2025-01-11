<template>
  <div>
    <h1>Inscription</h1>
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

    <!-- Lien pour se connecter -->
    <p>
      Déjà un compte ? <router-link to="/login">Connectez-vous ici</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const username = ref('');
    const email = ref('');
    const password = ref('');

    const register = async () => {
      try {
        await userStore.register(username.value, email.value, password.value);
        router.push('/articles'); // Redirige après inscription
      } catch (error) {
        alert('Erreur lors de l’inscription');
      }
    };

    return { username, email, password, register };
  },
});
</script>
