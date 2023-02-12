<script setup>
import { ref, watchEffect } from "vue";
import router from "../../router";
import { token } from "../../utils/localStorage";
import DisconnectedNavbar from "../navbar/disconnectedNavbar.vue";
import UserNavbar from "../navbar/userNavbar.vue";
import AdminSidebar from "../sidebar/AdminSidebar.vue";

let role = ref(token.value.role);
let isUserLoggedIn = ref(false);
let isUserAdmin = ref(false);
let isUserUser = ref(false);

const logout = () => {
  token.value = {};
  isUserLoggedIn.value = false;
  router.push("/login");
};

watchEffect(
  () => {
    token.value === null
      ? (role.value = undefined)
      : (role.value = token.value.role);

    if (role.value !== undefined) {
      isUserLoggedIn.value = true;

      role.value.includes("ROLE_ADMIN")
        ? (isUserAdmin.value = true)
        : (isUserAdmin.value = false);

      role.value.includes("ROLE_USER")
        ? (isUserUser.value = true)
        : (isUserUser.value = false);
    } else {
      isUserLoggedIn.value = false;
    }
  },
  { flush: "post" }
);
</script>

<template>
  <DisconnectedNavbar v-if="!isUserLoggedIn" />
  <UserNavbar
    v-if="isUserLoggedIn && isUserUser && !isUserAdmin"
    v-model="isUserUser"
    @logout="logout"
  />
  <AdminSidebar
    v-if="isUserLoggedIn && isUserAdmin"
    v-model="isUserAdmin"
    @logout="logout"
  />
</template>
