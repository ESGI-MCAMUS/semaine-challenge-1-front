<script setup>
import { ref } from "vue";
import router from "../router";

const isLoading = ref(true);

setTimeout(() => {
  isLoading.value = false;
}, 5000);

const goToHome = () => {
  router.push("/profile");
};
</script>

<template>
  <section class="bg-white dark:bg-gray-900" v-if="isLoading">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center">
        <p
          class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white"
        >
          Validation en cours.
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Votre document est en cours de validation.
        </p>
        <a-space>
          <a-spin size="large" />
        </a-space>
      </div>
    </div>
  </section>

  <section class="bg-white dark:bg-gray-900" v-else>
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center">
        <p
          class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white"
        >
          Validé !
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Votre document à bien été validé.
        </p>
        <button
          @click="goToHome"
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Retour au profil
        </button>
      </div>
    </div>
  </section>
</template>
