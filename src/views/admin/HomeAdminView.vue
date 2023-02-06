<script setup>
import { onMounted, reactive } from "vue";
import { client } from "../../services";

const state = reactive({
  apartments: [],
  users: [],
});

const getAllApartements = async () => {
  client
    .get("/real_estate_ads?pagination=false")
    .then((res) => {
      const data = res.data;
      state.apartments = data["hydra:member"];
    })
    .catch((err) => {
      console.log(err);
    });
};

const getUsers = async () => {
  client
    .get("/users?pagination=false")
    .then((res) => {
      const data = res.data;
      state.users = data["hydra:member"];
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  getAllApartements();
  getUsers();
});
</script>

<template>
  <div class="p-4 sm:ml-64">
    <div
      class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700"
    >
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div
          class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"
        >
          <p class="text-2xl text-gray-400 dark:text-gray-500">
            Nombre d'appartement : {{ state.apartments.length }}
          </p>
        </div>
        <div
          class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"
        >
          <p class="text-2xl text-gray-400 dark:text-gray-500">
            Nombre d'utilisateur : {{ state.users.length }}
          </p>
        </div>
      </div>
      <div
        class="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800"
      >
        <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
