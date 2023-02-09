<script setup>
import { reactive, ref } from "vue";

const formRef = ref();

const formState = reactive({
  // real estate
  type: "", // -> sale or rent
  price: "",
  title: "",
  description: "",

  // housing
  address: "",
  address2: "",
  city: "",
  zipcode: "",
  lat: "",
  lng: "",
  door: "",
  floor: "",

  // housing properties
  surface: "",
  rooms: "",
  has_garden: false,
  has_parking: false,
  has_pool: false,
  has_cave: false,
  has_attic: false,
  has_balcony: false,
  near_public_transport: false,
  classification: "",
});

const validateType = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Veuillez saisir un type");
  } else {
    return Promise.resolve();
  }
};

const validatePrice = async (_rule, value) => {
  const regex = /^[0-9]+$/;
  if (value === "") {
    return Promise.reject("Veuillez saisir un prix");
  } else if (!regex.test(value)) {
    return Promise.reject("Veuillez saisir un prix valide");
  } else {
    return Promise.resolve();
  }
};

const validateNotEmpty = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Veuillez remplire le champs");
  } else {
    return Promise.resolve();
  }
};

const validateZipcode = async (_rule, value) => {
  const regex = /^[0-9]{5}$/;
  if (value === "") {
    return Promise.reject("Veuillez saisir un code postal");
  } else if (!regex.test(value)) {
    return Promise.reject("Veuillez saisir un code postal valide");
  } else {
    return Promise.resolve();
  }
};

const validateFloor = async (_rule, value) => {
  const regex = /^[0-9]+$/;
  if (value === "") {
    return Promise.resolve();
  } else if (!regex.test(value)) {
    return Promise.reject("Veuillez saisir un étage valide");
  } else {
    return Promise.resolve();
  }
};

const validateSurface = async (_rule, value) => {
  const regex = /^[0-9]+$/;
  if (value === "") {
    return Promise.reject("Veuillez saisir une surface");
  } else if (!regex.test(value)) {
    return Promise.reject("Veuillez saisir une surface valide");
  } else {
    return Promise.resolve();
  }
};

const validateSwitch = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Veuillez remplire le champs");
  } else {
    return Promise.resolve();
  }
};

let rules = {
  type: [
    {
      validator: validateType,
    },
  ],
  price: [
    {
      validator: validatePrice,
    },
  ],
  title: [
    {
      validator: validateNotEmpty,
    },
  ],
  description: [
    {
      validator: validateNotEmpty,
    },
  ],
  address: [
    {
      validator: validateNotEmpty,
    },
  ],
  city: [
    {
      validator: validateNotEmpty,
    },
  ],
  zipcode: [
    {
      validator: validateZipcode,
    },
  ],
  floor: [
    {
      validator: validateFloor,
    },
  ],
  surface: [
    {
      validator: validateSurface,
    },
  ],
  rooms: [
    {
      validator: validateSurface,
    },
  ],
  has_garden: [
    {
      validator: validateSwitch,
    },
  ],
  has_parking: [
    {
      validator: validateSwitch,
    },
  ],
  has_pool: [
    {
      validator: validateSwitch,
    },
  ],
  has_cave: [
    {
      validator: validateSwitch,
    },
  ],
  has_attic: [
    {
      validator: validateSwitch,
    },
  ],
  has_balcony: [
    {
      validator: validateSwitch,
    },
  ],
  near_public_transport: [
    {
      validator: validateSwitch,
    },
  ],
  classification: [
    {
      validator: validateNotEmpty,
    },
  ],
};

const onFinish = (values) => {
  console.log("Success:", values);
};
</script>

<template>
  <a-col :span="8" :offset="8">
    <a-card title="Déposer une annonce">
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
        <a-form-item label="Type" name="type">
          <a-radio-group v-model:value="formState.type">
            <a-radio value="rent">Louer</a-radio>
            <a-radio value="sale">Vendre</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Prix" name="price">
          <a-input v-model:value="formState.price" />
        </a-form-item>

        <a-form-item label="Titre de l'annonce" name="title">
          <a-input v-model:value="formState.title" />
        </a-form-item>

        <a-form-item label="Description" name="description">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>

        <a-form-item label="Adresse" name="address">
          <a-input v-model:value="formState.address" />
        </a-form-item>

        <a-form-item label="Complément" name="address2">
          <a-input v-model:value="formState.address2" />
        </a-form-item>

        <a-form-item label="Ville" name="city">
          <a-input v-model:value="formState.city" />
        </a-form-item>

        <a-form-item label="Zipcode" name="zipcode">
          <a-input v-model:value="formState.zipcode" />
        </a-form-item>

        <a-form-item label="Étage" name="floor">
          <a-input v-model:value="formState.floor" />
        </a-form-item>

        <a-form-item label="Surface" name="surface">
          <a-input v-model:value="formState.surface" />
        </a-form-item>

        <a-form-item label="Nombre de pièce" name="rooms">
          <a-input v-model:value="formState.rooms" />
        </a-form-item>

        <a-form-item label="Possède un jardin">
          <a-switch v-model:checked="formState.has_garden" />
        </a-form-item>

        <a-form-item label="Possède un parking">
          <a-switch v-model:checked="formState.has_parking" />
        </a-form-item>

        <a-form-item label="Possède une piscine">
          <a-switch v-model:checked="formState.has_pool" />
        </a-form-item>

        <a-form-item label="Possède une cave">
          <a-switch v-model:checked="formState.has_cave" />
        </a-form-item>

        <a-form-item label="Possède un grenier">
          <a-switch v-model:checked="formState.has_attic" />
        </a-form-item>

        <a-form-item label="Possède un balcon">
          <a-switch v-model:checked="formState.has_balcony" />
        </a-form-item>

        <a-form-item label="Proche des transports">
          <a-switch v-model:checked="formState.near_public_transport" />
        </a-form-item>

        <a-form-item label="Classification" name="classification">
          <a-radio-group v-model:value="formState.classification">
            <a-radio value="1">insalubrious</a-radio>
            <a-radio value="2">bad</a-radio>
            <a-radio value="3">average</a-radio>
            <a-radio value="4">good</a-radio>
            <a-radio value="5">excellent</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button html-type="submit">Ajouter mon bien</a-button>
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
