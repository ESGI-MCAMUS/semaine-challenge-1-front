<template>
  <!-- add antd col -->
  <a-col :span="8" :offset="8">
    <a-card title="Votre nouveau mot de passe">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        @handleValidate="handleValidate"
        ref="formRef"
        :rules="rules"
      >
        <a-form-item label="Mot de passe" name="password">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-form-item label="Répéter mot de passe" name="password2">
          <a-input-password v-model:value="formState.password2" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit"
            >Changer mon mot de passe</a-button
          >
        </a-form-item>
      </a-form>
      <a-typography-text type="success" v-if="formState.isSuccess"
        >Votre mot de passe a été modifié avec succès. Vous pouvez désormais
        vous connecter</a-typography-text
      >
      <a-typography-text type="danger" v-if="formState.isError"
        >Oups une erreur est survenue :
        {{ formState.message }}</a-typography-text
      >
    </a-card>
  </a-col>
</template>

<script>
import axios from "axios";
import { defineComponent, reactive, ref } from "vue";
import router from "../router";

export default defineComponent({
  setup() {
    const formRef = ref();
    const formState = reactive({
      password: "",
      password2: "",
      isSuccess: false,
      isError: false,
      message: "",
    });

    const validatePass = async (_rule, value) => {
      // regex pour valider le mot de passe
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (value === "") {
        return Promise.reject("Veuillez saisir votre mot de passe");
      } else if (!regex.test(value)) {
        return Promise.reject(
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre"
        );
      } else {
        return Promise.resolve();
      }
    };

    const validateCheckPass = async (_rule, value) => {
      if (value === "") {
        return Promise.reject("Veuillez confirmer votre mot de passe");
      } else if (value !== formState.password) {
        return Promise.reject("Les mots de passe ne correspondent pas");
      } else {
        return Promise.resolve();
      }
    };

    let rules = {
      password: [
        {
          required: true,
          validator: validatePass,
          trigger: "change",
        },
      ],
      password2: [
        {
          required: true,
          validator: validateCheckPass,
          trigger: "change",
        },
      ],
    };

    const token = router.currentRoute.value.params.token;

    const onFinish = (values) => {
      formState.isSuccess = false;
      formState.isError = false;
      formState.message = "";
      axios
        .post("/users/reset-password", {
          token,
          plainPassword: values.password,
        })
        .then((res) => {
          router.push("/login");
        })
        .catch((error) => {
          const res = error.response;

          formState.isError = true;
          formState.message =
            "Une erreur est survenue lors de la mise à jour de votre mot de passe, veuillez réesayer plus tard";
        });
    };
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
      rules,
    };
  },
});
</script>
