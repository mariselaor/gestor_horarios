<template>
  <div class="login-container p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6 text-center text-gray-800">Iniciar sesión como Administrador</h2>
    <form @submit.prevent="iniciarSesion" class="space-y-6">
      <div>
        <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input 
          type="email" 
          v-model="correo" 
          placeholder="ejemplo@correo.com" 
          required 
          class="input input-bordered w-full bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input 
          type="password" 
          v-model="password" 
          placeholder="Contraseña" 
          required 
          class="input input-bordered w-full bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
        />
      </div>
      <button type="submit" class="btn btn-primary w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 rounded-md py-2">
        Iniciar sesión
      </button>

      <div v-if="error" class="alert alert-error mt-4 text-red-600">
        {{ error }}
      </div>

      <!-- Enlace de login como usuario -->
      <p class="mt-6 text-center text-sm">
        ¿No eres administrador? 
        <router-link to="/userlogin" class="text-indigo-600 hover:text-indigo-700">
          Iniciar sesión como usuario
        </router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth.store"; // Importa el almacén de autenticación

export default {
  data() {
    return {
      correo: '',
      password: '',
      error: '',
    };
  },
  methods: {
    async iniciarSesion() {
      const authStore = useAuthStore();

      try {
        const db = getFirestore();
        const adminRef = collection(db, 'admin');
        const querySnapshot = await getDocs(adminRef);

        let isAuthenticated = false;
        querySnapshot.forEach((doc) => {
          const adminData = doc.data();
          if (adminData.email === this.correo && adminData.password === this.password) {
            isAuthenticated = true;
          }
        });

        if (isAuthenticated) {
          authStore.loginAsAdmin(); // Marca al administrador como autenticado
          this.$router.push('/'); // Redirige al dashboard de administrador
        } else {
          this.error = "Credenciales incorrectas";
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        this.error = "Hubo un error al verificar las credenciales.";
      }
    },
  },
};
</script>
