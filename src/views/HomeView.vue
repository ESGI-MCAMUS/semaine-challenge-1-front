<script>
import axios from "axios";
import { defineComponent, reactive } from "vue";
import Footer from "../components/Footer.vue";
import router from "../router";
import { formatPrice } from "../utils/ads.utils";
import { token } from "../utils/localStorage";
import { client } from "../services";
import { notification } from "ant-design-vue";
import { refetchFavorites, isFavorite } from "../utils/favorites";
import { favorites } from "../utils/localStorage";

export default defineComponent({
  setup() {
    const state = reactive({
      ads: [],
      page: 1,
      totalPages: 0,
      totalItems: 0,
      itemPerPage: 0,
    });

    const getAds = () => {
      client
        .get(`/real_estate_ads?page=${state.page}`)
        .then((res) => {
          const data = res.data;
          state.totalItems = data["hydra:totalItems"];
          state.ads = data["hydra:member"];
          state.itemPerPage = state.ads.length;
          state.totalPages = Number(data["hydra:view"]["hydra:last"].slice(-1));
          refetchFavorites();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const addFavortiteAd = (adId) => {
      client
        .post(`/favorite_ads`, {
          realEstateAd: adId,
          fkUser: `/users/${token.value.id}`,
        })
        .then((res) => {
          notification["success"]({
            message: "Favoris ajouté",
            description: "Cette annonce a bien été ajoutée à vos favoris !",
          });
          refetchFavorites();
        })
        .catch((err) => {
          console.log(err);
          notification["error"]({
            message: "Oups !",
            description: "Une erreur est survenue lors de l'ajout du favoris !",
          });
        });
    };

    const removeFavoriteAd = (adId) => {
      const favoriteId = favorites.value.find(
        (favorite) => favorite.realEstateAd === adId
      ).id;
      client
        .delete(`/favorite_ads/${favoriteId}`)
        .then((res) => {
          notification["success"]({
            message: "Favoris supprimé",
            description: "Cette annonce a bien été supprimée de vos favoris !",
          });
          refetchFavorites();
        })
        .catch((err) => {
          console.log(err);
          notification["error"]({
            message: "Oups !",
            description:
              "Une erreur est survenue lors de la suppression du favoris !",
          });
        });
    };

    const navigate = (id) => {
      router.push(`${id}`);
    };

    getAds();

    return {
      state,
      getAds,
      navigate,
      formatPrice,
      token,
      addFavortiteAd,
      removeFavoriteAd,
      isFavorite,
    };
  },
});
</script>

<template>
  <main>
    <div class="adsContainer">
      <div class="adsBox" v-for="ad in state.ads" :key="ad.id">
        <a-card hoverable style="width: 100%">
          <template #cover>
            <img
              alt="example"
              :src="ad.photos[0]"
              style="width: 100%; height: 300px; object-fit: cover"
            />
          </template>
          <template #actions>
            <a-button type="primary" @click="this.navigate(ad['@id'])"
              >Voir l'annonce</a-button
            >
            <a-button
              v-if="token.id && !this.isFavorite(ad['@id'])"
              type="danger"
              @click="this.addFavortiteAd(ad['@id'])"
              >Ajouter aux favoris</a-button
            >
            <a-button
              v-if="token.id && this.isFavorite(ad['@id'])"
              type="danger"
              @click="this.removeFavoriteAd(ad['@id'])"
              >Retirer des favoris</a-button
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
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      "
    >
      <div class="fixed bottom-0 pb-3">
        <a-pagination
          v-model:current="state.page"
          :total="state.totalItems"
          :show-less-items="false"
          :show-size-changer="false"
          @change="
            (page, pageSize) => {
              state.page = page;
              getAds();
            }
          "
        />
      </div>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
.adsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  margin-left: 5%;
  max-height: calc(100vh - 150px);
  overflow-y: scroll;
}

.adsBox {
  flex-basis: 33.33%;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: "red";
}
</style>
