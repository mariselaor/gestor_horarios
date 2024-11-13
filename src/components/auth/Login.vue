<template>
  <div class="login-container flex flex-col items-center justify-center min-h-screen bg-base-200 p-6 text-center">
    <h1 class="text-2xl font-semibold mb-6">Iniciar sesión</h1>
    <form @submit.prevent="loginUser" class="login-form w-full max-w-xs space-y-4">
      <input v-model="email" type="email" placeholder="Correo electrónico" required class="input input-bordered w-full" />
      <input v-model="password" type="password" placeholder="Contraseña" required class="input input-bordered w-full" />
      <button type="submit" class="btn btn-primary w-full">Iniciar sesión</button>
      <p v-if="error" class="text-error mt-2">{{ error }}</p>
    </form>
    <router-link to="/registro" class="link link-info mt-4">¿No tienes cuenta?</router-link>
  </div>
</template>

<script>
import { auth } from '@/stores/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async loginUser() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.error = null;
        this.$router.push({ name: 'Categorias' });
      } catch (error) {
        this.error = "Error de autenticación. Verifica tus credenciales.";
      }
    },
  },
};
</script>

<style scoped>
</style>
