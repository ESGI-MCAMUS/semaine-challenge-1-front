<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/navbar/Navbar.vue";
</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <RouterView />
  </main>

  <p></p>
</template>

<style scoped>
main {
  padding: 1rem;
}
</style>
