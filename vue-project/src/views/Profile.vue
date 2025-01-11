<template>
  <div>
    <h1>Profil de {{ user?.username }}</h1>
    <div v-if="user">
      <img
        :src="user.image || defaultImage"
        alt="Photo de profil"
        class="profile-image"
      />
      <p><strong>Pseudo :</strong> {{ user.username }}</p>
      <p>
        <strong>Bio :</strong> {{ user.bio || "Aucune biographie renseignée." }}
      </p>
    </div>
    <p v-else>Chargement du profil...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useUserStore } from "../stores/user";
import defaultImage from "@/assets/pp.jpg";

export default defineComponent({
  setup() {
    const userStore = useUserStore();

    // Charger les informations de l'utilisateur si elles ne sont pas encore disponibles
    onMounted(() => {
      if (!userStore.user) {
        userStore.fetchCurrentUser(); // Fonction pour récupérer les infos utilisateur
      }
    });
    const user = computed(() => userStore.user); // Récupère les infos utilisateur depuis le store

    return { user };
  },
});
</script>

<style scoped>
.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}
</style>
