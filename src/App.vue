<template>
  <div>
    <header class="app-header">
      <h1>To-Do List</h1>

      <nav class="app-nav">
        <router-link to="/login" v-if="!isAuthenticated">Вход</router-link>
        <router-link to="/register" v-if="!isAuthenticated">Регистрация</router-link>
        <router-link to="/todo" v-if="isAuthenticated">Задачи</router-link>
        <router-link to="/about" v-if="isAuthenticated">О приложении</router-link>
        <router-link to="/profile" v-if="isAuthenticated">Профиль</router-link>
      </nav>

      <div class="app-header__actions">
        <ThemeToggle :isDark="isDarkTheme" @toggle="toggleTheme" />
        <button
            v-if="isAuthenticated"
            type="button"
            class="logout-btn"
            @click="handleLogout"
        >
          Выйти
        </button>
      </div>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ThemeToggle from './components/ThemeToggle.vue';
import { useUserStore } from './stores/userStore.js';

const THEME_KEY = 'theme';

const router = useRouter();
const userStore = useUserStore();

const isDarkTheme = ref(true);

// применение текущей темы к body
const applyThemeToBody = () => {
  document.body.classList.remove('dark-theme', 'light-theme');
  document.body.classList.add(isDarkTheme.value ? 'dark-theme' : 'light-theme');
};

// переключение темы
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
};

const isAuthenticated = computed(() => userStore.isAuthenticated);

// начальная загрузка темы
onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  isDarkTheme.value = savedTheme !== 'light';
  applyThemeToBody();
});

// сохранение темы и применение к body
watch(isDarkTheme, (val) => {
  localStorage.setItem(THEME_KEY, val ? 'dark' : 'light');
  applyThemeToBody();
});

// выход пользователя
const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.app-header {
  padding: 2.5em 0 1.5em 0;
  text-align: center;
}

.app-header h1 {
  margin: 0;
  font-size: 2.8em;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #3a8bfd;
  text-shadow: 0 2px 8px rgba(58, 139, 253, 0.1);
}

.app-nav {
  margin-top: 1em;
  display: flex;
  justify-content: center;
  gap: 1em;
  flex-wrap: wrap;
}

.app-nav a {
  text-decoration: none;
  font-weight: 600;
  padding: 0.3em 0.9em;
  border-radius: 999px;
  transition: background 0.15s, color 0.15s;
}

body.dark-theme .app-nav a {
  color: #fff;
}

body.light-theme .app-nav a {
  color: #111;
}

.app-nav a.router-link-active {
  background: rgba(58, 139, 253, 0.25);
}

.app-header__actions {
  margin-top: 1.2em;
  display: flex;
  justify-content: center;
  gap: 1em;
}

.logout-btn {
  font-weight: 600;
}
</style>