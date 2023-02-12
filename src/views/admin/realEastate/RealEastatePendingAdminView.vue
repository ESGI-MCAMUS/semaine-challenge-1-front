<script setup>
import { reactive } from "vue";
import router from "../../../router";
import { client } from "../../../services";
import { formatPrice } from "../../../utils/ads.utils";

const state = reactive({
  apartments: [],
  estate: [],
  page: 1,
  totalPages: 0,
  totalItems: 0,
  itemPerPage: 0,
});

const getRealEastateAds = async () => {
  client
    .get(`/real_estate_ads?pagination=false`)
    .then((res) => {
      const data = res.data;
      // filter out the ads that are not validated
      state.apartments = data["hydra:member"].filter(
        (ad) => ad.isVisible === false
      );
    })
    .catch((err) => {});
};

const navigate = (id) => {
  router.push(`${id}`);
};

getRealEastateAds();
</script>

<template>
  <div class="p-4 sm:ml-64">
    <div class="adsContainer">
      <div class="adsBox" v-for="ad in state.apartments" :key="ad.id">
        <a-card style="width: 400px" bodyStyle="padding: 20px">
          <template #cover>
            <img
              alt="example"
              :src="ad.photos[0]"
              style="width: 100%; height: 300px; object-fit: cover"
            />
          </template>

          <template #actions>
            <a-button type="default" @click="navigate(ad['@id'])"
              >Voir l'annonce</a-button
            >
          </template>

          <a-card-meta
            :title="ad.title"
            :description="ad.description.slice(0, 200) + '...'"
          >
          </a-card-meta>
          <br />
          <a-typography-text>{{
            `Prix: ${formatPrice(ad.price)} ${
              ad.type === "sale" ? "€" : "€/mois"
            }`
          }}</a-typography-text>
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}

.adsBox {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
}
</style>
