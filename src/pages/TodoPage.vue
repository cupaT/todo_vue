<template>
  <div>
    <SearchBar v-model="searchQuery" />

    <section>
      <div class="actions">
        <button @click="openAddModal">Добавить задачу</button>
        <button @click="openConfirmModal">Очистить все</button>
      </div>

      <TodoList
        :tasks="filteredActiveTasks"
        @toggle-done="toggleDone"
        @edit="openEditModal"
        @delete="deleteTask"
      />

      <h2>Выполненные задачи</h2>
      <TodoList
        :tasks="filteredDoneTasks"
        @toggle-done="toggleDone"
        @edit="openEditModal"
        @delete="deleteTask"
      />
    </section>

    <!-- Модалка добавления/редактирования задачи -->
    <AddTodoModal
      v-if="isTaskModalOpen"
      :initialTitle="editingTask ? editingTask.title : ''"
      @save="handleSaveTask"
      @close="closeTaskModal"
    />

    <!-- Модалка подтверждения очистки списка -->
    <div
      v-if="isConfirmModalOpen"
      class="modal"
      @click.self="closeConfirmModal"
    >
      <div class="modal__content">
        <span>Вы уверены, что хотите удалить все задачи?</span>
        <div class="modal__actions">
          <button type="button" @click="clearAll">Удалить</button>
          <button type="button" @click="closeConfirmModal">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import TodoList from '../components/TodoList.vue';
import AddTodoModal from '../components/AddTodoModal.vue';
import { useTodoStore } from '../stores/todoStore.js';

const todoStore = useTodoStore();

const searchQuery = ref('');
const isTaskModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const editingTask = ref(null); // null — создаём новую задачу

// задачи, отфильтрованные по строке поиска (активные)
const filteredActiveTasks = computed(() =>
  todoStore.userTasks.filter(
    (t) =>
      !t.done &&
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
);

// задачи, отфильтрованные по строке поиска (выполненные)
const filteredDoneTasks = computed(() =>
  todoStore.userTasks.filter(
    (t) =>
      t.done &&
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
);

// добавление новой задачи
const addTask = (title) => {
  todoStore.addTask(title);
};

// обновление существующей задачи
const updateTask = (id, title) => {
  todoStore.updateTask(id, title);
};

// удаление задачи
const deleteTask = (id) => {
  todoStore.deleteTask(id);
};

// переключение статуса выполнения
const toggleDone = (id) => {
  todoStore.toggleDone(id);
};

// открытие модалки для создания задачи
const openAddModal = () => {
  editingTask.value = null;
  isTaskModalOpen.value = true;
};

// открытие модалки для редактирования задачи
const openEditModal = (task) => {
  editingTask.value = { ...task };
  isTaskModalOpen.value = true;
};

// закрытие модалки задачи
const closeTaskModal = () => {
  isTaskModalOpen.value = false;
  editingTask.value = null;
};

// сохранение задачи из модалки (создание или обновление)
const handleSaveTask = (title) => {
  const trimmed = title.trim();
  if (!trimmed) return;

  if (editingTask.value) {
    updateTask(editingTask.value.id, trimmed);
  } else {
    addTask(trimmed);
  }
  closeTaskModal();
};

// открытие модалки подтверждения очистки
const openConfirmModal = () => {
  isConfirmModalOpen.value = true;
};

// закрытие модалки подтверждения очистки
const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
};

// полная очистка списка задач для текущего пользователя
const clearAll = () => {
  todoStore.clearAllForCurrentUser();
  closeConfirmModal();
};
</script>