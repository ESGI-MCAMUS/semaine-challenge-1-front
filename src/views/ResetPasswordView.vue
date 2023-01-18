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
import axios from "axios";
import { defineComponent, reactive } from "vue";
import router from "../router";

export default defineComponent({
  setup() {
    const formState = reactive({
      username: "",
      password: "",
      remember: true,
      navToResetPassword: () => {
        console.log("navToResetPassword");
        router.push("/reset-password");
      },
    });

    // log le router actuel

    const onFinish = (values) => {
      console.log("Success:", values);

      axios
        .post("/auth", { email: values.username, password: values.password })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            //add user to localStorage
            const token = res.data.token;
            const user = JSON.parse(atob(token.split(".")[1]));
            localStorage.setItem("user", JSON.stringify(user));

            router.push("/");
          }
        })
        .catch((err) => {
          const res = err.response;
          if (res.status === 401) {
            console.log("unauthorized");
          }
          if (res.status === 500) {
            console.log("server error");
          }
        });
    };
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    const navToResetPwd = () => {
      console.log("navToResetPwd");
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
