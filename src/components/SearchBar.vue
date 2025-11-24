<template>
  <input
      type="text"
      id="search"
      placeholder="Поиск задачи..."
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
// двустороннее связывание строки поиска через v-model
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>