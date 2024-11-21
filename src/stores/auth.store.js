import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdminAuthenticated: false,
  }),
  actions: {
    loginAsAdmin() {
      this.isAdminAuthenticated = true;
    },
    loginAsUser() {
      this.isUserAuthenticated = true;
    },
    logout() {
      this.isAdminAuthenticated = false;
    }
  }
});
