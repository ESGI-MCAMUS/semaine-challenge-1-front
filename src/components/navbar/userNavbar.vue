<script setup>
import { RouterLink } from "vue-router";
import router from "../../router";
import { token } from "../../utils/localStorage";

const { email, firtname, lastname } = token.value;

const onProfile = () => {
  router.push("/profile");
};
</script>

<template>
  <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <RouterLink :to="{ name: 'home' }">
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

      <div class="flex items-center md:order-2">
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click.prevent>
            <img
              id="user-picture"
              class="w-8 h-8 rounded-full"
              src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
              alt="user photo"
            />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0" disabled>
                <div class="px-4 py-3">
                  <span class="block text-sm text-gray-900"
                    >{{ firtname }} {{ lastname }}</span
                  >
                  <span
                    class="block text-sm font-medium text-gray-500 truncate"
                    >{{ email }}</span
                  >
                </div>
              </a-menu-item>
              <a-menu-divider />

              <a-menu-item key="1">
                <a
                  @click="onProfile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >Profile</a
                >
              </a-menu-item>

              <RouterLink :to="{ name: 'likes' }">
                <a-menu-item key="2">
                  <a
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Mes favoris</a
                  >
                </a-menu-item>
              </RouterLink>

              <a-menu-item key="3">
                <a
                  @click="$emit('logout')"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >Déconnexion</a
                >
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <button
          data-collapse-toggle="mobile-menu-2"
          type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="mobile-menu-2"
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
        id="mobile-menu-2"
      >
        <RouterLink :to="{ name: 'create_real_estate_ads' }">
          <button
            type="button"
            class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              class="w-5 mr-3"
            >
              <g fill="none">
                <path d="M0 0h256v256H0Z"></path>
                <g
                  stroke-linecap="round"
                  stroke-width="24"
                  stroke="#000"
                  fill="none"
                  stroke-linejoin="round"
                >
                  <path d="M40 128l176 0"></path>
                  <path d="M128 40l0 176"></path>
                </g>
              </g>
            </svg>
            Déposer une annonce
          </button>
        </RouterLink>
        <ul
          class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white"
        >
          <li>
            <RouterLink :to="{ name: 'home' }">
              <a
                class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                aria-current="page"
                >Accueil</a
              >
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
