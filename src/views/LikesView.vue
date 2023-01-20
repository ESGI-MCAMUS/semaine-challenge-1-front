<script setup>
import { client } from "../services";

const getLikes = async () => {
  try {
    const res = await client.get("/favorite_ads");
    return res.data;
  } catch (error) {
    console.error("error", error);
  }
};
</script>

<template>
  <main>
    <h1>My Favorites</h1>

    <div>
      <div v-for="like in likes" :key="like.id">
        <div>
          <img :src="like.image" alt="ad image" />
        </div>
        <div>
          <h2>{{ like.title }}</h2>
          <p>{{ like.description }}</p>
          <p>{{ like.price }} €</p>
          <button @click="removeFavoriteAd(like.id)">
            Remove from favorites
          </button>
        </div>
      </div>
    </div>

    <!-- <div class="ads">
      <div class="ad" v-for="ad in ads" :key="ad.id">
        <div class="ad__image">
          <img :src="ad.image" alt="ad image" />
        </div>
        <div class="ad__content">
          <h2>{{ ad.title }}</h2>
          <p>{{ ad.description }}</p>
          <p>{{ ad.price }} €</p>
          <button @click="removeFavoriteAd(ad.id)">
            Remove from favorites
          </button>
        </div>
      </div>
    </div> -->
  </main>
</template>
