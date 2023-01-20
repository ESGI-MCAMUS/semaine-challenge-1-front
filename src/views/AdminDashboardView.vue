<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in state.users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button @click="editUser(user.id)">Edit</button>
            <button @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { client } from "../services";
import Footer from "../components/Footer.vue";
import router from "../router";
import { defineComponent } from "vue";
import { reactive } from "vue";

const state = reactive({
  users: [],
  page: 1,
  totalPages: 0,
  totalItems: 0,
  itemPerPage: 0,
});

const getUsers = () => {
  client
    .get(`/users?page=${state.page}`)
    .then((res) => {
      const data = res.data;
      state.totalItems = data["hydra:totalItems"];
      state.users = data["hydra:member"];
      state.itemPerPage = state.users.length;
      state.totalPages = Number(data["hydra:view"]["hydra:last"].slice(-1));
    })
    .catch((err) => {
      console.log(err);
    });
};
getUsers();
</script>
