<script setup>
import { ref } from "vue";
import router from "../router";

const goToHome = () => {
  router.push("/");
};

const counter = ref(5);

const decrement = () => {
  counter.value--;
};

setInterval(decrement, 1000);

setTimeout(goToHome, 5000);
</script>

<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center">
        <h1
          class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500"
        >
          404
        </h1>
        <p
          class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white"
        >
          Il manque quelque chose.
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Désolé, nous ne trouvons pas cette page. Vous trouverez beaucoup de
          choses à explorer sur la page d'accueil.
        </p>

        <h3
          class="mb-4 text-4xl tracking-tight font-extrabold lg:text-4xl text-primary-600 dark:text-primary-500"
        >
          Redirection dans <span class="text-5xl">{{ counter }} </span>
        </h3>
      </div>
    </div>
  </section>
</template>
