<script setup>
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { onMounted, reactive, ref } from "vue";
import AppointementPreview from "../components/UI/AppointementPreview.vue";
import Button from "../components/UI/Button.vue";
import Card from "../components/UI/Card.vue";
import Heading from "../components/UI/Heading.vue";
import MessagePreview from "../components/UI/MessagePreview.vue";
import RealEstateCard from "../components/UI/RealEstateCard.vue";
import Spinner from "../components/UI/Spinner.vue";
import { client } from "../services";
import { token } from "../utils/localStorage";

let isLoading = ref(true);
let user = reactive({});

const getuser = async () => {
  const userId = token.value.id;

  try {
    const res = await client.get(`/users/${userId}`);
    return res;
  } catch (error) {
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
    console.log("user", user);
    isLoading.value = false;
  });
});
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
          <Button> Modifier </Button>
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

      <div v-if="user.housings.length === 0" class="h-36">
        <div>Vous n'avez aucun biens pour le moment.</div>
        <Button class="mt-2"> Ajouter un bien </Button>
      </div>

      <!-- TODO : Faire un pseudo carousel avec les différents bien-->

      <div v-else class="flex overflow-scroll">
        <RealEstateCard class="w-1/3" />
      </div>
    </Card>
    <div class="flex">
      <Card class="w-1/2 h-80 mt-4">
        <Heading>Mes derniers paiements</Heading>
        <!-- <div>Vous n'avez procécés à aucun paiements pour le moment</div> -->

        <!-- TODO : Faire la condition pour les paiements ici -->

        <div class="flex flex-col">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Date</span>
            <span class="text-sm text-gray-500">Montant</span>
          </div>
          <AppointementPreview date="12/12/12" amount="2000" />
        </div>
      </Card>
      <Card class="w-1/2 h-80 mt-4 ml-4">
        <Heading>Mes derniers messages</Heading>
        <!-- <div>Vous n'avez reçus aucun messages pour le moment</div> -->

        <!-- TODO : Faire la condition pour les messages ici -->

        <MessagePreview
          expeditorName="Pata Pouet"
          message="Message random, flemme de styliser, j'deteste vue, j'deteste PHP,
        vivement que ça se finisse."
        />
      </Card>
    </div>
  </div>
</template>

<style></style>
