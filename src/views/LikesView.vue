<script setup>
import { reactive } from "vue";
import { client } from "../services";

const state = reactive({
  likes: [],
  estate: [],
  page: 1,
  totalPages: 0,
  totalItems: 0,
  itemPerPage: 0,
});

console.log(state.estate);

const getLikes = async () => {
  client
    .get(`/favorite_ads?page=${state.page}`)
    .then((res) => {
      const data = res.data;
      state.totalItems = data["hydra:totalItems"];
      state.likes = data["hydra:member"];
      state.itemPerPage = state.likes.length;

      for (const like of state.likes) {
        getEstate(like.realEstateAd);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEstate = async (route) => {
  client
    .get(`${route}`)
    .then((res) => {
      const data = res.data;
      state.estate.push(data);
    })

    .catch((err) => {
      console.log(err);
    });
};

getLikes();
</script>

<template>
  <main>
    <h1>My Favorites</h1>

    <div>
      <!-- <div v-for="like in state.likes" :key="like.id">
        <p>{{ like.id }}</p>
        <p>{{ like.realEstateAd }}</p>
        <p>{{ like.fkUser }}</p>
      </div> -->

      <div v-for="estate in state.estate" :key="estate.id">
        <p>{{ estate.id }}</p>
        <p>{{ estate.title }}</p>
        <p>{{ estate.description }}</p>
      </div>
    </div>

    <div></div>
  </main>
</template>
