import { defineStore } from 'pinia';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useUserAuthStore = defineStore('userAuth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    setAuthState(user) {
      this.user = user;
      this.isAuthenticated = user !== null;
    },
    checkAuth() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        this.setAuthState(user);
      });
    },
  },
});