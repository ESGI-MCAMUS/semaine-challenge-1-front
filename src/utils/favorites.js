import { favorites } from "./localStorage";
import { token } from "./localStorage";
import { client } from "../services";

export const refetchFavorites = async () => {
  const { data } = await client.get(`/favorite_ads?fk_user=${token.value.id}`);
  favorites.value = data["hydra:member"];
};

export const isFavorite = (id) => {
  return favorites.value.some((favorite) => favorite.realEstateAd === id);
};
