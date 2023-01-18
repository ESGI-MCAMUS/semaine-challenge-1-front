<script setup>
import { API_URL } from "../environements";
import { useGlobalStore } from "../stores/globalStore";
const store = useGlobalStore();

store.updateName("Tartipouette");

const onUpdateName = () => {
  store.updateName("OLEL");
};

const getuser = async () => {
  console.log("test requete :");
  const res = await fetch(`${API_URL}/users/3`, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzQwNDcyNTMsImV4cCI6MTY3NDA1MDg1Mywicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGV4YW1wbGUuY29tIn0.RCX71yeNsi5xj0t1r-2k8aDv-958RyujbGMxeEgNgiCTEfpyUOOd5yEjofqxuL8hgrXibXEzxU07yfcw7sG4GhVI5CcKf7lN0YkdvqxBrWCKXR2zrK74sm2aqs4T7Uz4KoPP-k18bR6xKtKwWVNQulXlOL-pyqKSc8-KCVmYNbAJ8eBocN8iIytaXMfoLtlkqnEIbpogJNkwUokc6pa-8enzGrCzt92BlUI_PPGi-MCdiMTzuxsSJVpUdScYMc8SpT3v8ISfT20pL7LdWSr8Ep7tRYHz8bp8bxNf5H_b2qmbyh4WKDuJWIiu0HRI56Ls7D5oIHcVjuZJFOZuR90hLD_KK4TYn3jwkv9lNqfJjmwfPKOh_gd4midDr7nLm5iKciDKFn90dyjGHSrb0zhmAmZpOIBunQK9qPRdjQOkYxf1R-thVOJLNztwmJNjBVLplGty32GAa-_FIeW05zzcP4z3IVA-13URfIYtN7FwnWMmvWtF6pmVRjoJTJoH9ImDGwhX684Y9tnzZo5f-maTZnvHHCqCr_y6KeOJdZeeteV21iiJobmVFDKB2OZH-EqiddL5Vwbqyw8tOZnoFwvQLxOSzN4I901OqP11qSyzyyNSj0M0KgsmA7gUQOfFa3l5oczHv8Jr9FFDaZ2TLLq2njB3uiogBveq3j7DwtIqJbg",
    },
  }).then((res) => res.json().then((data) => console.log(data)));
};
</script>
s
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
          src="/docs/images/people/profile-picture-3.jpg"
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
      <button
        @click="getuser"
        href="#"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Get user
      </button>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
}
</style>
