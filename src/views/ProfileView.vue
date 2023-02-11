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

const formState = reactive({
  firstname: "",
  lastname: "",
  email: "",
  birthdate: "",
});

const state = reactive({
  ads: [],
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

const updateProfileModalVisible = () =>
  (profileModalVisible.value = !profileModalVisible.value);

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

const getuser = async () => {
  const userId = token.value.id;

  try {
    const res = await client.get(`/users/${userId}`);

    return res;
  } catch (error) {
    return undefined;
  }
};

const getRealEstateAd = async () => {
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

    isLoading.value = false;
  });

  getMessages().then((res) => {
    // Get unique senders
    messages = res.data;
    senders = [
      ...new Set(res.data.receivedMessages.map((message) => message.sender.id)),
    ];
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

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

getRealEstateAd();
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
        <div class="flex flex-col items-center mt-3">
          <img
            class="w-24 h-24 mb-3 rounded-full shadow-lg"
            src="https://i.seadn.io/gae/2hDpuTi-0AMKvoZJGd-yKWvK4tKdQr_kLIpB_qSeMau2TNGCNidAosMEvrEXFO9G6tmlFlPQplpwiqirgrIPWnCKMvElaYgI-HiVvXc?auto=format&w=1000"
            alt="Profile picture"
          />
          <h5 class="mb-1 text-xl font-medium text-gray-900">
            {{ user.firstname }} {{ user.lastname }}
          </h5>
          <span class="text-sm text-gray-500">ROLE</span>
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

                <!-- <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                  <a-button html-type="submit">BOUTON VALIDER FORM</a-button>
                </a-form-item> -->
              </a-form>
            </div>
          </a-modal>
        </div>

        <div class="flex">
          <div class="flex flex-col mt-4 w-1/2">
            <div class="flex flex-col">
              <span class="text-sm text-gray-500">Nom</span>
              <span class="text-sm text-gray-900">{{ user.lastname }}</span>
            </div>
            <div class="flex flex-col mt-4">
              <span class="text-sm text-gray-500">Prénom</span>
              <span class="text-sm text-gray-900">{{ user.firstname }}</span>
            </div>
          </div>
          <div class="flex flex-col mt-4">
            <div class="flex flex-col">
              <span class="text-sm text-gray-500">Date de naissance</span>
              <span class="text-sm text-gray-900">{{ user.birthdate }}</span>
            </div>
            <div class="flex flex-col mt-4">
              <span class="text-sm text-gray-500">Email</span>
              <span class="text-sm text-gray-900">{{ user.email }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <Card class="w-[100%] h-[100%] mt-4">
      <Heading>Mes biens</Heading>

      <!-- <div v-if="user.housings.length === 0" class="h-36">
        <div>Vous n'avez aucun biens pour le moment.</div>
        <Button class="mt-2"> Ajouter un bien </Button>
      </div> -->

      <!-- TODO : Faire un pseudo carousel avec les différents bien-->

      <div class="flex overflow-scroll">
        <div v-for="ad in state.ads" :key="ad.id">
          <a-card style="width: 300px" :title="ad.title">
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
              >Valider</span
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

            <!-- <p>{{ ad.city }}</p>
            <p>{{ ad.zipcode }}</p>
            <p>{{ ad.properties }}</p> -->
          </a-card>
        </div>
      </div>
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
  </div>
</template>
