<script setup>
import { InboxOutlined } from "@ant-design/icons-vue";
import { reactive } from "vue";

const formState = reactive({
  dragger: [],
});
</script>

<template>
  <h1 class="text-3xl text-center font-semibold py-6">Déposer vos document</h1>

  <div class="px-12">
    <a-form
      :model="formState"
      name="validate_other"
      v-bind="formItemLayout"
      @finishFailed="onFinishFailed"
      @finish="onFinish"
    >
      <a-form-item>
        <a-form-item name="dragger" no-style>
          <a-upload-dragger
            v-model:fileList="formState.dragger"
            name="files"
            action="/upload.do"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">
              Cliquer ou glisser le fichier ici pour le télécharger
            </p>
            <p class="ant-upload-hint">
              Prise en charge que d'un téléchargement unique.
            </p>
          </a-upload-dragger>
        </a-form-item>
      </a-form-item>
    </a-form>
  </div>
</template>
