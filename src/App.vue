<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { API_URL } from "./environements/index";
</script>

<template>
  <header>
    <Navbar />
  </header>

  <RouterView />
  <p>
    Current API URL: <a href="#">{{ API_URL }}</a>
  </p>
</template>
