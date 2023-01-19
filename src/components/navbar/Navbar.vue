<template>
  <DisconnectedNavbar v-if="!isUserLoggedIn" />
  <UserNavbar v-if="isUserLoggedIn" @logout="logout" />
  <p>{{ role }}</p>
</template>

<script>
import { ref, watchEffect } from "vue";
import { token } from "../../utils/localStorage";
import DisconnectedNavbar from "./disconnectedNavbar.vue";
import UserNavbar from "./userNavbar.vue";

export default {
  methods: {
    logout() {
      token.value = null;
      this.isUserLoggedIn = false;
    },
  },
  setup() {
    const role = ref(token.value.role);
    const isUserLoggedIn = ref(false);
    const isUserAdmin = ref(false);
    const isUserUser = ref(false);

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

    return {
      role,
      isUserLoggedIn,
      isUserAdmin,
      isUserUser,
    };
  },
  components: { DisconnectedNavbar, UserNavbar },
};
</script>
