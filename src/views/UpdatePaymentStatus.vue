<template></template>
<script>
import { notification } from "ant-design-vue";
import { defineComponent } from "vue";
import router from "../router";
import { client } from "../services";

export default defineComponent({
  setup() {
    const status = router.currentRoute.value.params.status;
    const id = router.currentRoute.value.params.id;
    const token = router.currentRoute.value.params.token;

    client
      .post(`/payments/${status}/${id}/${token}`, {})
      .then((res) => {
        if (res.status === 200) {
          status === "success"
            ? notification["success"]({
                message: "Youpi !",
                description:
                  "Votre paiement a été accepté avec succès ! Vous le retrouverez dans votre espace personnel.",
              })
            : notification["error"]({
                message: "Oups !",
                description:
                  "Votre paiement à échoué ! Veuillez vérifier vos modalités de paiement et réessayer. Si le problème persiste, veuillez contacter le support.",
              });
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
        notification["error"]({
          message: "Oups !",
          description:
            "Votre paiement à échoué ! Veuillez vérifier vos modalités de paiement et réessayer. Si le problème persiste, veuillez contacter le support.",
        });
        router.push("/");
      });
  },
});
</script>
