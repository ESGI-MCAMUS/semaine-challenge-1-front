<script>
import { defineComponent, reactive } from "vue";
import { clientWithoutAuth } from "../services";
import { token } from "../utils/localStorage";

export default defineComponent({
  setup() {
    const formState = reactive({
      username: "",
      password: "",
      remember: true,
    });

    // log le router actuel

    const onFinish = async (values) => {
      try {
        const res = await clientWithoutAuth.post("/auth", {
          email: values.username,
          password: values.password,
        });
        console.log(res.data);

        token.value = res.data.token;
      } catch (error) {
        console.error("error", error);
      }

      // axios
      //   .post("/auth", { email: values.username, password: values.password })
    };
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

<template>
  <!-- add antd col -->
  <a-col :span="8" :offset="8">
    <a-card title="Login">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-col>
</template>
