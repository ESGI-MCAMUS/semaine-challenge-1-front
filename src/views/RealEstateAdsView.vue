<script setup>
import {
  CheckCircleOutlined,
  DeleteOutlined,
  HeartFilled,
  HeartOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { reactive, ref } from "vue";
import router from "../router";
import { client } from "../services";
import { formatPrice } from "../utils/ads.utils";
import { isFavorite, refetchFavorites } from "../utils/favorites";
import { favorites, token } from "../utils/localStorage";

const state = reactive({
  ad: {},
  housing: {},
  housingProperties: {},
  mapsUrl: "",
});

let isAdmin = ref(false);
let isConnected = ref(false);

if (token.value !== undefined) {
  token.value.role?.includes("ROLE_ADMIN")
    ? (isAdmin.value = true)
    : (isAdmin.value = false);

  token.value.role?.includes("ROLE_USER")
    ? (isConnected.value = true)
    : (isConnected.value = false);
}

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
                  state.mapsUrl = `https://www.google.com/maps/embed/v1/place?key=${
                    import.meta.env.VITE_API_GOOGLE_MAPS_KEY
                  }&q=${state.housing.address} ${state.housing.address2}, ${
                    state.housing.zipcode
                  } ${state.housing.city}`;
                  if (isConnected.value) {
                    refetchFavorites();
                  }
                }
              })
              .catch((err) => {
                // router.push("/");
              });
          }
        })
        .catch((err) => {
          // router.push("/");
        });
    }
  })
  .catch((err) => {
    // router.push("/");
  });

const addFavortiteAd = (adId) => {
  client
    .post(`/favorite_ads`, {
      realEstateAd: adId,
      fkUser: `/users/${token.value.id}`,
    })
    .then((res) => {
      notification["success"]({
        message: "Favoris ajout??",
        description: "Cette annonce a bien ??t?? ajout??e ?? vos favoris !",
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
        message: "Favoris supprim??",
        description: "Cette annonce a bien ??t?? supprim??e de vos favoris !",
      });
      refetchFavorites();
    })
    .catch((err) => {
      notification["error"]({
        message: "Oups !",
        description:
          "Une erreur est survenue lors de la suppression du favoris !",
      });
    });
};

const validateAd = (adId) => {
  client
    .put(`${adId}`, {
      isVisible: true,
    })
    .then((res) => {
      router.push("/admin/apartment/waiting");
      notification["success"]({
        message: "Annonce valid??e",
        description: "Cette annonce a bien ??t?? valid??e !",
      });
    })
    .catch((err) => {
      notification["error"]({
        message: "Oups !",
        description: "Une erreur est survenue lors de la validation !",
      });
    });
};

const deleteAd = (adId) => {
  client
    .delete(`${adId}`)
    .then((res) => {
      router.push("/admin/apartment/waiting");
      notification["success"]({
        message: "Annonce supprim??e",
        description: "Cette annonce a bien ??t?? supprim??e !",
      });
    })
    .catch((err) => {
      notification["error"]({
        message: "Oups !",
        description: "Une erreur est survenue lors de la suppression !",
      });
    });
};

const formState = reactive({
  appointmentDate: "",
});

const createAppointment = async () => {
  try {
    const res = await client.post(`/appointments`, {
      date: new Date(formState.appointmentDate),
      housing: state.housing["@id"],
      visitor: `/users/${token.value.id}`,
      status: "pending",
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

const onFinish = () => {
  createAppointment()
    .then((res) => {
      if (res.status === 201) {
        notification["success"]({
          message: "Demande de RDV envoy??",
          description:
            "Votre rendez-vous a bien ??t?? cr???? ! En attente de validation de la part du propri??taire",
        });
      }
    })
    .catch((err) => {
      notification["error"]({
        message: "Oups !",
        description:
          "Une erreur est survenue lors de la cr??ation du rendez-vous !",
      });
    });
};
</script>

<template>
  <div class="flex">
    <a-col :span="12" :offset="4">
      <a-card>
        <template #actions>
          <div v-if="isAdmin">
            <a-button
              shape="circle"
              v-if="token.id && !state.ad.isVisible"
              danger
              @click="validateAd(state.ad['@id'])"
            >
              <template #icon><CheckCircleOutlined /></template>
            </a-button>

            <a-button
              shape="circle"
              v-if="token.id"
              danger
              @click="deleteAd(state.ad['@id'])"
            >
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </div>

          <div v-else>
            <a-button
              shape="circle"
              v-if="token.id && !isFavorite(state.ad['@id'])"
              danger
              @click="addFavortiteAd(state.ad['@id'])"
            >
              <template #icon><HeartOutlined /></template>
            </a-button>

            <a-button
              shape="circle"
              v-if="token.id && isFavorite(state.ad['@id'])"
              danger
              @click="removeFavoriteAd(state.ad['@id'])"
            >
              <template #icon><HeartFilled /></template>
            </a-button>
          </div>
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
          `Prix: ${formatPrice(state.ad.price)} ${
            state.ad.type === "sale" ? "???" : "???/mois"
          }`
        }}</a-typography-title>
        <div>
          <iframe
            title="maps"
            width="100%"
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
              title: `${state.housingProperties.surface} m??`,
              image: 'https://img.icons8.com/fluency/512/room.png',
            },
            {
              description: 'Nombre de pi??ces',
              title: `${state.housingProperties.rooms} pi??ces`,
              image: 'https://img.icons8.com/fluency/512/four-beds.png',
            },
            {
              description: 'Le bien poss??de-t-il un jardin ?',
              title: state.housingProperties.hasGarden ? 'Oui' : 'Non',
              image:
                'https://img.icons8.com/fluency/512/house-with-a-garden.png',
            },
            {
              description: 'Le bien poss??de-t-il un parking ?',
              title: state.housingProperties.hasParking ? 'Oui' : 'Non',
              image:
                'https://img.icons8.com/fluency/512/garage-door-part-open.png',
            },
            {
              description: 'Le bien poss??de-t-il une piscine ?',
              title: state.housingProperties.hasPool ? 'Oui' : 'Non',
              image: 'https://img.icons8.com/fluency/2x/kids-pool.png',
            },
            {
              description: 'Le bien poss??de-t-il une grotte ?',
              title: state.housingProperties.hasCave ? 'Oui' : 'Non',
              image: 'https://img.icons8.com/fluency/512/cave.png',
            },
            {
              description: 'Le bien poss??de-t-il un grenier ?',
              title: state.housingProperties.hasAttic ? 'Oui' : 'Non',
              image: 'https://img.icons8.com/fluency/512/roofing.png',
            },
            {
              description: 'Le bien poss??de-t-il une terrasse/balcon ?',
              title: state.housingProperties.hasBalcony ? 'Oui' : 'Non',
              image: 'https://img.icons8.com/fluency/512/balcony.png',
            },
            {
              description: 'Y-a-t-il des transporter en commun ?? proximit?? ?',
              title: state.housingProperties.nearPublicTransport
                ? 'Oui'
                : 'Non',
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

    <a-col class="ml-4" :span="6">
      <a-card>
        <a-typography-title :level="3">Prise de rendez-vous</a-typography-title>

        <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          ref="formRef"
          :rules="rules"
        >
          <a-form-item label="Date du RDV" name="appointmentDate">
            <a-date-picker
              v-model:value="formState.appointmentDate"
              label="JJ/MM/YYYY"
            />
          </a-form-item>

          <a-form-item>
            <a-button html-type="submit">Valider le rendez-vous</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
  </div>
</template>

<style scoped>
.images {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
}
</style>
