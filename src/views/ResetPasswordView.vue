<template>
  <!-- add antd col -->
  <a-col :span="8" :offset="8">
    <a-card title="Réinitialiser mon mot de passe">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-typography-text
          >Pour réinitialiser votre mot de passe, veuillez saisir votre adresse
          email. Vous recevrez un mail avec les instructions pour le
          réintialiser.</a-typography-text
        >

        <a-form-item
          label="Adresse mail"
          name="email"
          :rules="[
            { required: true, message: 'Veuillez saisir votre adresse mail!' },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Envoyer un mail</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-col>
</template>
<script>
import { notification } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import router from "../router";
import { client, clientWithoutAuth } from "../services";

export default defineComponent({
  setup() {
    const formState = reactive({
      email: "",
    });

    // log le router actuel

    const onFinish = (values) => {
      clientWithoutAuth
        .post("/users/reset-password/email", {
          email: formState.email,
        })
        .then((res) => {
          if (res.status === 200) {
            //add user to localStorage
            notification["success"]({
              message: "Succès",
              description: "Un mail vous a été envoyé !",
            });
            router.push("/login");
          }
        })
        .catch((err) => {
          notification["error"]({
            message: "Oups",
            description:
              "Une erreur s'est produite lors de l'envoi de l'email !",
          });
          const res = err.response;
          if (res.status === 401) {
          }
          if (res.status === 500) {
          }
        });
    };
    const onFinishFailed = (errorInfo) => {};

    const navToResetPwd = () => {
      router.push("/reset-password");
    };

    return {
      formState,
      onFinish,
      onFinishFailed,
      navToResetPwd,
    };
  },
});
</script>
