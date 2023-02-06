import { createRouter, createWebHistory } from "vue-router";
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
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/likes",
      name: "likes",
      component: LikesView,
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
    },
  ],
});

export default router;
