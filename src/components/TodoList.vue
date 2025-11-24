<template>
  <ul>
    <TodoItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle-done="$emit('toggle-done', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
    />
  </ul>
</template>

<script setup>
import TodoItem from './TodoItem.vue';

// список задач, просто делегирует события родителю
defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['toggle-done', 'edit', 'delete']);
</script>