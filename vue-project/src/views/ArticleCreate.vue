<template>
  <div>
    <h1>Créer un nouvel article</h1>
    <form @submit.prevent="createArticle">
      <div>
        <label for="title">Titre</label>
        <input id="title" v-model="title" type="text" required />
      </div>
      <div>
        <label for="description">Description</label>
        <input id="description" v-model="description" type="text" required />
      </div>
      <div>
        <label for="body">Contenu</label>
        <textarea id="body" v-model="body" required></textarea>
      </div>
      <div>
        <label for="tags">Tags (séparés par des virgules)</label>
        <input id="tags" v-model="tagList" type="text" />
      </div>
      <button :disabled="isSubmitting" type="submit">Créer</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useArticlesStore } from "../stores/articles";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore();
    const router = useRouter();
    const title = ref("");
    const description = ref("");
    const body = ref("");
    const tagList = ref("");
    const isSubmitting = ref(false);

    const createArticle = async () => {
      isSubmitting.value = true; // Désactive le bouton
      try {
        await articlesStore.createArticle({
          title: title.value,
          description: description.value,
          body: body.value,
          tagList: tagList.value.split(",").map((tag) => tag.trim()),
        });
        alert("Article créé avec succès !");
        router.push("/articles"); // Redirige vers la liste des articles
      } catch (error) {
        alert("Erreur lors de la création de l'article.");
        console.error(error);
      } finally {
        isSubmitting.value = false; // Réactive le bouton
      }
    };

    return { title, description, body, tagList, createArticle, isSubmitting };
  },
});
</script>

<style scoped>
form {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
