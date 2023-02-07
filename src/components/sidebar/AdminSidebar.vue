<script setup></script>
<template>
  <aside class="w-64 sidebar" aria-label="Sidebar">
    <div class="px-3 py-4 overflow-y-auto rounded bg-gray-50 0 h-full">
      <ul class="space-y-2">
        <li>
          <a-menu
            v-model:selectedKeys="selectedKeys"
            style="background-color: #f8fafa; width: 100%"
            mode="inline"
            :open-keys="openKeys"
            @openChange="onOpenChange"
          >
            <RouterLink :to="{ name: 'admin_home' }">
              <a-menu-item key="1">
                <template #icon>
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path
                      d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
                    ></path>
                  </svg>
                </template>
                <span>Dashboard</span>
              </a-menu-item>
            </RouterLink>

            <RouterLink :to="{ name: 'admin_home' }">
              <a-menu-item key="2">
                <template #icon>
                  <svg
                    aria-hidden="true"
                    class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
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
                </template>
                <span>Utilisateurs</span>
              </a-menu-item>
            </RouterLink>

            <a-sub-menu key="sub1">
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  <path fill="none" d="M0 0h24v24H0Z"></path>
                  <path
                    fill="#6A7280"
                    d="M19 12h3L12 3 2 12h3v8h2v-2h10v2h2v-8ZM7.21 10h9.58l.21.19V12H7v-1.81l.21-.19Zm7.36-2H9.43L12 5.69 14.57 8ZM7 16v-2h10v2H7Z"
                  ></path>
                </svg>
              </template>
              <template #title>Appartement</template>
              <RouterLink :to="{ name: 'admin_real_estate_ads_all' }">
                <a-menu-item key="3">Tout les appartements</a-menu-item>
              </RouterLink>
              <RouterLink :to="{ name: 'admin_real_estate_ads_waiting' }">
                <a-menu-item key="4">En attente de validation</a-menu-item>
              </RouterLink>
            </a-sub-menu>

            <a-menu-item key="5" @click="$emit('logout')">
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  <path fill="none" d="M0 0h24v24H0Z"></path>
                  <path
                    fill="#6A7280"
                    d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5ZM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5Z"
                  ></path>
                </svg>
              </template>
              <span>Déconnexion</span>
            </a-menu-item>
          </a-menu>
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
