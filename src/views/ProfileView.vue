<script setup>
import Card from "../components/UI/Card.vue";
import { client } from "../services";
import { useGlobalStore } from "../stores/globalStore";
import { token } from "../utils/localStorage";
const store = useGlobalStore();

store.updateName("Tartipouette");

const onUpdateName = () => {
  store.updateName("OLEL");
};

const getuser = async () => {
  const userId = token.value.id;
  console.log("userId", userId);

  try {
    const res = await client.get(`/users/${userId}`);
    console.log("res", res);
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<template>
  <div class="flex">
    <div
      class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex justify-end px-4 pt-4"></div>
      <div class="flex flex-col items-center pb-10">
        <img
          class="w-24 h-24 mb-3 rounded-full shadow-lg"
          src="https://media.tenor.com/587AABroBfwAAAAS/dance-skeleton.gif"
          alt="Bonnie image"
        />
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {{ store.name }}
        </h5>
        <span class="text-sm text-gray-500 dark:text-gray-400">ROLE</span>
        <div class="flex mt-4 space-x-3 md:mt-6"></div>
      </div>
    </div>
    <Card class="w-[100%]">
      <button
        href="#"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Some action
      </button>
      <button
        @click="onUpdateName"
        href="#"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Change le nom
      </button>
      <button
        @click="getuser"
        href="#"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Get user
      </button>
    </Card>
  </div>
</template>

<style></style>
