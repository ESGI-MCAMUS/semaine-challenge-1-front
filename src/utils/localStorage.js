import { useStorage } from "@vueuse/core";

export const token = useStorage("user", {});

export const favorites = useStorage("favorites", []);
