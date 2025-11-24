<template>
  <section class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">Регистрация</h2>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <input
            type="email"
            placeholder="Email"
            v-model="email"
            required
        />
        <input
            type="password"
            placeholder="Пароль"
            v-model="password"
            required
        />
        <input
            type="password"
            placeholder="Подтверждение пароля"
            v-model="passwordConfirm"
            required
        />

        <p v-if="error" class="auth-error">{{ error }}</p>

        <div class="auth-actions">
          <button type="submit">Зарегистрироваться</button>
          <router-link to="/login" class="auth-switch">
            Уже есть аккаунт?
          </router-link>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore.js';

const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const error = ref('');

// обработка регистрации
const handleSubmit = () => {
  error.value = '';

  if (password.value !== passwordConfirm.value) {
    error.value = 'Пароли не совпадают';
    return;
  }

  try {
    userStore.register(email.value, password.value);
    router.push('/todo');
  } catch (e) {
    error.value = e.message || 'Ошибка регистрации';
  }
};
</script>

<style scoped>
.auth-wrapper {
  max-width: 520px;
  margin: 0 auto 3em;
}

.auth-card {
  padding: 2em 2.2em 1.8em;
  border-radius: 12px;
  box-shadow: 0 8px 24px -8px rgba(58, 139, 253, 0.35);
}

body.dark-theme .auth-card {
  background: #181818;
  color: #fff;
}

body.light-theme .auth-card {
  background: #f7f7f7;
  color: #111;
}

.auth-title {
  margin-top: 0;
  margin-bottom: 1.3em;
}

.auth-form input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.7em 1.4em;
  font-size: 1.02em;
  border: none;
  border-radius: 12px;
  outline: none;
  margin-bottom: 0.9em;
}

body.dark-theme .auth-form input {
  background: #101010;
  color: #fff;
}

body.light-theme .auth-form input {
  background: #fff;
  color: #111;
}

.auth-error {
  color: #f87171;
  margin: 0 0 0.7em;
  font-size: 0.95em;
}

.auth-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
}

.auth-actions button {
  flex-shrink: 0;
}

.auth-switch {
  font-size: 0.95em;
  text-decoration: none;
  opacity: 0.9;
}

body.dark-theme .auth-switch {
  color: #60a5fa;
}

body.light-theme .auth-switch {
  color: #2563eb;
}
</style>