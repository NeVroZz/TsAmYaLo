<template>
    <div>
      <h1>Créer un nouvel article</h1>
      <form @submit.prevent="createArticle">
        <div>
          <label for="title">Titre</label>
          <input v-model="form.title" type="text" id="title" required />
        </div>
        <div>
          <label for="description">Description</label>
          <input v-model="form.description" type="text" id="description" required />
        </div>
        <div>
          <label for="body">Contenu</label>
          <textarea v-model="form.body" id="body" required></textarea>
        </div>
        <div>
          <label for="tags">Tags (séparés par des virgules)</label>
          <input v-model="form.tagList" type="text" id="tags" />
        </div>
        <button type="submit">Créer</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useArticlesStore } from '../stores/articles';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const articlesStore = useArticlesStore();
      const router = useRouter();
  
      const form = ref({
        title: '',
        description: '',
        body: '',
        tagList: '',
      });
  
      const createArticle = async () => {
        const tagsArray = form.value.tagList.split(',').map(tag => tag.trim());
        try {
          await articlesStore.createArticle({
            title: form.value.title,
            description: form.value.description,
            body: form.value.body,
            tagList: tagsArray,
          });
          router.push('/articles'); // Redirige après création
        } catch (error) {
          alert("Erreur lors de la création de l'article.");
        }
      };
  
      return { form, createArticle };
    },
  });
  </script>