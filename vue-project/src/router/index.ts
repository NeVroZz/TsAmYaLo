import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';
import ArticleList from '../views/ArticleList.vue';
import ArticleDetail from '../views/ArticleDetail.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
  { path: '/', name: 'Home', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/articles',
    name: 'Articles',
    component: ArticleList,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (!userStore.token) {
        alert('Vous devez être connecté pour accéder aux articles.');
        next('/login'); // Redirige si non connecté
      } else {
        next();
      }
    },
  },
  {
    path: '/articles/:slug',
    name: 'ArticleDetail',
    component: ArticleDetail,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (!userStore.token) {
        alert('Vous devez être connecté pour accéder aux détails de l’article.');
        next('/login');
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
