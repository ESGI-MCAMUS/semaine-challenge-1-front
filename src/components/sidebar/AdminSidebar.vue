<template>
  <aside class="w-64 sidebar" aria-label="Sidebar">
    <div class="px-3 py-4 overflow-y-auto rounded bg-gray-50 0 h-full">
      <ul class="space-y-2">
        <li>
          <a
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            </svg>
            <span class="ml-3">Dashboard</span>
          </a>
        </li>

        <li>
          <a
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <svg
              aria-hidden="true"
              class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="flex-1 ml-3 whitespace-nowrap">Utilisateurs</span>
          </a>
        </li>

        <li>
          <button
            type="button"
            class="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
            >
              <path fill="none" d="M0 0h24v24H0Z"></path>
              <path
                fill="#6A7280"
                d="M19 12h3L12 3 2 12h3v8h2v-2h10v2h2v-8ZM7.21 10h9.58l.21.19V12H7v-1.81l.21-.19Zm7.36-2H9.43L12 5.69 14.57 8ZM7 16v-2h10v2H7Z"
              ></path>
            </svg>
            <span
              class="flex-1 ml-3 text-left whitespace-nowrap"
              sidebar-toggle-item
              >Appartement</span
            >
            <svg
              sidebar-toggle-item
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <ul id="dropdown-example" class="hidden py-2 space-y-2">
            <li>
              <a
                href="#"
                class="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                >Tout les appartement</a
              >
            </li>
            <li>
              <a
                href="#"
                class="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                >En attente de validation</a
              >
            </li>
          </ul>
        </li>

        <li>
          <a
            @click="$emit('logout')"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
            >
              <path fill="none" d="M0 0h24v24H0Z"></path>
              <path
                fill="#6A7280"
                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5ZM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5Z"
              ></path>
            </svg>
            <span class="flex-1 ml-3 whitespace-nowrap">Déconnexion</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  margin-left: 0;
  z-index: 100;
}
</style>
