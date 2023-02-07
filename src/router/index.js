import { createRouter, createWebHistory } from "vue-router";
import { token } from "../utils/localStorage";
import HomeAdminView from "../views/admin/HomeAdminView.vue";
import ConfirmEmail from "../views/ConfirmEmailView.vue";
import HomeView from "../views/HomeView.vue";
import LikesView from "../views/LikesView.vue";
import LoginView from "../views/LoginView.vue";
import NewPassword from "../views/NewPasswordView.vue";
import ProfileView from "../views/ProfileView.vue";
import RealEstateAdsView from "../views/RealEstateAdsView.vue";
import RegisterView from "../views/RegisterView.vue";
import ResetPassword from "../views/ResetPasswordView.vue";

const ifAuthenticated = (to, from, next) => {
  if (token.value.token) {
    next();
    return;
  }
  next("/login");
};

const ifNotAuthenticated = (to, from, next) => {
  if (!token.value.token) {
    next();
    return;
  }
  next("/");
};

const ifIsAdmin = (to, from, next) => {
  if (token.value.token && token.value.role.includes("ROLE_ADMIN")) {
    next();
    return;
  }
  router.push("/login");
};

const ifIsUser = (to, from, next) => {
  if (token.value.token && token.value.role.includes("ROLE_USER")) {
    next();
    return;
  }
  router.push("/login");
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/likes",
      name: "likes",
      component: LikesView,
      beforeEnter: ifAuthenticated && ifIsUser,
    },
    {
      path: "/confirm/:token",
      name: "confirm",
      component: ConfirmEmail,
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPassword,
    },
    {
      path: "/new-password/:token",
      name: "new-password",
      component: NewPassword,
    },
    {
      path: "/real_estate_ads/:id",
      name: "real_estate_ads",
      component: RealEstateAdsView,
    },
    {
      path: "/admin",
      name: "admin_home",
      component: HomeAdminView,
      beforeEnter: ifIsAdmin,
    },
    {
      path: "/admin/apartment/all",
      name: "admin_real_estate_ads_all",
      beforeEnter: ifIsAdmin,
    },
    {
      path: "/admin/apartment/waiting",
      name: "admin_real_estate_ads_waiting",
      beforeEnter: ifIsAdmin,
    },
  ],
});

export default router;
