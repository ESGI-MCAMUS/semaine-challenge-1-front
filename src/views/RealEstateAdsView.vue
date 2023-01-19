<template>
  <!-- add antd col -->
  <a-col :span="12" :offset="6">
    <a-card>
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
        `Prix: ${state.ad.price} ${state.ad.type === "sale" ? "€" : "€/mois"}`
      }}</a-typography-title
      ><br />
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
                <p>
                  <b>{{ item.title }}</b>
                </p>
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

<script>
import axios from "axios";
import { defineComponent, reactive } from "vue";
import router from "../router";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";

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
    });

    const id = router.currentRoute.value.params.id;

    axios
      .get(`/real_estate_ads/${id}`)
      .then((resAd) => {
        if (resAd.status === 200) {
          const dataAd = resAd.data;
          state.ad = dataAd;

          axios
            .get(`${dataAd.housing}`)
            .then((resHousing) => {
              if (resHousing.status === 200) {
                const dataHousing = resHousing.data;
                state.housing = dataHousing;

                axios
                  .get(`${dataHousing.properties}`)
                  .then((resHousingProperties) => {
                    if (resHousingProperties.status === 200) {
                      const dataHousingProperties = resHousingProperties.data;
                      state.housingProperties = dataHousingProperties;
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
        console.log({
          ad: state.ad,
          housing: state.housing,
          housingProperties: state.housingProperties,
        });
      })
      .catch((err) => {
        router.push("/");
      });

    return {
      state,
    };
  },
});
</script>