<script setup>
import { ref, watchEffect } from "vue";
import router from "../../router";
import { token } from "../../utils/localStorage";
import DisconnectedNavbar from "./disconnectedNavbar.vue";
import UserNavbar from "./userNavbar.vue";

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
    if (token.value === null) {
      role.value = undefined;
    } else {
      role.value = token.value.role;
    }

    if (role.value !== undefined) {
      isUserLoggedIn.value = true;
    } else {
      isUserLoggedIn.value = false;
    }

    if (role.value === "ROLE_ADMIN") {
      isUserAdmin.value = true;
    } else {
      isUserAdmin.value = false;
    }

    if (role.value === "ROLE_USER") {
      isUserUser.value = true;
    } else {
      isUserUser.value = false;
    }
  },
  { flush: "post" }
);
</script>

<template>
  <DisconnectedNavbar v-if="!isUserLoggedIn" />
  <UserNavbar v-if="isUserLoggedIn" @logout="logout" />
</template>
