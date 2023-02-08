<script setup>
const props = defineProps({
  expeditorName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex items-center">
    <div class="rounded-full bg-red-200 w-8 h-8 mr-2"></div>
    <div class="flex flex-col">
      <div class="font-bold">{{ expeditorName }}</div>
      <div class="whitespace-nowrap overflow-hidden text-ellipsis">
        {{ message }}
      </div>
    </div>
  </div>
</template>
