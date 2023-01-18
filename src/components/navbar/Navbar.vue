<script>
import { ref } from "vue";
import DisconnectedNavbar from "./disconnectedNavbar.vue";

import UserNavbar from "./userNavbar.vue";

// const user = JSON.parse(localStorage.getItem("user"));
const userRole = ref("");

const isUserLoggedIn = () => {
  return userRole.value !== undefined;
};

const isUserAdmin = () => {
  return userRole.value === "ROLE_ADMIN";
};

const isUserUser = () => {
  return userRole.value === "ROLE_USER";
};

export default {
  setup() {
    return {
      userRole,
      isUserLoggedIn,
      isUserAdmin,
      isUserUser,
    };
  },
  components: { DisconnectedNavbar, UserNavbar },
};
</script>

<template>
  <DisconnectedNavbar v-if="!isUserLoggedIn()" />
  <UserNavbar v-if="isUserLoggedIn()" />
</template>
