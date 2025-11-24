<template>
  <div class="modal" @click.self="handleBackdropClick">
    <form class="modal__form" @submit.prevent="handleSubmit">
      <input
          type="text"
          id="task-title"
          placeholder="Название задачи"
          v-model="title"
          required
          ref="titleInput"
      />
      <div class="modal__actions">
        <button type="submit">Сохранить</button>
        <button type="button" @click="$emit('close')">Отмена</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

// props: исходный текст задачи (для редактирования)
const props = defineProps({
  initialTitle: {
    type: String,
    default: '',
  },
});

// события: сохранение и закрытие модального окна
const emit = defineEmits(['save', 'close']);

const title = ref(props.initialTitle);
const titleInput = ref(null);

// синхронизация локального состояния с prop при открытии модалки
watch(
    () => props.initialTitle,
    (val) => {
      title.value = val || '';
    }
);

// автофокус на поле ввода при монтировании
onMounted(() => {
  setTimeout(() => {
    titleInput.value?.focus();
  }, 100);
});

// отправка формы (добавление или сохранение задачи)
const handleSubmit = () => {
  emit('save', title.value);
};

// закрытие модалки по клику по фону
const handleBackdropClick = () => {
  emit('close');
};
</script>