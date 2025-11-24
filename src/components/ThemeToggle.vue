<template>
  <button id="theme-toggle" @click="$emit('toggle')">
    Сменить тему
  </button>
</template>

<script setup>
// индикатор текущей темы (при необходимости можно использовать в UI)
defineProps({
  isDark: {
    type: Boolean,
    default: true,
  },
});
</script>