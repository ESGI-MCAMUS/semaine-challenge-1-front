<script>
import { defineComponent, reactive } from "vue";
import router from "../router";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
import { formatPrice } from "../utils/ads.utils";
import { client } from "../services";
import { token } from "../utils/localStorage";
import { notification } from "ant-design-vue";
import { refetchFavorites, isFavorite } from "../utils/favorites";
import { favorites } from "../utils/localStorage";

export default defineComponent({
  components: {
    LeftCircleOutlined,
    RightCircleOutlined,
  },
  setup() {
    const state = reactive({
      ad: {},
      housing: {},
      housingProperties: {},
      mapsUrl: "",
    });

    const id = router.currentRoute.value.params.id;
    client
      .get(`/real_estate_ads/${id}`)
      .then((resAd) => {
        if (resAd.status === 200) {
          const dataAd = resAd.data;
          state.ad = dataAd;

          client
            .get(`${dataAd.housing}`)
            .then((resHousing) => {
              if (resHousing.status === 200) {
                const dataHousing = resHousing.data;
                state.housing = dataHousing;

                client
                  .get(`${dataHousing.properties}`)
                  .then((resHousingProperties) => {
                    if (resHousingProperties.status === 200) {
                      const dataHousingProperties = resHousingProperties.data;
                      state.housingProperties = dataHousingProperties;
                      state.mapsUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.VUE_APP_API_GOOGLE_MAP_KEY}&q=${state.housing.lat},${state.housing.lng}`;
                      console.log(import.meta.env);
                      refetchFavorites();
                    }
                  })
                  .catch((err) => {
                    router.push("/");
                  });
              }
            })
            .catch((err) => {
              router.push("/");
            });
        }
      })
      .catch((err) => {
        router.push("/");
      });

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

    return {
      state,
      formatPrice,
      addFavortiteAd,
      removeFavoriteAd,
      isFavorite,
      token,
    };
  },
});
</script>
<template>
  <!-- add antd col -->
  <a-col :span="12" :offset="6">
    <a-card>
      <template #actions>
        <a-button
          v-if="token && !this.isFavorite(state.ad['@id'])"
          type="danger"
          @click="this.addFavortiteAd(state.ad['@id'])"
          >Ajouter aux favoris</a-button
        >
        <a-button
          v-if="token.id && this.isFavorite(state.ad['@id'])"
          type="danger"
          @click="this.removeFavoriteAd(state.ad['@id'])"
          >Retirer des favoris</a-button
        >
      </template>
      <a-carousel arrows autoplay>
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px">
            <right-circle-outlined />
          </div>
        </template>
        <div v-for="photo in state.ad.photos">
          <img alt="example" :src="photo" class="images" />
        </div>
      </a-carousel>
      <br />
      <a-typography-title :level="2">{{ state.ad.title }}</a-typography-title>
      <a-typography-text>{{ state.ad.description }}</a-typography-text>
      <br />
      <br />
      <a-typography-title :level="3">{{
        `Prix: ${this.formatPrice(state.ad.price)} ${
          state.ad.type === "sale" ? "€" : "€/mois"
        }`
      }}</a-typography-title>
      <div>
        <iframe
          title="maps"
          width="600"
          height="450"
          style="border: 0"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          :src="state.mapsUrl"
        >
        </iframe>
      </div>
      <br />
      <br />
      <a-typography-title :level="4"
        >Caracteristiques du bien</a-typography-title
      >
      <a-list
        item-layout="horizontal"
        :data-source="[
          {
            description: 'Type de bien',
            title:
              state.housingProperties.type === 'house'
                ? 'Maison'
                : 'Appartement',
            image:
              state.housingProperties.type === 'house'
                ? 'https://img.icons8.com/fluency/512/home.png'
                : 'https://img.icons8.com/fluency/512/link-company-child.png',
          },
          {
            description: 'Classification du logement',
            title:
              state.housingProperties.classification === 'excellent'
                ? 'Excellent'
                : state.housingProperties.classification === 'good'
                ? 'Bon'
                : state.housingProperties.classification === 'average'
                ? 'Moyen'
                : state.housingProperties.classification === 'bad'
                ? 'Mauvais'
                : 'Insalubre',
            image: 'https://img.icons8.com/fluency/512/housekeeping.png',
          },
          {
            description: 'Surface habitable',
            title: `${state.housingProperties.surface} m²`,
            image: 'https://img.icons8.com/fluency/512/room.png',
          },
          {
            description: 'Nombre de pièces',
            title: `${state.housingProperties.rooms} pièces`,
            image: 'https://img.icons8.com/fluency/512/four-beds.png',
          },
          {
            description: 'Le bien possède-t-il un jardin ?',
            title: state.housingProperties.hasGarden ? 'Oui' : 'Non',
            image: 'https://img.icons8.com/fluency/512/house-with-a-garden.png',
          },
          {
            description: 'Le bien possède-t-il un parking ?',
            title: state.housingProperties.hasParking ? 'Oui' : 'Non',
            image:
              'https://img.icons8.com/fluency/512/garage-door-part-open.png',
          },
          {
            description: 'Le bien possède-t-il une piscine ?',
            title: state.housingProperties.hasPool ? 'Oui' : 'Non',
            image: 'https://img.icons8.com/fluency/2x/kids-pool.png',
          },
          {
            description: 'Le bien possède-t-il une grotte ?',
            title: state.housingProperties.hasCave ? 'Oui' : 'Non',
            image: 'https://img.icons8.com/fluency/512/cave.png',
          },
          {
            description: 'Le bien possède-t-il un grenier ?',
            title: state.housingProperties.hasAttic ? 'Oui' : 'Non',
            image: 'https://img.icons8.com/fluency/512/roofing.png',
          },
          {
            description: 'Le bien possède-t-il une terrasse/balcon ?',
            title: state.housingProperties.hasBalcony ? 'Oui' : 'Non',
            image: 'https://img.icons8.com/fluency/512/balcony.png',
          },
          {
            description: 'Y-a-t-il des transporter en commun à proximité ?',
            title: state.housingProperties.nearPublicTransport ? 'Oui' : 'Non',
            image: 'https://img.icons8.com/fluency/512/railway-station.png',
          },
        ]"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :description="item.description">
              <template #title>
                <p></p>
                <div>
                  {{ item.title }}
                </div>
              </template>
              <template #avatar>
                <a-avatar :src="item.image" />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </a-col>
</template>

<style scoped>
.images {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
}
</style>

<script setup>
console.log(import.meta.env);
</script>
