<script setup>
import { HeartFilled, HeartOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { reactive, ref } from "vue";
import router from "../router";
import { client } from "../services";
import { formatPrice } from "../utils/ads.utils";
import { isFavorite, refetchFavorites } from "../utils/favorites";
import { favorites, token } from "../utils/localStorage";

const state = reactive({
  likes: [],
  estate: [],
  page: 1,
  totalPages: 0,
  totalItems: 0,
  itemPerPage: 0,
});

const isFavoritToShow = ref(state.estate.length > 0 ? true : false);

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
    .catch((err) => {});
};

const getEstate = async (route) => {
  client
    .get(`${route}`)
    .then((res) => {
      const data = res.data;
      state.estate.push(data);
      isFavoritToShow.value = true;
    })

    .catch((err) => {});
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
      const id = parseInt(adId.slice(17));
      state.estate = state.estate.filter((estate) => estate.id !== id);
    })
    .catch((err) => {
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

const isFavorites = (id) => {
  return isFavorite(id);
};

getLikes();
</script>

<template>
  <main>
    <h1 class="text-4xl">Mes favories</h1>
    <div class="adsContainer" v-if="isFavoritToShow">
      <div class="adsBox" v-for="estate in state.estate" :key="estate.id">
        <a-card style="width: 400px" bodyStyle="padding: 20px">
          <template #cover>
            <img
              alt="example"
              :src="estate.photos[0]"
              style="width: 100%; height: 300px; object-fit: cover"
            />
          </template>

          <template #actions>
            <a-button type="default" @click="navigate(estate['@id'])"
              >Voir l'annonce</a-button
            >

            <a-button
              shape="circle"
              v-if="token?.id && !isFavorites(estate['@id'])"
              danger
              @click="addFavortiteAd(estate['@id'])"
            >
              <template #icon><HeartOutlined /></template>
            </a-button>

            <a-button
              shape="circle"
              v-if="token?.id && isFavorites(estate['@id'])"
              danger
              @click="removeFavoriteAd(estate['@id'])"
            >
              <template #icon><HeartFilled /></template>
            </a-button>
          </template>

          <a-card-meta
            :title="estate.title"
            :description="estate.description.slice(0, 200) + '...'"
          >
          </a-card-meta>
          <br />
          <a-typography-text>{{
            `Prix: ${formatPrice(estate.price)} ${
              estate.type === "sale" ? "€" : "€/mois"
            }`
          }}</a-typography-text>
        </a-card>
      </div>
    </div>
    <div v-else>
      <h2>Pas de favories pour le moment</h2>
    </div>

    <div></div>
  </main>
</template>

<style scoped>
.adsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-height: calc(100vh - 150px);
  overflow-y: scroll;
}

.adsBox {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

h1,
h2 {
  text-align: center;
  padding-bottom: 20px;
}
</style>
