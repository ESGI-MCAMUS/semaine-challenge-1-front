<script setup>
import { RouterView } from "vue-router";
import Footer from "./components/Footer.vue";
import Navbar from "./components/navbar/Navbar.vue";
import { API_URL } from "./environements/index";
</script>

<template>
  <header>
    <Navbar />
    Current API URL: <a href="#">{{ API_URL }}</a>
  </header>
  <main>
    <RouterView />
  </main>

  <Footer />

  <p></p>
</template>

<style scoped>
main {
  padding: 1rem;
  height: calc(100vh - 52px);
}
</style>
