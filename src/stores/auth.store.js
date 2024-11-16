import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdminAuthenticated: false, // Estado de autenticación del administrador
  }),
  actions: {
    loginAsAdmin() {
      this.isAdminAuthenticated = true;
    },
    logout() {
      this.isAdminAuthenticated = false;
    },
  },
});
