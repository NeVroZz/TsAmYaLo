<template>
  <div id="profile-container">
    <h1>Profil de {{ user?.username }}</h1>

    <div v-if="user" id="profile-box">
      <!-- Affichage classique du profil -->
      <div v-if="!isEditing" class="profile-content">
        <img
          :src="user.image || defaultImage"
          alt="Photo de profil"
          class="profile-image"
        />
        <p><strong>Pseudo :</strong> {{ user.username }}</p>
        <p><strong>Bio :</strong> {{ user.bio || "Aucune biographie renseignée." }}</p>
        <button class="action-button" @click="toggleEditing">Modifier le profil</button>
      </div>

      <!-- Formulaire pour modifier le pseudo et la bio -->
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
          <button class="cancel-button" type="button" @click="toggleEditing">Annuler</button>
        </div>
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

    const isEditing = ref(false);

    const form = ref({
      username: userStore.user?.username || "",
      bio: userStore.user?.bio || "",
    });

    onMounted(() => {
      if (!userStore.user) {
        userStore.fetchCurrentUser();
      }
    });

    const user = computed(() => userStore.user);

    const updateProfile = async () => {
      try {
        await userStore.updateUser({
          username: form.value.username,
          bio: form.value.bio,
        });
        alert("Profil mis à jour avec succès !");
        isEditing.value = false;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        alert("Une erreur est survenue.");
      }
    };

    const toggleEditing = () => {
      isEditing.value = !isEditing.value;
      if (isEditing.value && userStore.user) {
        form.value.username = userStore.user.username;
        form.value.bio = userStore.user.bio || "";
      }
    };

    return { user, isEditing, form, updateProfile, toggleEditing, defaultImage };
  },
});
</script>

<style scoped>
/* Main container */
#profile-container {
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  height: 40vh; /* Full viewport height */
  background-color: #1e1e1e; /* Match your theme */
  color: #e0e0e0; /* Default text color */
  padding: 0; /* Remove extra padding */
  margin: 0; /* Remove margin */
  box-sizing: border-box; /* Include padding in dimensions */
}

/* Profile box */
#profile-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically in the box */
  background-color: #2e2e2e; /* Slightly lighter background */
  border: 1px solid #444; /* Border for separation */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Subtle shadow */
  padding: 2rem; /* Space inside the box */
  width: 400px; /* Set width */
  max-width: 90%; /* Ensure it doesn't get too wide */
  min-height: 400px; /* Ensure enough height for the box */
  text-align: center;
}

/* Profile content styles */
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

/* Button styles */
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

/* Form styles */
.edit-form {
  margin-top: 1rem;
  width: 100%; /* Use full width of the profile box */
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
