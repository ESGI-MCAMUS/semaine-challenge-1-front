<script setup>
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { onMounted, reactive, ref } from "vue";
import Button from "../components/UI/Button.vue";
import Card from "../components/UI/Card.vue";
import Heading from "../components/UI/Heading.vue";
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
    isLoading.value = false;
  });
});
</script>

<template>
  <div v-if="isLoading"></div>
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
    <Card class="w-[100%] h-80 mt-4">
      <Heading>Mes biens</Heading>
      <div>Vous ne posséder aucun bien pour le moment</div>
    </Card>
    <div class="flex">
      <Card class="w-[100%] h-80 mt-4">
        <Heading>Mes derniers paiements</Heading>
        <div>Vous n'avez procécés à aucuns paiements pour le moment</div>
      </Card>
      <Card class="w-[100%] h-80 mt-4 ml-4">
        <Heading>Mes derniers messages</Heading>
        <div>Vous n'avez reçus aucun messages pour le moment</div>
      </Card>
    </div>
  </div>
</template>

<style></style>
