<template>
  <!-- add antd col -->
  <a-col :span="8" :offset="8">
    <a-card title="Vérification de l'adresse mail">
      <a-typography-text>{{ state.message }}</a-typography-text>
    </a-card>
  </a-col>
</template>
<script>
import axios from "axios";
import { defineComponent, reactive } from "vue";
import router from "../router";
import { client } from "../services";

export default defineComponent({
  setup() {
    const state = reactive({
      message: "Votre compte est en cours de vérification...",
    });

    // log le router actuel

    const token = router.currentRoute.value.params.token;
    client
      .post(`/users/verify/${token}`, {})
      .then((res) => {
        if (res.status === 200) {
          router.push("/login");
        }
      })
      .catch((err) => {
        const res = err.response;
        switch (res.data.message) {
          case "Invalid token":
            state.message =
              "Le token est invalide, veuillez réessayer. Si le problème persiste, veuillez contacter le support.";

            break;

          default:
            break;
        }

        console.log(res);
      });

    return {
      state,
    };
  },
});
</script>
