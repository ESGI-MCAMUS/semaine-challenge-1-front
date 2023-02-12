<script setup>
import { notification } from "ant-design-vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { onMounted, reactive, ref } from "vue";
import Button from "../components/UI/Button.vue";
import Card from "../components/UI/Card.vue";
import Heading from "../components/UI/Heading.vue";
import Spinner from "../components/UI/Spinner.vue";
import router from "../router";
import { client, clientPatch } from "../services";
import { formatPrice } from "../utils/ads.utils";
import { token } from "../utils/localStorage";
import { validateEmail } from "../utils/validators";

let isLoading = ref(true);
let user = reactive({});
let messages = reactive([]);
let senders = reactive([]);
let modalVisible = ref(false);
let messagesFiltered = reactive([]);
let message = ref("");
let payments = reactive([]);
let profileModalVisible = ref(false);
let adModalVisible = ref(false);
let ownerAppointments = reactive([]);
let visitorAppointments = reactive([]);

const formState = reactive({
  firstname: "",
  lastname: "",
  email: "",
  birthdate: "",
});

const formDocumentState = reactive({
  documents: [],
});

const formAdState = reactive({
  adId: "",
  homeId: "",
  homePropertiesId: "",
  title: "",
  description: "",
  price: "",
  surface: "",
  rooms: "",
  address: "",
  city: "",
  zipcode: "",
  type: "",
  classification: "",
});

const rules = {
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
  email: [{ required: false, validator: validateEmail, trigger: "change" }],

  birthdate: [
    { required: true, message: "Veuillez saisir votre date de naissance" },
  ],
};

const adRules = {
  title: [
    { required: false },
    { min: 2, message: "Le titre doit contenir au moins 2 caractères" },
  ],
  description: [
    { required: false },
    {
      min: 2,
      message: "La description doit contenir au moins 2 caractères",
    },
  ],
  price: [
    { required: false },
    { min: 2, message: "Le prix doit contenir au moins 2 caractères" },
  ],
  surface: [
    { required: false },
    { min: 2, message: "La surface doit contenir au moins 2 caractères" },
  ],
  rooms: [
    { required: false },
    {
      min: 2,
      message: "Le nombre de pièces doit contenir au moins 2 caractères",
    },
  ],
  address: [
    { required: false },
    { min: 2, message: "L'adresse doit contenir au moins 2 caractères" },
  ],
  city: [
    { required: false },
    { min: 2, message: "La ville doit contenir au moins 2 caractères" },
  ],
  postalCode: [
    { required: false },
    { min: 2, message: "Le code postal doit contenir au moins 2 caractères" },
  ],
  type: [
    { required: false },
    { min: 2, message: "Le type doit contenir au moins 2 caractères" },
  ],
  category: [
    { required: false },
    { min: 2, message: "La catégorie doit contenir au moins 2 caractères" },
  ],
  images: [{ required: false }],
};

const updateProfileModalVisible = () => {
  profileModalVisible.value = !profileModalVisible.value;
};

const updateAdModalVisible = () => {
  adModalVisible.value = !adModalVisible.value;
};

const onFinish = () => {
  updateUserProfile()
    .then((res) => {
      if (res.status === 200) {
        notification["success"]({
          message: "Changements validés",
          description:
            "La modifications de vos informations personnelles ont bien été prises en compte. Veuillez-vous reconnecter pour voir les changements.",
        });
        updateProfileModalVisible();
        token.value = {};
        router.push("/login");
      }
    })
    .catch((err) => {
      console.log(err);
      notification["error"]({
        message: "Oups !",
        description:
          "Une erreur est survenue durant la mise à jour de vos informations. Si le problème persiste, veuillez contacter le support.",
      });
    });
};

const patchAdsModal = () => {
  try {
    clientPatch
      .patch(`/real_estate_ads/${formAdState.adId}`, {
        title: formAdState.title,
        description: formAdState.description,
        price: parseInt(formAdState.price),
      })
      .then((res) => {
        patchHousingModal(res.data.housing);
      });
  } catch (error) {
    console.log("error patchAdsModal", error);
  }
};

const patchHousingModal = (housingId) => {
  try {
    clientPatch
      .patch(`${housingId}`, {
        address: formAdState.address,
        city: formAdState.city,
        zipcode: formAdState.zipcode,
      })
      .then((res) => {
        patchHousingProperties(res.data.properties);
      });
  } catch (error) {
    console.log("error patchHousingModal", error);
  }
};

const patchHousingProperties = (housingPropertiesId) => {
  try {
    clientPatch
      .patch(`${housingPropertiesId}`, {
        surface: parseInt(formAdState.surface),
        rooms: parseInt(formAdState.rooms),
        type: formAdState.type,
        classification: formAdState.classification,
      })
      .then((res) => {
        notification["success"]({
          message: "Changements validés",
          description: "La modifications votre bien à été pris en compte.",
        });
        updateAdModalVisible();

        getHousings();
      });
  } catch (error) {
    console.log("error patchHousingProperties", error);
  }
};

const updateUserProfile = async () => {
  try {
    const res = await clientPatch.patch(`/users/${user.id}`, {
      firstname: formState.firstname,
      lastname: formState.lastname,
      email: formState.email,
      birthdate: new Date(formState.birthdate.format("YYYY-MM-DD")),
    });
    return res;
  } catch (error) {
    console.log("error updateUserProfile", error);
  }
};

// END MODIFY MODAL

const state = reactive({
  ads: [],
  documents: [],
  modal: {
    visible: false,
    type: "",
    documents: [],
    housing: {},
  },
});

const getuser = async () => {
  const userId = token.value.id;

  try {
    const res = await client.get(`/users/${userId}`);

    return res;
  } catch (error) {
    return undefined;
  }
};

const fetchMyUser = () => {
  client
    .get(`/users/${token.value.id}`)
    .then((res) => {
      console.log(res.data);
      formState.firstname = res.data.firstname;
      formState.lastname = res.data.lastname;
      formState.email = res.data.email;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getHousings = async (route) => {
  client
    .get(`/real_estate_ads?pagination=false`)
    .then((res) => {
      // rajouter les données dans le state en plus de ce qui est déjà dedans

      state.ads = res.data["hydra:member"].filter((ad) => {
        return parseInt(ad.publisher.split("/").pop()) === token.value.id;
      });
      isLoading.value = false;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDocuments = async (route) => {
  client
    .get(`${route}`)
    .then((res) => {
      state.documents = [...state.documents, res.data];

      isLoading.value = false;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getOneRealEstateAdAllInformation = async (adId) => {
  formAdState.adId = adId;
  client
    .get(`/real_estate_ads/${adId}`)
    .then((res) => {
      isLoading.value = false;

      formAdState.title = res.data.title;
      formAdState.description = res.data.description;
      formAdState.price = res.data.price;

      client
        .get(res.data.housing)
        .then((res) => {
          formAdState.city = res.data.city;
          formAdState.address = res.data.address;
          formAdState.floor = res.data.floor;
          formAdState.zipcode = res.data.zipcode;

          client
            .get(res.data.properties)
            .then((res) => {
              formAdState.type = res.data.type;
              formAdState.rooms = res.data.rooms;
              formAdState.surface = res.data.surface;
              formAdState.classification = res.data.classification;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getMessages = async () => {
  try {
    const res = await client.post(`users/messages`);
    return res;
  } catch (error) {
    return undefined;
  }
};

const getPayments = async () => {
  try {
    const res = await client.post(`payments/get`);
    return res;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

onMounted(() => {
  getuser().then((res) => {
    user = {
      ...res.data,
      birthdate: format(new Date(res.data.birthdate), "d MMMM yyyy", {
        locale: fr,
      }),
    };

    user.housings.map((housing) => {
      getHousings(housing);
    });

    user.documents.map((document) => {
      getDocuments(document);
    });
    isLoading.value = false;
  });

  getMessages().then((res) => {
    // Get unique senders
    messages = res.data;
    senders = [
      ...new Set(res.data.receivedMessages.map((message) => message.sender.id)),
    ];
  });

  getAppointments().then((res) => {
    ownerAppointments = res.ownerAppointments;
    visitorAppointments = res.visitorAppointments;
    console.log(ownerAppointments);
    console.log(visitorAppointments);
  });

  getPayments().then((res) => {
    payments = res.data.payments;
  });
});

const openMessages = (senderId) => {
  modalVisible.value = true;
  const filteredReceivedMessages = messages.receivedMessages.filter(
    (message) => message.sender.id === senderId
  );

  const filteredSentMessages = messages.sentMessages.filter(
    (message) => message.receiver.id === senderId
  );

  const messagesFilteredByCreatedAt = [
    ...filteredReceivedMessages,
    ...filteredSentMessages,
  ].sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  messagesFiltered = messagesFilteredByCreatedAt;

  // Scroll to div .bottomMessage
  const bottomMessage = document.querySelector(".bottomMessage");
  bottomMessage.scrollTop = bottomMessage.scrollHeight;
};

const sendMessage = (receiver) => {
  client
    .post(`/messages`, {
      sender: `/users/${token.value.id}`,
      receiver: `/users/${receiver}`,
      message: message.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .then((res) => {
      notification["success"]({
        message: "Message envoyé",
        description: "Votre message a bien été envoyé !",
      });
      message.value = "";
      modalVisible.value = false;
      getMessages().then((res) => {
        // Get unique senders
        messages = res.data;
        senders = [
          ...new Set(
            res.data.receivedMessages.map((message) => message.sender.id)
          ),
        ];
      });
    })
    .catch((err) => {
      console.log(err);
      notification["error"]({
        message: "Oups !",
        description: "Une erreur est survenue lors de l'envoi du message !",
      });
    });
};

const updateModal = (visible, type, documents, housing) => {
  state.modal.visible = visible;
  state.modal.type = type;
  state.modal.documents = documents;
  state.modal.housing = housing;
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
    formDocumentState.documents = base64Photos;
  });
};

const uploadDocuments = (type, documents) => {
  if (formDocumentState.length === 0) {
    notification["error"]({
      message: "Oups !",
      description: "Veuillez ajouter au moins une photo !",
    });
  } else {
    if (type === "add") {
      client
        .post(`documents`, {
          documentsOwner: `/users/${token.value.id}`,
          documents: formDocumentState.documents,
          housing: `/housings/${state.modal.housing["id"]}`,
        })
        .then((res) => {
          notification["success"]({
            message: "Documents ajoutés",
            description: "Vos documents ont bien été ajoutés !",
          });
          updateModal(false, "", []);
          router.push("/KYC");
        })
        .catch((err) => {
          console.log(err);
          notification["error"]({
            message: "Oups !",
            description:
              "Une erreur est survenue lors de l'ajout des documents !",
          });
        });
    } else {
      client
        .patch(`${documents["@id"]}`, {
          documents: formDocumentState.documents,
        })
        .then((res) => {
          notification["success"]({
            message: "Documents modifiés",
            description: "Vos documents ont bien été modifiés !",
          });
          updateModal(false, "", []);
          router.push("/KYC");
        })
        .catch((err) => {
          console.log(err);
          notification["error"]({
            message: "Oups !",
            description:
              "Une erreur est survenue lors de la modification des documents !",
          });
        });
    }
  }
};
getHousings();
fetchMyUser();

const getAppointments = async () => {
  try {
    const res = await client.post(`/appointments/get`);
    console.log("res appointments", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
</script>

<template>
  <div
    v-if="isLoading"
    class="w-[100%] h-[80vh] flex justify-center items-center"
  >
    <Spinner />
  </div>

  <div v-else>
    <div class="flex">
      <div
        class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <div class="flex flex-col items-center justify-center h-[100%]">
          <img
            class="w-24 h-24 mb-3 rounded-full shadow-lg"
            src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
            alt="Profile picture"
          />
        </div>
      </div>
      <Card class="w-[100%] ml-4">
        <div class="flex justify-between">
          <Heading>Mon profil</Heading>
          <a-button @click="updateProfileModalVisible"> Modifier</a-button>
          <a-modal
            v-model:visible="profileModalVisible"
            :title="`Modifier vos informations`"
            @ok="onFinish"
            okText="Valider les modifs"
          >
            <div style="overflow-y: scroll">
              <a-form
                :model="formState"
                name="basic"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 14 }"
                autocomplete="off"
                ref="formRef"
                :rules="rules"
              >
                <a-form-item label="Prénom" name="firstname">
                  <a-input v-model:value="formState.firstname" />
                </a-form-item>

                <a-form-item label="Nom" name="lastname">
                  <a-input v-model:value="formState.lastname" />
                </a-form-item>

                <a-form-item label="Adresse mail" name="email">
                  <a-input v-model:value="formState.email" />
                </a-form-item>

                <a-form-item label="Date de naissance" name="birthdate">
                  <a-date-picker
                    v-model:value="formState.birthdate"
                    label="JJ/MM/YYYY"
                  />
                </a-form-item>
              </a-form>
            </div>
          </a-modal>
        </div>

        <div class="flex">
          <div class="flex flex-col mt-4 w-1/2">
            <div class="flex flex-col">
              <span class="text-sm text-gray-500">Nom</span>
              <span class="text-sm text-gray-900">{{
                formState.lastname
              }}</span>
            </div>
            <div class="flex flex-col mt-4">
              <span class="text-sm text-gray-500">Prénom</span>
              <span class="text-sm text-gray-900">{{
                formState.firstname
              }}</span>
            </div>
          </div>
          <div class="flex flex-col mt-4">
            <div class="flex flex-col">
              <span class="text-sm text-gray-500">Date de naissance</span>
              <span class="text-sm text-gray-900">{{
                formState.birthdate
              }}</span>
            </div>
            <div class="flex flex-col mt-4">
              <span class="text-sm text-gray-500">Email</span>
              <span class="text-sm text-gray-900">{{ formState.email }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <Card class="w-[100%] h-[100%] mt-4">
      <Heading>Mes biens</Heading>
      <div class="flex overflow-scroll">
        <div v-for="ad in state.ads" :key="ad.id">
          <a-card
            style="width: 300px; margin-left: 5px; margin-right: 5px"
            :title="ad.title"
          >
            <template #extra>
              <RouterLink
                :to="{ name: 'real_estate_ads', params: { id: ad.id } }"
              >
                <a href=""> Voir mon bien </a>
              </RouterLink>
            </template>
            <span
              v-if="ad.isVisible === true"
              class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
              >Validé</span
            >
            <span
              v-else
              class="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
              >En cours de validation</span
            >

            <p>
              Type:
              <span v-if="ad.type === 'sale'">VENTE</span>
              <span v-else>LOUER</span>
            </p>
            <p>Prix: {{ ad.price }}€</p>

            <p>{{ ad.zipcode }}</p>
            <Button
              @click="
                updateModal(
                  true,
                  state.documents.some(
                    (doc) => doc.housing === `/housings/${ad['id']}`
                  )
                    ? 'edit'
                    : 'add',
                  state.documents.find(
                    (doc) => doc.housing === `/housings/${ad['id']}`
                  ),
                  ad
                )
              "
              >{{
                state.documents.find(
                  (doc) => doc.housing === `/housings/${ad["id"]}`
                )
                  ? "Modifier document(s)"
                  : "Ajouter document(s)"
              }}</Button
            >
            <a-modal
              v-model:visible="state.modal.visible"
              :title="`${
                state.modal.type === 'add' ? 'Ajouter' : 'Modifier'
              } des documents`"
              @ok="uploadDocuments(state.modal.type, state.modal.documents)"
            >
              <div
                :style="
                  state.modal.documents !== undefined
                    ? 'height: 50vh; overflow-y: scroll'
                    : ''
                "
              >
                <div v-if="state.modal.documents !== undefined">
                  <img
                    v-for="img in state.modal.documents.documents"
                    :src="img"
                    alt="document"
                    style="width: 100%"
                  />
                </div>
                <br />
                <a-form
                  :model="formDocumentState"
                  @finish="
                    uploadDocuments(state.modal.type, state.modal.documents)
                  "
                >
                  <a-form-item label="Documents" name="documents">
                    <a-input
                      type="file"
                      multiple
                      accept="image/png, image/gif, image/jpeg"
                      @change="onFileChange($event)"
                    />
                  </a-form-item>
                </a-form>
              </div>
            </a-modal>
            <a-button
              @click="
                getOneRealEstateAdAllInformation(ad.id) &&
                  updateAdModalVisible()
              "
            >
              Modifier mon bien
            </a-button>
          </a-card>
        </div>
      </div>
      <a-modal
        v-model:visible="adModalVisible"
        :title="`Modifier les infrormations de votre bien`"
        @ok="patchAdsModal()"
        okText="Valider les modifs"
      >
        <div style="overflow-y: scroll">
          <a-form
            :model="formAdState"
            name="basic"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 14 }"
            autocomplete="off"
            ref="formRef"
            :rules="adRules"
          >
            <a-form-item label="Titre" name="title">
              <a-input v-model:value="formAdState.title" />
            </a-form-item>
            <a-form-item label="Description" name="Description">
              <a-input v-model:value="formAdState.description" />
            </a-form-item>
            <a-form-item label="Prix" name="price">
              <a-input v-model:value="formAdState.price" />
            </a-form-item>
            <a-form-item label="Surface" name="surface">
              <a-input v-model:value="formAdState.surface" />
            </a-form-item>
            <a-form-item label="Pièces" name="rooms">
              <a-input v-model:value="formAdState.rooms" />
            </a-form-item>
            <a-form-item label="Adresse" name="address">
              <a-input v-model:value="formAdState.address" />
            </a-form-item>
            <a-form-item label="Ville" name="city">
              <a-input v-model:value="formAdState.city" />
            </a-form-item>
            <a-form-item label="Code postal" name="postalCode">
              <a-input v-model:value="formAdState.zipcode" />
            </a-form-item>

            <a-form-item label="Type" name="type">
              <a-radio-group v-model:value="formAdState.type">
                <a-radio value="rent">Louer</a-radio>
                <a-radio value="sale">Vendre</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="Classification" name="classification">
              <a-radio-group v-model:value="formAdState.classification">
                <a-radio value="insalubrious">insalubrious</a-radio>
                <a-radio value="bad">bad</a-radio>
                <a-radio value="average">average</a-radio>
                <a-radio value="good">good</a-radio>
                <a-radio value="excellent">excellent</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </div>
      </a-modal>
    </Card>

    <div class="flex">
      <Card class="w-1/2 h-80 mt-4">
        <Heading>Mes derniers paiements</Heading>
        <!-- <div>Vous n'avez procécés à aucun paiements pour le moment</div> -->

        <!-- TODO : Faire la condition pour les paiements ici -->

        <div class="flex flex-col" style="overflow-y: scroll">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Date</span>
            <span class="text-sm text-gray-500">Statut</span>
            <span class="text-sm text-gray-500">Montant</span>
          </div>
          <br />
          <div class="flex justify-between" v-for="p in payments">
            <span class="text-sm text-gray-900">
              {{ new Date(p.createdAt).toLocaleString() }}
            </span>
            <span
              class="text-sm text-gray-900"
              v-if="p.status === 'pending'"
              style="font-style: italic !important"
            >
              En attente
            </span>
            <span
              class="text-sm text-danger-900"
              v-else-if="p.status === 'failed'"
              style="color: red; font-weight: 600"
            >
              Échoué
            </span>
            <span
              class="text-sm text-gray-900"
              style="color: green; font-weight: 600"
              v-else
            >
              Réussi
            </span>
            <span class="text-sm text-gray-900">
              {{ formatPrice(p.price) }}€
            </span>
          </div>
        </div>
      </Card>
      <Card class="w-1/2 h-80 mt-4 ml-4">
        <Heading>Mes messages</Heading>
        <!-- <div>Vous n'avez reçus aucun messages pour le moment</div> -->

        <!-- TODO : Faire la condition pour les messages ici -->
        <div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Expediteur</span>
            <span class="text-sm text-gray-500">Action</span>
          </div>
          <br />
          <div class="flex justify-between" v-for="senderId in senders">
            <span class="text-sm text-gray-900"
              >{{
                messages.receivedMessages.find((m) => m.sender.id == senderId)
                  .sender.firstname
              }}
              {{
                messages.receivedMessages.find((m) => m.sender.id == senderId)
                  .sender.lastname
              }}</span
            >
            <Button @click="openMessages(senderId)">Consulter</Button>
            <a-modal
              v-model:visible="modalVisible"
              :title="`Messages`"
              @ok="sendMessage(senderId)"
              okText="Envoyer message"
            >
              <div style="height: 50vh; overflow-y: scroll">
                <div v-for="message in messagesFiltered" :key="message.id">
                  <div
                    v-if="message.sender.id === senderId"
                    style="margin-top: 10px; margin-bottom: 10px"
                  >
                    <div class="flex justify-end">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-900">
                          {{ message.message }}
                        </span>
                        <span class="text-sm text-gray-500">
                          {{ message.createdAt }} —
                          {{ message.sender.firstname }}
                          {{ message.sender.lastname }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div
                      class="flex justify-start"
                      style="margin-top: 10px; margin-bottom: 10px"
                    >
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-900">
                          {{ message.message }}
                        </span>
                        <span class="text-sm text-gray-500">
                          {{ message.createdAt }} —
                          {{ message.sender.firstname }}
                          {{ message.sender.lastname }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bottomMessage"></div>
              </div>
              <a-input
                placeholder="Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui."
                v-model:value="message"
                autofocus
              />
            </a-modal>
          </div>
        </div>
      </Card>
    </div>
    <div class="flex">
      <Card class="w-1/2 h-80 mt-4">
        <Heading>Mes rendez-vous (propriétaires)</Heading>

        <div class="flex flex-col justify-between">
          <div
            v-if="ownerAppointments.length > 0"
            class="flex w-[100%] justify-between"
          >
            <span class="text-sm ml-4 text-gray-500">Date</span>
            <span class="text-sm ml-4 text-gray-500">Statut</span>
          </div>

          <div v-if="ownerAppointments.length === 0" class="flex">
            <div>Vous n'avez aucun rendez-vous pour le moment</div>
          </div>
          <div
            v-for="ao in ownerAppointments"
            :key="ao.id"
            class="flex ml-4 justify-between"
          >
            <span class="text-sm text-gray-900">
              {{ new Date(ao.date).toLocaleDateString() }}
            </span>
            <span
              class="text-sm text-gray-900"
              v-if="ao.status === 'pending'"
              style="font-style: italic !important"
            >
              Visite programmée
            </span>
          </div>
        </div>
      </Card>

      <Card class="w-1/2 h-80 mt-4 ml-4">
        <Heading>Mes rendez-vous (visiteurs)</Heading>

        <div class="flex flex-col justify-between">
          <div
            v-if="visitorAppointments.length > 0"
            class="flex w-[100%] justify-between"
          >
            <span class="text-sm ml-4 text-gray-500">Date</span>
            <span class="text-sm ml-4 text-gray-500">Statut</span>
          </div>

          <div v-if="visitorAppointments.length === 0" class="flex">
            <div>Vous n'avez aucun rendez-vous pour le moment</div>
          </div>
          <div
            v-for="av in visitorAppointments"
            :key="av.id"
            class="flex ml-4 justify-between"
          >
            <span class="text-sm text-gray-900">
              {{ new Date(av.date).toLocaleDateString() }}
            </span>
            <span
              class="text-sm text-gray-900"
              v-if="av.status === 'pending'"
              style="font-style: italic !important"
            >
              Visite programmée
            </span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
