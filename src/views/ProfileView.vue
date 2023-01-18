<script setup>
import { useGlobalStore } from "../stores/globalStore";
const store = useGlobalStore();

console.log(store);
console.log(store.name);
store.updateName("Tartipouette");
console.log(store.name);

const onUpdateName = () => {
  store.updateName("OLEL");
};
</script>

<template>
  <div class="container">
    <div
      class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex justify-end px-4 pt-4">
        <button
          id="dropdownButton"
          data-dropdown-toggle="dropdown"
          class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
          type="button"
        >
          <span class="sr-only">Open dropdown</span>
        </button>
      </div>
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
    <div>
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
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
}
</style>
