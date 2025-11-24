<template>
  <div>
    <header>
      <h1>To-Do List</h1>
      <ThemeToggle :isDark="isDarkTheme" @toggle="toggleTheme" />
    </header>

    <main>
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
    </main>

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
import { ref, computed, watch, onMounted } from 'vue';
import ThemeToggle from './components/ThemeToggle.vue';
import SearchBar from './components/SearchBar.vue';
import TodoList from './components/TodoList.vue';
import AddTodoModal from './components/AddTodoModal.vue';

// ключи для localStorage
const TASKS_KEY = 'tasks';
const THEME_KEY = 'theme';

// основное состояние приложения
const tasks = ref([]);
const searchQuery = ref('');
const isDarkTheme = ref(true);

// состояние модальных окон
const isTaskModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const editingTask = ref(null); // null — создаём новую задачу

// применение текущей темы к body
const applyThemeToBody = () => {
  document.body.classList.remove('dark-theme', 'light-theme');
  document.body.classList.add(isDarkTheme.value ? 'dark-theme' : 'light-theme');
};

// переключение темы
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
};

// начальная загрузка задач и темы
onMounted(() => {
  const savedTasks = localStorage.getItem(TASKS_KEY);
  if (savedTasks) {
    try {
      tasks.value = JSON.parse(savedTasks);
    } catch {
      tasks.value = [];
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light') {
    isDarkTheme.value = false;
  } else {
    isDarkTheme.value = true;
  }

  applyThemeToBody();
});

// сохранение задач в localStorage
watch(
    tasks,
    (val) => {
      localStorage.setItem(TASKS_KEY, JSON.stringify(val));
    },
    { deep: true }
);

// сохранение темы и применение к body
watch(isDarkTheme, (val) => {
  localStorage.setItem(THEME_KEY, val ? 'dark' : 'light');
  applyThemeToBody();
});

// задачи, отфильтрованные по строке поиска (активные)
const filteredActiveTasks = computed(() =>
    tasks.value.filter(
        (t) =>
            !t.done &&
            t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

// задачи, отфильтрованные по строке поиска (выполненные)
const filteredDoneTasks = computed(() =>
    tasks.value.filter(
        (t) =>
            t.done &&
            t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

// добавление новой задачи
const addTask = (title) => {
  tasks.value.push({
    id: Date.now(),
    title,
    done: false,
  });
};

// обновление существующей задачи
const updateTask = (id, title) => {
  tasks.value = tasks.value.map((t) =>
      t.id === id ? { ...t, title } : t
  );
};

// удаление задачи
const deleteTask = (id) => {
  tasks.value = tasks.value.filter((t) => t.id !== id);
};

// переключение статуса выполнения
const toggleDone = (id) => {
  tasks.value = tasks.value.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
  );
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

// полная очистка списка задач
const clearAll = () => {
  tasks.value = [];
  closeConfirmModal();
};
</script>