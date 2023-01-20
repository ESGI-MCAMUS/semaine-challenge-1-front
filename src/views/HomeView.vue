<script>
import { HeartFilled, HeartOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { defineComponent, reactive } from "vue";
import Footer from "../components/Footer.vue";
import router from "../router";
import { client } from "../services";
import { formatPrice } from "../utils/ads.utils";
import { isFavorite, refetchFavorites } from "../utils/favorites";
import { buildQueryString } from "../utils/filters.utils";
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
      filtersEnabled: false,
      checkedList: [],
      typeOptions: "all",
      classification: "all",
      filteredProperties: [],
      searchText: "",
    });

    const getAds = () => {
      client
        .get(
          `/real_estate_ads${
            state.filtersEnabled
              ? `?pagination=false${
                  state.searchText !== "" ? `&title=${state.searchText}` : ""
                }`
              : `?page=${state.page}${
                  state.searchText !== "" ? `&title=${state.searchText}` : ""
                }`
          }`
        )
        .then((res) => {
          const data = res.data;
          state.totalItems = data["hydra:totalItems"];
          state.ads = data["hydra:member"];
          state.itemPerPage = state.ads.length;
          state.totalPages = !state.filtersEnabled
            ? Number(data["hydra:view"]["hydra:last"].slice(-1))
            : -1;
          refetchFavorites();
          if (state.filtersEnabled) {
            let filteredAds = state.ads.map((ad) => {
              const isPresent = state.filteredProperties.some((fp) => {
                return `/housings/${fp}` == ad.housing;
              });
              return isPresent ? ad : undefined;
            });
            state.ads = filteredAds.filter((ad) => ad !== undefined);
          }
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

    /**
     * ADVANCED SEARCH
     */
    const plainOptions = [
      "Parking",
      "Jardin",
      "Piscine",
      "Grotte",
      "Grenier",
      "Balcon",
      "Transport en commun",
    ];

    const handleChangeSelectType = (value) => {
      state.typeOptions = value;
      onChangedValues();
    };

    const handleChangeSelectClassification = (value) => {
      state.classification = value;
      onChangedValues();
    };

    const onChangedValues = () => {
      const options = {
        hasParking: state.checkedList.includes("Parking") ? true : undefined,
        hasGarden: state.checkedList.includes("Jardin") ? true : undefined,
        hasPool: state.checkedList.includes("Piscine") ? true : undefined,
        hasCave: state.checkedList.includes("Grotte") ? true : undefined,
        hasAttic: state.checkedList.includes("Grenier") ? true : undefined,
        hasBalcony: state.checkedList.includes("Balcon") ? true : undefined,
        nearPublicTransport: state.checkedList.includes("Transport en commun")
          ? true
          : undefined,
        type: state.typeOptions !== "all" ? state.typeOptions : undefined,
        classification:
          state.classification !== "all" ? state.classification : undefined,
      };

      const query = buildQueryString(options);

      client
        .get(
          `/housing_properties?pagination=false${
            state.filtersEnabled ? query : ""
          }`
        )
        .then((res) => {
          state.filteredProperties = res.data["hydra:member"].map(
            (item) => item.id
          );
          getAds();
          if (state.filtersEnabled) {
            state.totalItems = state.filteredProperties.length;
          }
        })
        .catch((err) => {
          console.log(err);
          notification["error"]({
            message: "Oups !",
            description:
              "Une erreur est survenue lors de l'application des filtres !",
          });
        });
    };

    return {
      state,
      getAds,
      navigate,
      formatPrice,
      token,
      addFavortiteAd,
      removeFavoriteAd,
      isFavorite,
      plainOptions,
      onChangedValues,
      handleChangeSelectType,
      handleChangeSelectClassification,
    };
  },
});
</script>

<template>
  <main>
    <a-row>
      <a-col :span="6"
        ><a-input-search
          v-model:value="state.searchText"
          placeholder="Chercher une annonce..."
          @search="this.getAds()"
          @change="this.updateSearchText()"
      /></a-col>
      <a-col
        :span="18"
        style="display: flex; justify-content: flex-start; align-items: center"
      >
        <a-typography-text
          >Filtres
          <b>{{ state.filtersEnabled ? "ON" : "OFF" }}</b></a-typography-text
        >
        <a-switch
          v-model:checked="state.filtersEnabled"
          @change="this.onChangedValues"
        />
        <a-checkbox-group
          v-model:value="state.checkedList"
          :options="plainOptions"
          @change="this.onChangedValues"
        />
        <a-space>
          <a-select
            ref="select"
            style="width: 120px"
            @change="this.handleChangeSelectType"
            :value="state.typeOptions"
          >
            <a-select-option value="all">Tous</a-select-option>
            <a-select-option value="apartment">Appartements</a-select-option>
            <a-select-option value="house">Maisons</a-select-option>
          </a-select>
        </a-space>
        <a-space>
          <a-select
            ref="select"
            style="width: 120px"
            @change="this.handleChangeSelectClassification"
            :value="state.classification"
          >
            <a-select-option value="all">Tous</a-select-option>
            <a-select-option value="excellent">Excellent</a-select-option>
            <a-select-option value="good">Bon</a-select-option>
            <a-select-option value="average">Moyen</a-select-option>
            <a-select-option value="bad">Mauvais</a-select-option>
            <a-select-option value="insalubrious">Insalubre</a-select-option>
          </a-select>
        </a-space>
      </a-col>
    </a-row>
    <div class="adsContainer">
      <div class="adsBox" v-for="ad in state.ads" :key="ad.id">
        <a-card style="width: 400px" bodyStyle="padding: 20px">
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
              v-if="token?.id && !this.isFavorite(ad['@id'])"
              danger
              @click="this.addFavortiteAd(ad['@id'])"
            >
              <template #icon><HeartOutlined /></template>
            </a-button>

            <a-button
              shape="circle"
              v-if="token?.id && this.isFavorite(ad['@id'])"
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
      <div class="fixed bottom-0 pb-3" v-if="!state.filtersEnabled">
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
  max-height: calc(100vh - 180px);
  overflow-y: scroll;
}

.adsBox {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
