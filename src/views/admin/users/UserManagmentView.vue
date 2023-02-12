<script setup>
import { notification } from "ant-design-vue";
import { onMounted, reactive } from "vue";
import router from "../../../router";
import { client, clientPatch } from "../../../services";

const state = reactive({
  users: {},
  page: 1,
  totalPages: 0,
  totalUsers: 0,
  userPerPage: 0,
});

const getUsers = async () => {
  client
    .get("/users")
    .then((res) => {
      const data = res.data;
      state.users = data["hydra:member"];
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteUser = (user) => {
  clientPatch
    .put(`${user["@id"]}`, {
      isActive: !user.isActive,
    })
    .then((res) => {
      notification["success"]({
        message: `Utilisateur ${user.isActive ? "désactivé" : "activé"} !`,
        description: "Cet utilisateur a bien été modifié !",
      });

      getUsers();
    })
    .catch((err) => {
      console.log(err);
      notification["error"]({
        message: "Oups !",
        description: "Une erreur est survenue lors de la modification !",
      });
    });
};

const navigate = (id) => {
  router.push(`${id}`);
};

onMounted(() => {
  getUsers();
});
</script>

<template>
  <div class="p-4 sm:ml-64">
    <div class="usersContainer">
      <div class="usersBox" v-for="user in state.users" :key="user.id">
        <a-card style="width: 400px" bodyStyle="padding: 20px">
          <template #actions>
            <a-button type="default" @click="deleteUser(user)">
              {{
                user.isActive
                  ? "Désactiver l'utilisateur"
                  : "Activer l'utilisateur"
              }}
            </a-button>
          </template>
          <a-card-meta :title="user.firstname + ' ' + user.lastname">
          </a-card-meta>
          {{ user.email }}
          <br />
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usersContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}

.usersBox {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
