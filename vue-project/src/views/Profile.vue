<template>
    <div>
      <h1>Profil de {{ user?.username }}</h1>
  
      <div v-if="user">
        <!-- Affichage classique du profil -->
        <div v-if="!isEditing">
          <img
            :src="user.image || defaultImage"
            alt="Photo de profil"
            class="profile-image"
          />
          <p><strong>Pseudo :</strong> {{ user.username }}</p>
          <p><strong>Bio :</strong> {{ user.bio || "Aucune biographie renseignée." }}</p>
          <button @click="toggleEditing">Modifier le profil</button>
        </div>
  
        <!-- Formulaire pour modifier le pseudo et la bio -->
        <form v-else @submit.prevent="updateProfile">
          <div>
            <label for="username">Pseudo</label>
            <input v-model="form.username" type="text" id="username" />
          </div>
          <div>
            <label for="bio">Bio</label>
            <textarea v-model="form.bio" id="bio"></textarea>
          </div>
          <button type="submit">Enregistrer</button>
          <button type="button" @click="toggleEditing">Annuler</button>
        </form>
      </div>
  
      <p v-else>Chargement du profil...</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, computed } from "vue";
  import { useUserStore } from "../stores/user";
  import defaultImage from "@/assets/pp.jpg";
  
  export default defineComponent({
    setup() {
      const userStore = useUserStore();
  
      // Variable pour basculer entre affichage et mode édition
      const isEditing = ref(false);
  
      // Formulaire initialisé avec les données utilisateur
      const form = ref({
        username: userStore.user?.username || "",
        bio: userStore.user?.bio || "",
      });
  
      // Charger les informations utilisateur si elles ne sont pas encore disponibles
      onMounted(() => {
        if (!userStore.user) {
          userStore.fetchCurrentUser();
        }
      });
  
      const user = computed(() => userStore.user);
  
      // Met à jour le profil
      const updateProfile = async () => {
        try {
          await userStore.updateUser({
            username: form.value.username,
            bio: form.value.bio,
          });
          alert("Profil mis à jour avec succès !");
          isEditing.value = false; // Retourne à l'affichage classique
        } catch (error) {
          console.error("Erreur lors de la mise à jour du profil :", error);
          alert("Une erreur est survenue.");
        }
      };
  
      // Bascule entre mode édition et affichage classique
      const toggleEditing = () => {
        isEditing.value = !isEditing.value;
        if (isEditing.value && userStore.user) {
          // Initialise le formulaire avec les données utilisateur
          form.value.username = userStore.user.username;
          form.value.bio = userStore.user.bio || "";
        }
      };
  
      return { user, isEditing, form, updateProfile, toggleEditing, defaultImage };
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
  form {
    margin-top: 1rem;
  }
  form div {
    margin-bottom: 1rem;
  }
  </style>