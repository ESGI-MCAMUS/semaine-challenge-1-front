import axios from "axios";
import { API_URL } from "../environements";
import { token } from "../utils/localStorage";

const authHeader = token.value.token ? `Bearer ${token.value.token}` : {};

export const clientWithoutAuth = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: authHeader,
  },
});
