<script setup>
const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const isExpense = parseInt(props.amount) < 0;
// Fuck that.
</script>

<template>
  <div class="flex justify-between mt-2">
    <span class="text-sm text-gray-900 [amountClass]">{{ date }}</span>
    <span class="text-md text-gray-900">{{ amount }}€</span>
  </div>
</template>
