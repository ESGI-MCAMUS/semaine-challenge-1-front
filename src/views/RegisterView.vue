<template>
  <!-- add antd col -->
  <a-col :span="8" :offset="8">
    <a-card title="Inscription">
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
        <a-form-item label="Prénom" name="firstname">
          <a-input v-model:value="formState.firstname" />
        </a-form-item>
        <a-form-item label="Nom de famille" name="lastname">
          <a-input v-model:value="formState.lastname" />
        </a-form-item>

        <a-form-item label="Date de naissance" name="birthdate">
          <a-date-picker
            v-model:value="formState.birthdate"
            label="JJ/MM/YYYY"
          />
        </a-form-item>

        <a-form-item label="Adresse mail" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="Mot de passe" name="password">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-form-item label="Répéter mot de passe" name="password2">
          <a-input-password v-model:value="formState.password2" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">S'inscrire</a-button>
        </a-form-item>
      </a-form>
      <a-typography-text type="success" v-if="formState.isSuccess"
        >Votre compte a été créé avec succès. Afin de vous connecter, veuillez
        ouvrir votre boite mail et confirmer votre compte</a-typography-text
      >
      <a-typography-text type="danger" v-if="formState.isError"
        >Oups une erreur est survenue :
        {{ formState.message }}</a-typography-text
      >
    </a-card>
  </a-col>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { client } from "../services";

export default defineComponent({
  setup() {
    const formRef = ref();
    const formState = reactive({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      password2: "",
      birthdate: "",
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

    const validateEmail = async (_rule, value) => {
      // regex pour valider l'email
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (value === "") {
        return Promise.reject("Veuillez saisir votre adresse mail");
      } else if (!regex.test(value)) {
        return Promise.reject("Veuillez saisir une adresse mail valide");
      } else {
        return Promise.resolve();
      }
    };

    let rules = {
      firstname: [
        { required: true, message: "Veuillez saisir votre prénom" },
        { min: 2, message: "Le prénom doit contenir au moins 2 caractères" },
      ],
      lastname: [
        { required: true, message: "Veuillez saisir votre nom de famille" },
        {
          min: 2,
          message: "Le nom de famille doit contenir au moins 2 caractères",
        },
      ],
      email: [{ required: true, validator: validateEmail, trigger: "change" }],
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
      birthdate: [
        { required: true, message: "Veuillez saisir votre date de naissance" },
      ],
    };

    const onFinish = (values) => {
      formState.isSuccess = false;
      formState.isError = false;
      formState.message = "";
      client
        .post("/users", {
          email: values.email,
          plainPassword: values.password,
          birthdate: new Date(values.birthdate.format("YYYY-MM-DD")),
          firstname: values.firstname,
          lastname: values.lastname,
        })
        .then((res) => {
          if (res.status === 201) {
            formState.isSuccess = true;
            formState.firstname = "";
            formState.lastname = "";
            formState.email = "";
            formState.password = "";
            formState.password2 = "";
            formState.birthdate = "";
            formRef.value.resetFields();
          }
        })
        .catch((error) => {
          const res = error.response;
          if (res.status === 422) {
            console.log(res.data["hydra:description"]);
            if (
              res.data["hydra:description"].includes(
                "email: This value is already used"
              )
            ) {
              formState.isError = true;
              formState.message = "Cette adresse mail est déjà utilisée";
            }
          }
          if (res.status === 500) {
            console.log("server error");
            formState.isError = true;
            formState.message = "Erreur du serveur";
          }
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
