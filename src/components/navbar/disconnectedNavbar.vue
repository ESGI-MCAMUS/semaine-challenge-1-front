<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <RouterLink to="/">
        <a class="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            class="h-6 mr-3 sm:h-9"
            alt="Flowbite Logo"
          />

          <span class="self-center text-xl font-semibold whitespace-nowrap"
            >HabitatHunter</span
          >
        </a>
      </RouterLink>
      <div class="flex md:order-2">
        <RouterLink to="/login">
          <button
            id="login-button"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
          >
            Se connecter
          </button>
        </RouterLink>

        <RouterLink to="/register">
          <button
            type="button"
            class="ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
          >
            S'inscrire
          </button>
        </RouterLink>
        <button
          data-collapse-toggle="navbar-cta"
          type="button"
          class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-cta"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-cta"
      ></div>
    </div>
  </nav>
</template>
