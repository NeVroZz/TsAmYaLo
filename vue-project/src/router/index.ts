import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import ArticleList from "../views/ArticleList.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import ArticleCreate from "../views/ArticleCreate.vue";
import ArticleEdit from "../views/ArticleEdit.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Favorites from "../views/Favorites.vue";
import Profile from "../views/Profile.vue";

// Définition des routes de l'application
const routes = [
  {
    path: "/",
    name: "Home",
    component: Login, // Page par défaut : connexion
  },
  {
    path: "/register",
    name: "Register",
    component: Register, // Page d'inscription
  },
  {
    path: "/login",
    name: "Login",
    component: Login, // Page de connexion
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile, // Page de profil
  },
  {
    path: "/articles",
    name: "Articles",
    component: ArticleList, // Liste des articles
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(); // Vérification de l'état utilisateur
      if (!userStore.token) {
        alert("Vous devez être connecté pour accéder aux articles."); // Redirection si non connecté
        next("/login");
      } else {
        next(); // Autorisation d'accès
      }
    },
  },
  {
    path: "/articles/create",
    name: "ArticleCreate",
    component: ArticleCreate, // Formulaire de création d'article
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(); // Vérifie si l'utilisateur est connecté
      if (!userStore.token) {
        alert("Vous devez être connecté pour créer un article."); // Bloque l'accès si non connecté
        next("/login");
      } else {
        next(); // Autorise l'accès
      }
    },
  },
  {
    path: "/articles/:slug",
    name: "ArticleDetail",
    component: ArticleDetail, // Détails d'un article
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(); // Vérifie l'état utilisateur
      if (!userStore.token) {
        alert(
          "Vous devez être connecté pour accéder aux détails de l’article."
        ); // Bloque si non connecté
        next("/login");
      } else {
        next(); // Autorise l'accès
      }
    },
  },
  {
    path: "/articles/:slug/edit",
    name: "ArticleEdit",
    component: ArticleEdit, // Page pour modifier un article
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(); // Vérification utilisateur
      if (!userStore.token) {
        alert("Vous devez être connecté pour modifier un article."); // Bloque si non connecté
        next("/login");
      } else {
        next(); // Autorise l'accès
      }
    },
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: Favorites, // Page des favoris
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(); // Vérifie si l'utilisateur est connecté
      if (!userStore.token) {
        alert("Vous devez être connecté pour accéder aux favoris."); // Bloque si non connecté
        next("/login");
      } else {
        next(); // Autorise l'accès
      }
    },
  },
];

// Configuration du routeur avec l'historique Web
const router = createRouter({
  history: createWebHistory(), // Utilisation d'un historique basé sur l'URL
  routes, // Ajout des routes définies
});

export default router; // Export du routeur pour l'utiliser dans l'application
