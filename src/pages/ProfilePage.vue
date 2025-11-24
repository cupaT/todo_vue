<template>
  <section class="profile-section">
    <div class="profile-grid">
      <!-- Карточка информации о пользователе -->
      <div class="profile-card">
        <div class="profile-header-row">
          <div>
            <h2>Профиль</h2>
            <p class="profile-tagline">Ваши данные и настройки аккаунта</p>
          </div>
        </div>

        <div class="profile-main">
          <!-- Email + кнопки управления аккаунтом -->
          <div class="profile-row profile-row--email">
            <div class="profile-label-value">
              <span class="profile-label">Email</span>
              <span class="profile-value">
                {{ currentUser?.email || '—' }}
              </span>
            </div>

            <div class="profile-row-buttons">
              <button
                  type="button"
                  class="profile-chip-btn"
                  @click="openEmailModal"
              >
                Изменить email
              </button>
              <button
                  type="button"
                  class="profile-chip-btn"
                  @click="openPasswordModal"
              >
                Сменить пароль
              </button>
            </div>
          </div>

          <!-- Имя / Фамилия / Дата рождения в одной колонке -->
          <div class="profile-col profile-col--full">
            <div class="profile-field">
              <span class="profile-label">Имя</span>

              <template v-if="isEditing">
                <input
                    type="text"
                    v-model="firstName"
                    placeholder="Имя"
                />
                <p v-if="nameError" class="profile-error">{{ nameError }}</p>
              </template>
              <template v-else>
                <span class="profile-value">
                  {{ firstName || '—' }}
                </span>
              </template>
            </div>

            <div class="profile-field">
              <span class="profile-label">Фамилия</span>

              <template v-if="isEditing">
                <input
                    type="text"
                    v-model="lastName"
                    placeholder="Фамилия"
                />
                <p v-if="surnameError" class="profile-error">{{ surnameError }}</p>
              </template>
              <template v-else>
                <span class="profile-value">
                  {{ lastName || '—' }}
                </span>
              </template>
            </div>

            <div class="profile-field">
              <span class="profile-label">Дата рождения</span>

              <template v-if="isEditing">
                <input
                    type="date"
                    v-model="birthDate"
                />
              </template>
              <template v-else>
                <span class="profile-value">
                  {{ formattedBirthDate || '—' }}
                </span>
              </template>
            </div>
          </div>
        </div>

        <!-- Нижняя широкая кнопка -->
        <div class="profile-actions">
          <button
              type="button"
              class="profile-primary-btn"
              @click="handlePrimaryClick"
          >
            {{ isEditing ? 'Сохранить профиль' : 'Редактировать профиль' }}
          </button>
        </div>
      </div>

      <!-- Карточка статистики задач -->
      <div class="profile-card profile-card--stats">
        <h2>Статистика задач</h2>
        <ul class="about-stats">
          <li>
            <span>Всего задач:</span>
            <strong>{{ total }}</strong>
          </li>
          <li>
            <span>Выполнено:</span>
            <strong>{{ done }}</strong>
          </li>
          <li>
            <span>В работе:</span>
            <strong>{{ active }}</strong>
          </li>
        </ul>
      </div>
    </div>

    <!-- Модалка смены email -->
    <div
        v-if="isEmailModalOpen"
        class="modal"
        @click.self="closeEmailModal"
    >
      <form class="modal__form profile-modal" @submit.prevent="handleEmailChange">
        <h3 class="profile-modal__title">Изменение email</h3>

        <div class="profile-modal__field">
          <label>Новый email</label>
          <input
              type="email"
              placeholder="Новый email"
              v-model="newEmail"
              required
          />
        </div>

        <div class="profile-modal__field">
          <label>Текущий пароль</label>
          <input
              type="password"
              placeholder="Текущий пароль"
              v-model="emailPassword"
              required
          />
        </div>

        <p v-if="emailError" class="profile-error profile-error--modal">
          {{ emailError }}
        </p>

        <div class="modal__actions profile-modal__actions">
          <button type="submit">Сохранить</button>
          <button type="button" @click="closeEmailModal">Отмена</button>
        </div>
      </form>
    </div>

    <!-- Модалка смены пароля -->
    <div
        v-if="isPasswordModalOpen"
        class="modal"
        @click.self="closePasswordModal"
    >
      <form class="modal__form profile-modal" @submit.prevent="handlePasswordChange">
        <h3 class="profile-modal__title">Смена пароля</h3>

        <div class="profile-modal__field">
          <label>Текущий пароль</label>
          <input
              type="password"
              placeholder="Текущий пароль"
              v-model="oldPassword"
              required
          />
        </div>

        <div class="profile-modal__field">
          <label>Новый пароль</label>
          <input
              type="password"
              placeholder="Новый пароль"
              v-model="newPassword"
              required
          />
        </div>

        <div class="profile-modal__field">
          <label>Подтверждение нового пароля</label>
          <input
              type="password"
              placeholder="Подтверждение нового пароля"
              v-model="newPasswordConfirm"
              required
          />
        </div>

        <p v-if="passwordError" class="profile-error profile-error--modal">
          {{ passwordError }}
        </p>

        <div class="modal__actions profile-modal__actions">
          <button type="submit">Сохранить</button>
          <button type="button" @click="closePasswordModal">Отмена</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore.js';
import { useTodoStore } from '../stores/todoStore.js';

const userStore = useUserStore();
const todoStore = useTodoStore();

const currentUser = computed(() => userStore.currentUser);
const userTasks = computed(() => todoStore.userTasks);

const total = computed(() => userTasks.value.length);
const done = computed(() => userTasks.value.filter((t) => t.done).length);
const active = computed(() => total.value - done.value);

// локальные поля профиля
const firstName = ref('');
const lastName = ref('');
const birthDate = ref('');
const isEditing = ref(false);

// ошибки для валидации
const nameError = ref('');
const surnameError = ref('');

// модалка смены email
const isEmailModalOpen = ref(false);
const newEmail = ref('');
const emailPassword = ref('');
const emailError = ref('');

// модалка смены пароля
const isPasswordModalOpen = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const newPasswordConfirm = ref('');
const passwordError = ref('');

// форматированная дата для режима просмотра
const formattedBirthDate = computed(() => {
  if (!birthDate.value) return '';
  const date = new Date(birthDate.value);
  if (Number.isNaN(date.getTime())) return birthDate.value;
  return date.toLocaleDateString('ru-RU');
});

// простая валидация "только буквы/пробелы/дефис"
const namePattern = /^[A-Za-zА-Яа-яЁё\s-]+$/;

const validateName = () => {
  nameError.value = '';
  const value = firstName.value.trim();
  if (!value) return true;
  if (!namePattern.test(value)) {
    nameError.value = 'Имя должно содержать только буквы, пробелы и дефис';
    return false;
  }
  return true;
};

const validateSurname = () => {
  surnameError.value = '';
  const value = lastName.value.trim();
  if (!value) return true;
  if (!namePattern.test(value)) {
    surnameError.value = 'Фамилия должна содержать только буквы, пробелы и дефис';
    return false;
  }
  return true;
};

// загрузка/сохранение профиля текущего пользователя в localStorage
const PROFILE_KEY_PREFIX = 'user-profile-';

const loadProfile = () => {
  if (!currentUser.value) return;
  const key = PROFILE_KEY_PREFIX + currentUser.value.id;
  const raw = localStorage.getItem(key);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    firstName.value = data.firstName || '';
    lastName.value = data.lastName || '';
    birthDate.value = data.birthDate || '';
  } catch {
    // ignore
  }
};

const saveProfile = () => {
  if (!currentUser.value) return;
  const key = PROFILE_KEY_PREFIX + currentUser.value.id;
  const data = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    birthDate: birthDate.value,
  };
  localStorage.setItem(key, JSON.stringify(data));
};

// клик по кнопке "Редактировать профиль / Сохранить профиль"
const handlePrimaryClick = () => {
  if (isEditing.value) {
    const okName = validateName();
    const okSurname = validateSurname();
    if (!okName || !okSurname) return;
    saveProfile();
  }
  isEditing.value = !isEditing.value;
};

// работа с email
const openEmailModal = () => {
  emailError.value = '';
  newEmail.value = currentUser.value?.email || '';
  emailPassword.value = '';
  isEmailModalOpen.value = true;
};

const closeEmailModal = () => {
  isEmailModalOpen.value = false;
};

const handleEmailChange = () => {
  emailError.value = '';
  try {
    userStore.changeEmail(newEmail.value, emailPassword.value);
    closeEmailModal();
  } catch (e) {
    emailError.value = e.message || 'Ошибка изменения email';
  }
};

// работа с паролем
const openPasswordModal = () => {
  passwordError.value = '';
  oldPassword.value = '';
  newPassword.value = '';
  newPasswordConfirm.value = '';
  isPasswordModalOpen.value = true;
};

const closePasswordModal = () => {
  isPasswordModalOpen.value = false;
};

const handlePasswordChange = () => {
  passwordError.value = '';

  if (newPassword.value !== newPasswordConfirm.value) {
    passwordError.value = 'Новый пароль и подтверждение не совпадают';
    return;
  }

  try {
    userStore.changePassword(oldPassword.value, newPassword.value);
    closePasswordModal();
  } catch (e) {
    passwordError.value = e.message || 'Ошибка смены пароля';
  }
};

onMounted(() => {
  loadProfile();
});

watch(currentUser, () => {
  loadProfile();
});
</script>

<style scoped>
.profile-section {
  max-width: 920px;
  margin: 0 auto 3em;
}

.profile-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr);
  gap: 1.4em;
}

@media (max-width: 800px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  padding: 1.7em 2em 1.6em;
  border-radius: 16px;
  box-shadow: 0 2px 10px -4px rgba(0, 0, 0, 0.4);
}

.profile-card--stats {
  align-self: flex-start;
}

body.dark-theme .profile-card {
  background: #181818;
  color: #fff;
}

body.light-theme .profile-card {
  background: #f7f7f7;
  color: #111;
}

.profile-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.4em;
}

.profile-header-row h2 {
  margin: 0;
}

.profile-tagline {
  margin: 0.25em 0 0;
  font-size: 0.95em;
  opacity: 0.85;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 1.2em;
}

/* строка с email */
.profile-row--email {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2em;
}

@media (max-width: 700px) {
  .profile-row--email {
    flex-direction: column;
    align-items: flex-start;
  }
}

.profile-label-value {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

/* две одинаковые кнопки под правой частью строки email */
.profile-row-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

/* Основная колонка */
.profile-col--full {
  display: flex;
  flex-direction: column;
  gap: 0.9em;
}

.profile-field {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.profile-label {
  font-size: 0.95em;
  opacity: 0.9;
}

.profile-value {
  font-size: 1.04em;
}

.profile-field input {
  border-radius: 12px;
  border: none;
  outline: none;
  padding: 0.55em 0.9em;
  font-size: 1em;
  box-sizing: border-box;
}

body.dark-theme .profile-field input {
  background: #101010;
  color: #fff;
}

body.light-theme .profile-field input {
  background: #fff;
  color: #111;
}

.profile-error {
  margin: 0.1em 0 0;
  font-size: 0.9em;
  color: #f87171;
}

/* нижняя широкая кнопка */
.profile-actions {
  margin-top: 1.6em;
}

.profile-primary-btn {
  width: 100%;
  text-align: center;
  padding: 0.8em 1.4em;
  font-size: 1.02em;
}

/* маленькие одинаковые кнопки возле email */
.profile-chip-btn {
  padding: 0.4em 1.1em;
  font-size: 0.9em;
  border-radius: 999px;
  white-space: nowrap;
}

/* модалки профиля */
.profile-modal {
  max-width: 420px;
  width: 100%;
}

.profile-modal__title {
  margin: 0 0 0.9em;
}

.profile-modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  margin-bottom: 0.8em;
}

.profile-modal__field label {
  font-size: 0.9em;
  opacity: 0.9;
}

.profile-modal__field input {
  border-radius: 12px;
  border: none;
  outline: none;
  padding: 0.6em 0.9em;
  font-size: 1em;
  box-sizing: border-box;
}

body.dark-theme .profile-modal__field input {
  background: #101010;
  color: #fff;
}

body.light-theme .profile-modal__field input {
  background: #fff;
  color: #111;
}

.profile-modal__actions {
  justify-content: flex-end;
}

.profile-error--modal {
  margin-bottom: 0.2em;
}

/* статистика */
.about-stats {
  list-style: none;
  padding: 0;
  margin: 0.6em 0 0.8em;
}

.about-stats li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35em;
}
</style>