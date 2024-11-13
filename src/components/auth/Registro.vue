<script setup>
import { ref } from "vue";
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
const error = ref(null);
const userStore = useUserStore();
const router = useRouter();

const register = async () => {
  try {
    await userStore.register(email.value, password.value);
    error.value = null;
    router.push({ name: 'Categorias' });
  } catch (err) {
    error.value = "Error de registro. Verifica tus datos.";
  }
};
</script>

<template>
  <div class="register-container flex flex-col items-center justify-center min-h-screen bg-base-200 p-6 text-center">
    <h1 class="text-3xl font-bold mb-8">Crear cuenta</h1>
    <form @submit.prevent="register" class="register-form w-full max-w-xs space-y-4">
      <input v-model="email" type="email" placeholder="Correo electrónico" required class="input input-bordered w-full" />
      <input v-model="password" type="password" placeholder="Contraseña" required class="input input-bordered w-full" />
      <button type="submit" class="btn btn-primary w-full">Registrar</button>
      <p v-if="error" class="text-error text-sm mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
</style>
