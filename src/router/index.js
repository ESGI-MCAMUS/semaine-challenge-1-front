import { createRouter, createWebHistory } from "vue-router";
import { token } from "../utils/localStorage";
import Error404 from "../views/404View.vue";
import HomeAdminView from "../views/admin/HomeAdminView.vue";
import RealEastateAllAdminView from "../views/admin/realEastate/RealEastateAllAdminView.vue";
import RealEastatePendingAdminView from "../views/admin/realEastate/RealEastatePendingAdminView.vue";
import UserManagment from "../views/admin/users/UserManagmentView.vue";
import ConfirmEmail from "../views/ConfirmEmailView.vue";
import CreateRealEasteAds from "../views/CreateRealEstateAdsView.vue";
import HomeView from "../views/HomeView.vue";
import KYC from "../views/KycView.vue";
import LikesView from "../views/LikesView.vue";
import LoginView from "../views/LoginView.vue";
import NewPassword from "../views/NewPasswordView.vue";
import ProfileView from "../views/ProfileView.vue";
import RealEstateAdsView from "../views/RealEstateAdsView.vue";
import RegisterView from "../views/RegisterView.vue";
import ResetPassword from "../views/ResetPasswordView.vue";
import UpdatePaymentStatus from "../views/UpdatePaymentStatus.vue";
import UploadDocument from "../views/UploadDocumentView.vue";

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

const ifIsAllButNotAdmin = (to, from, next) => {
  if (
    !token.value.token ||
    (token.value.role.includes("ROLE_USER") &&
      !token.value.role.includes("ROLE_ADMIN"))
  ) {
    next();
    return;
  }
  router.push("/admin");
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: ifIsAllButNotAdmin,
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
      path: "/upload-document",
      name: "upload-document",
      component: UploadDocument,
      beforeEnter: ifIsUser,
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
      path: "/real_estate_ads/create",
      name: "create_real_estate_ads",
      component: CreateRealEasteAds,
      beforeEnter: ifIsUser,
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
      component: RealEastateAllAdminView,
      beforeEnter: ifIsAdmin,
    },
    {
      path: "/admin/apartment/waiting",
      name: "admin_real_estate_ads_waiting",
      component: RealEastatePendingAdminView,
      beforeEnter: ifIsAdmin,
    },
    {
      path: "/admin/users/all",
      name: "admin_user_managment",
      component: UserManagment,
      beforeEnter: ifIsAdmin,
    },
    {
      path: "/payments/:status/:id/:token",
      name: "update_payement_status",
      component: UpdatePaymentStatus,
      beforeEnter: ifIsUser,
    },
    {
      path: "/KYC",
      name: "KYC",
      component: KYC,
      beforeEnter: ifIsUser,
    },
    //create 404 page
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: Error404,
    },
  ],
});

export default router;
