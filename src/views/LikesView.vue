<script setup>
import { reactive } from "vue";
import { client } from "../services";

const state = reactive({
  likes: [],
  page: 1,
  totalPages: 0,
  totalItems: 0,
  itemPerPage: 0,
});

const getLikes = async () => {
  client
    .get(`/favorite_ads?page=${state.page}`)
    .then((res) => {
      const data = res.data;
      state.totalItems = data["hydra:totalItems"];
      state.likes = data["hydra:member"];
      state.itemPerPage = state.likes.length;
      //   state.totalPages = Number(data["hydra:view"]["hydra:last"].slice(-1));
      //   console.table({
      //     data,
      //     totalItems: state.totalItems,
      //     likes: state.likes,
      //     itemPerPage: state.itemPerPage,
      //     // totalPages: state.totalPages,
      //   });

      console.log("state.likes", state.likes);
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
      <div v-for="like in state.likes" :key="like.id">
        <p>{{ like.id }}</p>
        <p>{{ like.realEstateAd }}</p>
        <p>{{ like.fkUser }}</p>
      </div>
    </div>
  </main>
</template>
