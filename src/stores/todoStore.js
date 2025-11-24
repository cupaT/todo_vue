import { defineStore } from 'pinia';
import { useUserStore } from './userStore.js';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    tasks: [],
  }),

  getters: {
    // задачи только текущего пользователя
    userTasks() {
      const userStore = useUserStore();
      if (!userStore.currentUser) return [];
      return this.tasks.filter((t) => t.userId === userStore.currentUser.id);
    },
  },

  actions: {
    addTask(title) {
      const userStore = useUserStore();
      if (!userStore.currentUser) return;

      this.tasks.push({
        id: Date.now(),
        userId: userStore.currentUser.id,
        title,
        done: false,
      });
    },

    updateTask(id, title) {
      this.tasks = this.tasks.map((t) =>
        t.id === id ? { ...t, title } : t,
      );
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
    },

    toggleDone(id) {
      this.tasks = this.tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      );
    },

    clearAllForCurrentUser() {
      const userStore = useUserStore();
      if (!userStore.currentUser) return;
      this.tasks = this.tasks.filter((t) => t.userId !== userStore.currentUser.id);
    },
  },

  persist: {
    key: 'todo-store',
    storage: window.localStorage,
  },
});