<template>
  <div class="login-container flex items-end justify-center min-h-screen bg-gray-900">
    <div v-if="loading" class="w-full flex justify-center items-center min-h-screen">
      <!-- Spinner de carga -->
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>

    <!-- Login Form (se muestra solo cuando 'loading' es false) -->
    <div v-if="!loading" class="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-center text-white mb-6">Login Usuario</h2>
      
      <form @submit.prevent="iniciarSesion">
        <!-- Número de carnet -->
        <div class="mb-4">
          <label for="carnet" class="label text-white">
            <span class="label-text">Número de Carnet:</span>
          </label>
          <input
            type="text"
            v-model="carnet"
            placeholder="Ingresa tu número de carnet"
            required
            class="input input-bordered w-full p-3 text-white bg-gray-700 border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <!-- Contraseña -->
        <div class="mb-6">
          <label for="password" class="label text-white">
            <span class="label-text">Contraseña:</span>
          </label>
          <input
            type="password"
            v-model="password"
            placeholder="Contraseña"
            required
            class="input input-bordered w-full p-3 text-white bg-gray-700 border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <!-- Botón de inicio -->
        <button type="submit" class="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white" :disabled="loading">
          <!-- Mostrar texto o spinner según el estado de carga -->
          <span v-if="loading">Cargando...</span>
          <span v-else>Iniciar sesión</span>
        </button>

        <!-- Mensaje de error -->
        <p v-if="error" class="mt-4 text-center text-sm text-red-500">{{ error }}</p>

        <!-- Enlaces para redirigir -->
        <p class="mt-4 text-center text-white">
          ¿No tienes cuenta? 
          <router-link to="/registro" class="text-blue-500">Regístrate aquí</router-link>
        </p>
        <p class="mt-4 text-center text-white">
          ¿Eres un admin? 
          <router-link to="/adminlogin" class="text-blue-500">Iniciar sesión como administrador</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { auth } from '@/stores/firebase';

export default {
  data() {
    return {
      carnet: '',
      password: '',
      error: '',
      loading: true,  // Inicializamos como 'true' para mostrar el loading cuando la página cargue
    };
  },
  mounted() {
    // Simula la carga de 3 segundos antes de mostrar el formulario
    setTimeout(() => {
      this.loading = false;
    }, 3000); // 3 segundos de espera para el efecto de carga
  },
  methods: {
    async iniciarSesion() {
      this.loading = true;  // Activamos el loading al comenzar el proceso

      if (this.carnet && this.password) {
        try {
          // Obtener la colección de usuarios desde Firestore
          const db = getFirestore();
          const usuariossRef = collection(db, 'usuarios');
          const q = query(usuariossRef, where('carnet', '==', this.carnet)); // Filtramos por el carnet

          // Realizamos la consulta
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            this.error = 'Carnet no encontrado';
            this.loading = false; // Desactivamos el loading
            return;
          }

          // Verificar si la contraseña coincide
          let isAuthenticated = false;
          querySnapshot.forEach((doc) => {
            const usuariosData = doc.data();
            if (usuariosData.password === this.password) {
              isAuthenticated = true; // Si la contraseña coincide
            }
          });

          if (isAuthenticated) {
            // Si las credenciales son correctas, redirigir
            this.$router.push('/scheduler');
          } else {
            this.error = 'Contraseña incorrecta';
          }
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          this.error = 'Hubo un error al verificar las credenciales.';
        }
      } else {
        this.error = 'Por favor complete todos los campos';
      }

      this.loading = false; 
    }
  }
};
</script>

<style scoped>
</style>
