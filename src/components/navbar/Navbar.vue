<script>
import { ref, watchEffect } from "vue";
import { token } from "../../utils/localStorage";
import DisconnectedNavbar from "./disconnectedNavbar.vue";
import UserNavbar from "./userNavbar.vue";

export default {
  setup() {
    const user = ref(token);

    const role = ref(token.value.role);

    watchEffect(
      () => {
        role.value = token.value.role;
      },
      { flush: "post" }
    );

    const isUserLoggedIn = () => {
      return role?.value !== undefined;
    };

    const isUserAdmin = () => {
      return role?.value === "ROLE_ADMIN";
    };

    const isUserUser = () => {
      return role?.value === "ROLE_USER";
    };

    //watch lorsque le role change

    // useEffect -> computed

    return {
      user,
      role,
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
