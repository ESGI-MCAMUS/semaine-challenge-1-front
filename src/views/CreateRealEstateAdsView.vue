<script setup>
import { notification } from "ant-design-vue";
import { reactive, ref } from "vue";
import router from "../router";
import { client } from "../services";
import { token } from "../utils/localStorage";

const formRef = ref();

const userId = token.value.id;
const housingPropertiesId = ref();
const housingId = ref();

const navigate = (id) => {
  router.push(`${id}`);
};

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
  photos: [],
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
  photos: [
    {
      validator: validateNotEmpty,
    },
  ],
};

const createHousingProperty = async (values) => {
  client
    .post("/housing_properties", {
      type: values.type,
      surface: parseInt(values.surface),
      rooms: parseInt(values.rooms),
      hasGarden: Boolean(values.has_garden),
      hasParking: Boolean(values.has_parking),
      hasPool: Boolean(values.has_pool),
      hasCave: Boolean(values.has_cave),
      hasAttic: Boolean(values.has_attic),
      hasBalcony: Boolean(values.has_balcony),
      nearPublicTransport: Boolean(values.near_public_transport),
      classification: values.classification,
    })
    .then((response) => {
      housingPropertiesId.value = response.data.id;
      createHousing(values);
    })
    .catch((error) => {});
};

const createHousing = async (values) => {
  client
    .post("/housings", {
      properties: "/housing_properties/" + housingPropertiesId.value,
      owner: "/users/" + userId,
      address: values.address,
      address2: values.address2,
      city: values.city,
      zipcode: values.zipcode,
      floor: parseInt(values.floor),
    })
    .then((response) => {
      housingId.value = response.data.id;
      createRealEstateAd(values);
    })
    .catch((error) => {});
};

const createRealEstateAd = async (values) => {
  client
    .post("/real_estate_ads", {
      housing: "/housings/" + housingId.value,
      publisher: "/users/" + userId,
      title: values.title,
      type: values.type,
      description: values.description,
      price: parseInt(values.price),
      isVisible: false,
      photos: formState.photos,
    })
    .then((response) => {
      notification["success"]({
        message: "Annonce créée !",
        description: "Cette annonce a bien été créée !",
      });

      router.push("/");
    })
    .catch((error) => {});
};

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const onFileChange = async (e) => {
  const files = e.target.files;
  const base64Photos = [];
  Promise.all(
    Array.from(files).map(async (file) => {
      const base64 = await convertBase64(file);
      base64Photos.push(base64.substring(22));
    })
  ).then(() => {
    formState.photos = base64Photos;
  });
};

const onFinish = async (values) => {
  if (formState.photos.length === 0) {
    notification["error"]({
      message: "Erreur",
      description: "Veuillez ajouter au moins une photo",
    });
  } else {
    createHousingProperty(values);
  }
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

        <a-form-item label="Possède un jardin" name="has_garden">
          <a-switch v-model:checked="formState.has_garden" />
        </a-form-item>

        <a-form-item label="Possède un parking" name="has_parking">
          <a-switch v-model:checked="formState.has_parking" />
        </a-form-item>

        <a-form-item label="Possède une piscine" name="has_pool">
          <a-switch v-model:checked="formState.has_pool" />
        </a-form-item>

        <a-form-item label="Possède une cave" name="has_cave">
          <a-switch v-model:checked="formState.has_cave" />
        </a-form-item>

        <a-form-item label="Possède un grenier" name="has_attic">
          <a-switch v-model:checked="formState.has_attic" />
        </a-form-item>

        <a-form-item label="Possède un balcon" name="has_balcony">
          <a-switch v-model:checked="formState.has_balcony" />
        </a-form-item>

        <a-form-item label="Proche des transports" name="near_public_transport">
          <a-switch v-model:checked="formState.near_public_transport" />
        </a-form-item>

        <a-form-item label="Classification" name="classification">
          <a-radio-group v-model:value="formState.classification">
            <a-radio value="insalubrious">insalubrious</a-radio>
            <a-radio value="bad">bad</a-radio>
            <a-radio value="average">average</a-radio>
            <a-radio value="good">good</a-radio>
            <a-radio value="excellent">excellent</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Photos" name="photos">
          <a-input
            type="file"
            multiple
            accept="image/png, image/gif, image/jpeg"
            @change="onFileChange($event)"
          />
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
