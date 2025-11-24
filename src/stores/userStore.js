  import { defineStore } from 'pinia';

const USERS_KEY = 'users';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUserId: null,
  }),

  getters: {
    users() {
      const raw = localStorage.getItem(USERS_KEY);
      if (!raw) return [];
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    },
    currentUser(state) {
      return this.users.find((u) => u.id === state.currentUserId) || null;
    },
    isAuthenticated(state) {
      return !!state.currentUserId;
    },
  },

  actions: {
    // регистрация нового пользователя
    register(email, password) {
      const trimmedEmail = email.trim().toLowerCase();
      const users = this.users;

      if (!trimmedEmail) {
        throw new Error('Введите email');
      }
      if (!this.isValidEmail(trimmedEmail)) {
        throw new Error('Некорректный email');
      }
      if (!password) {
        throw new Error('Введите пароль');
      }

      const exists = users.some((u) => u.email === trimmedEmail);
      if (exists) {
        throw new Error('Пользователь с таким email уже существует');
      }

      const newUser = {
        id: Date.now(),
        email: trimmedEmail,
        password, // в учебном примере храним в открытом виде
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

      this.currentUserId = newUser.id;
    },

    // вход пользователя
    login(email, password) {
      const trimmedEmail = email.trim().toLowerCase();
      const users = this.users;

      if (!trimmedEmail || !password) {
        throw new Error('Введите email и пароль');
      }

      const user = users.find(
        (u) => u.email === trimmedEmail && u.password === password,
      );

      if (!user) {
        throw new Error('Неверный email или пароль');
      }

      this.currentUserId = user.id;
    },

    // выход из приложения
    logout() {
      this.currentUserId = null;
    },

    // простая проверка email
    isValidEmail(email) {
      const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      return re.test(email);
    },

    // изменение email текущего пользователя
    changeEmail(newEmail, password) {
      if (!this.currentUser) {
        throw new Error('Пользователь не найден');
      }

      const trimmedEmail = newEmail.trim().toLowerCase();
      if (!this.isValidEmail(trimmedEmail)) {
        throw new Error('Некорректный email');
      }
      if (!password) {
        throw new Error('Введите текущий пароль');
      }

      const users = this.users;
      const me = users.find((u) => u.id === this.currentUserId);

      if (!me || me.password !== password) {
        throw new Error('Неверный пароль');
      }

      const exists = users.some(
          (u) => u.email === trimmedEmail && u.id !== this.currentUserId,
      );
      if (exists) {
        throw new Error('Пользователь с таким email уже существует');
      }

      const updatedUsers = users.map((u) =>
          u.id === this.currentUserId ? { ...u, email: trimmedEmail } : u,
      );
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      this.currentUserId = me.id; // на всякий случай
    },

    // смена пароля текущего пользователя
    changePassword(oldPassword, newPassword) {
      if (!this.currentUser) {
        throw new Error('Пользователь не найден');
      }
      if (!oldPassword || !newPassword) {
        throw new Error('Введите старый и новый пароль');
      }

      const users = this.users;
      const me = users.find((u) => u.id === this.currentUserId);

      if (!me || me.password !== oldPassword) {
        throw new Error('Неверный текущий пароль');
      }

      const updatedUsers = users.map((u) =>
          u.id === this.currentUserId ? { ...u, password: newPassword } : u,
      );
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      this.currentUserId = me.id;
    },
  },

  persist: {
    key: 'user-store',
    storage: window.localStorage,
  },
});