<script>
import axios from "axios";
import { defineComponent, reactive } from "vue";
import Footer from "../components/Footer.vue";
import router from "../router";

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
      axios
        .get(`/real_estate_ads?page=${state.page}`)
        .then((res) => {
          const data = res.data;
          console.log(data);
          state.totalItems = data["hydra:totalItems"];
          state.ads = data["hydra:member"];
          state.itemPerPage = state.ads.length;
          state.totalPages = Number(data["hydra:view"]["hydra:last"].slice(-1));

          console.log({
            page: state.page,
            ads: state.ads,
            totalItems: state.totalItems,
            totalPages: state.totalPages,
            itemPerPage: state.itemPerPage,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const navigateToAd = (id) => {
      router.push(`${id}`);
    };

    getAds();

    return {
      state,
      getAds,
      navigateToAd,
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
            <a-button type="primary" @click="this.navigateToAd(ad['@id'])"
              >Voir l'annonce</a-button
            >
          </template>
          <a-card-meta
            :title="ad.title"
            :description="ad.description.slice(0, 200) + '...'"
          >
          </a-card-meta>
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
