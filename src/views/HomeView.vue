<script>
import { HeartFilled, HeartOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import Footer from "../components/Footer.vue";
import router from "../router";
import { client } from "../services";
import { formatPrice } from "../utils/ads.utils";
import { isFavorite, refetchFavorites } from "../utils/favorites";
import { favorites, token } from "../utils/localStorage";

export default defineComponent({
  components: {
    HeartOutlined,
    HeartFilled,
  },
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
        <a-card hoverable style="width: 400px" bodyStyle="padding: 20px">
          <template #cover>
            <img
              alt="example"
              :src="ad.photos[0]"
              style="width: 100%; height: 300px; object-fit: cover"
            />
          </template>
          <template #actions>
            <a-button type="default" @click="this.navigate(ad['@id'])"
              >Voir l'annonce</a-button
            >
            <a-button
              shape="circle"
              v-if="token.id && !this.isFavorite(ad['@id'])"
              danger
              @click="this.addFavortiteAd(ad['@id'])"
            >
              <template #icon><HeartOutlined /></template>
            </a-button>

            <a-button
              shape="circle"
              v-if="token.id && this.isFavorite(ad['@id'])"
              danger
              @click="this.removeFavoriteAd(ad['@id'])"
            >
              <template #icon><HeartFilled /></template>
            </a-button>
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

.ant-card-meta-description {
  height: 100px;
  overflow: hidden;
}
</style>
