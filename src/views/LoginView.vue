<script>
import { defineComponent, reactive, ref } from "vue";
import router from "../router";
import { clientWithoutAuth } from "../services";
import { token } from "../utils/localStorage";
import { notification } from "ant-design-vue";

export default defineComponent({
  setup() {
    const formState = reactive({
      username: "",
      password: "",
    });

    const isError = ref(false);

    const onFinish = async (values) => {
      try {
        const res = await clientWithoutAuth.post("/auth", {
          email: values.username,
          password: values.password,
        });

        const user = JSON.parse(atob(res.data.token.split(".")[1]));

        if (user.isActive) {
          const userToken = {
            token: res.data.token,
            id: user.id,
            email: user.username,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            isActive: user.isActive,
          };

          token.value = userToken;

          if (userToken.role.includes("ROLE_ADMIN")) {
            router.push("/admin");
          } else {
            router.push("/");
          }
        } else {
          isError.value = true;
          notification["error"]({
            message: "Oups !",
            description: "Votre compte n'est pas activé !",
          });
        }

        // router.push("/");
      } catch (error) {
        console.error("error", error);
        isError.value = true;
      }
    };
    const onFinishFailed = (errorInfo) => {};
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

<template>
  <a-col :span="8" :offset="8">
    <a-card title="Login">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[
            { required: true, message: 'Veuillez saisir votre adresse mail!' },
          ]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[
            { required: true, message: 'Veuillez saisir votre mot de passe!' },
          ]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="default" html-type="submit">Se connecter</a-button>
          <a-button type="link" @click="this.navToResetPwd"
            >Mot de passe oublié ?</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
  </a-col>
</template>
