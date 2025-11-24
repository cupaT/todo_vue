<template>
  <li class="todo-card" :class="{ done: task.done }">
    <button
        class="checkbox-btn"
        :data-id="task.id"
        aria-label="Выполнено"
        title="Выполнено"
        tabindex="0"
        @click="$emit('toggle-done', task.id)"
    >
      <svg
          v-if="task.done"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
      >
        <circle
            cx="11"
            cy="11"
            r="10"
            stroke="#3a8bfd"
            stroke-width="2"
        />
        <path
            d="M6 12L10 16L16 8"
            stroke="#3a8bfd"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
      </svg>
      <svg
          v-else
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
      >
        <circle
            cx="11"
            cy="11"
            r="10"
            stroke="#cfd8dc"
            stroke-width="2"
        />
      </svg>
    </button>

    <span class="todo-title">{{ task.title }}</span>

    <button
        class="edit-btn"
        :data-id="task.id"
        aria-label="Редактировать"
        title="Редактировать"
        @click="$emit('edit', task)"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 256 256"
      >
        <path
            d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"
            fill="#3a8bfd"
        />
      </svg>
    </button>

    <button
        class="delete-btn"
        :data-id="task.id"
        aria-label="Удалить"
        title="Удалить"
        @click="$emit('delete', task.id)"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 256 256"
      >
        <path
            d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
            fill="#3a8bfd"
        />
      </svg>
    </button>
  </li>
</template>

<script setup>
// одна задача, все действия пробрасываются наверх через события
defineProps({
  task: {
    type: Object,
    required: true,
  },
});

defineEmits(['toggle-done', 'edit', 'delete']);
</script>