<template>
  <div id="profile-container">
    <h1>Profil de {{ user?.username }}</h1>

    <div v-if="user" id="profile-box">
      <!-- Affichage du profil utilisateur -->
      <div v-if="!isEditing" class="profile-content">
        <img
          :src="user.image || defaultImage"
          alt="Photo de profil"
          class="profile-image"
        />
        <p><strong>Pseudo :</strong> {{ user.username }}</p>
        <p>
          <strong>Bio :</strong>
          {{ user.bio || "Aucune biographie renseignée." }}
        </p>
        <button class="action-button" @click="toggleEditing">
          Modifier le profil
        </button>
      </div>

      <!-- Formulaire de modification du profil -->
      <form v-else @submit.prevent="updateProfile" class="edit-form">
        <div>
          <label for="username">Pseudo</label>
          <input v-model="form.username" type="text" id="username" />
        </div>
        <div>
          <label for="bio">Bio</label>
          <textarea v-model="form.bio" id="bio"></textarea>
        </div>
        <div class="form-buttons">
          <button class="action-button" type="submit">Enregistrer</button>
          <button class="cancel-button" type="button" @click="toggleEditing">
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Message de chargement si l'utilisateur n'est pas encore disponible -->
    <p v-else>Chargement du profil...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useUserStore } from "../stores/user";
import defaultImage from "@/assets/pp.jpg";

export default defineComponent({
  setup() {
    const userStore = useUserStore(); // Store pour gérer les données utilisateur

    const isEditing = ref(false); // État pour savoir si le profil est en mode édition

    // Formulaire réactif pour stocker les modifications
    const form = ref({
      username: userStore.user?.username || "",
      bio: userStore.user?.bio || "",
    });

    // Charger les données utilisateur au montage si elles ne sont pas déjà disponibles
    onMounted(() => {
      if (!userStore.user) {
        userStore.fetchCurrentUser();
      }
    });

    const user = computed(() => userStore.user); // Récupère les données utilisateur du store

    // Fonction pour mettre à jour le profil
    const updateProfile = async () => {
      try {
        await userStore.updateUser({
          username: form.value.username,
          bio: form.value.bio,
        });
        alert("Profil mis à jour avec succès !");
        isEditing.value = false; // Quitte le mode édition après sauvegarde
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        alert("Une erreur est survenue.");
      }
    };

    // Active ou désactive le mode édition
    const toggleEditing = () => {
      isEditing.value = !isEditing.value;
      if (isEditing.value && userStore.user) {
        // Pré-remplit le formulaire avec les données actuelles
        form.value.username = userStore.user.username;
        form.value.bio = userStore.user.bio || "";
      }
    };

    return {
      user,
      isEditing,
      form,
      updateProfile,
      toggleEditing,
      defaultImage,
    }; // Expose les données et méthodes au template
  },
});
</script>

<style scoped>
#profile-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40vh;
  background-color: #181818;
  color: #e0e0e0;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#profile-box {
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
  min-height: 400px;
  text-align: center;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.action-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.action-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.cancel-button:hover {
  background-color: #333;
}

.edit-form {
  margin-top: 1rem;
  width: 100%;
}

.edit-form div {
  margin-bottom: 1rem;
}

.edit-form input,
.edit-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #2e2e2e;
  color: #e0e0e0;
}

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
