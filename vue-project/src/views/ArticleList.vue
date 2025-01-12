<template>
  <div>
    <h1>Liste des articles</h1>
    <button @click="goToCreate">Créer un nouvel article</button>
    <div v-if="articles.length">
      <ul>
        <li v-for="article in articles" :key="article.slug">
          <router-link :to="`/articles/${article.slug}`">{{ article.title }}</router-link>
          <button @click="deleteArticle(article.slug)">Supprimer</button>
          <button @click="goToEdit(article.slug)">Modifier</button>
        </li>
      </ul>
    </div>
    <p v-else>Aucun article disponible.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useArticlesStore } from '../stores/articles';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const articlesStore = useArticlesStore();
    const router = useRouter();

    onMounted(() => {
      articlesStore.fetchArticles();
    });

    const deleteArticle = async (slug: string) => {
      if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
        await articlesStore.deleteArticle(slug);
      }
    };

    const goToCreate = () => {
      router.push('/articles/create');
    };

    const goToEdit = (slug: string) => {
      router.push(`/articles/${slug}/edit`);
    };

    return { articles: articlesStore.articles, deleteArticle, goToCreate, goToEdit };
  },
});
</script>