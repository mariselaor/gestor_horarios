<template>
    <div class="login-container flex items-center justify-center min-h-screen bg-base-200">
      <div class="w-full max-w-sm p-8 bg-base-100 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-center text-primary mb-6">Login Usuario</h2>
        
        <form @submit.prevent="iniciarSesion">
          <!-- Número de carnet -->
          <div class="mb-4">
            <label for="carnet" class="label">
              <span class="label-text">Número de Carnet:</span>
            </label>
            <input
              type="text"
              v-model="carnet"
              placeholder="Ingresa tu número de carnet"
              required
              class="input input-bordered w-full p-3"
            />
          </div>
          
          <!-- Contraseña -->
          <div class="mb-6">
            <label for="password" class="label">
              <span class="label-text">Contraseña:</span>
            </label>
            <input
              type="password"
              v-model="password"
              placeholder="Contraseña"
              required
              class="input input-bordered w-full p-3"
            />
          </div>
          
          <!-- Botón de inicio -->
          <button type="submit" class="btn btn-primary w-full">
            Iniciar sesión
          </button>
  
          <!-- Mensaje de error -->
          <p v-if="error" class="mt-4 text-center text-sm text-red-500">{{ error }}</p>
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
        error: ''
      };
    },
    methods: {
      async iniciarSesion() {
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
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    background-color: #f0f4f8; /* Fondo gris claro */
  }
  
  input:focus, button:focus {
    outline: none;
    border-color: #4c8bf5;
  }
  
  .btn-primary {
    background-color: #3490dc;
    color: white;
    transition: background-color 0.3s ease;
  }
  
  .btn-primary:hover {
    background-color: #2779bd;
  }
  </style>
  