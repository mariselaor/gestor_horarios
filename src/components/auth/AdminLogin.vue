<template>
    <div class="login-container p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4 text-center">Login Administrador</h2>
      <form @submit.prevent="iniciarSesion" class="space-y-4">
        <div>
          <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico:</label>
          <input type="email" v-model="correo" placeholder="ejemplo@correo.com" required class="input input-bordered w-full" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input type="password" v-model="password" placeholder="Contraseña" required class="input input-bordered w-full" />
        </div>
        <button type="submit" class="btn btn-primary w-full">Iniciar sesión</button>
      </form>
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, getDocs } from "firebase/firestore"; // Importamos funciones para Firestore
  import { auth } from '@/stores/firebase';
  
  export default {
    data() {
      return {
        correo: '',
        password: '',
        error: ''
      };
    },
    methods: {
      async iniciarSesion() {
        try {
          // Obtener la colección de administradores desde Firestore
          const db = getFirestore();
          const adminRef = collection(db, 'admin'); // Asegúrate de que la colección sea 'admin'
          const querySnapshot = await getDocs(adminRef);
  
          // Verificar si las credenciales coinciden con alguna en Firestore
          let isAuthenticated = false;
          querySnapshot.forEach((doc) => {
            const adminData = doc.data();
            if (adminData.email === this.correo && adminData.password === this.password) {
              isAuthenticated = true; // Si encontramos una coincidencia
            }
          });
  
          if (isAuthenticated) {
            // Si las credenciales coinciden, redirigir a la página principal
            this.$router.push('/');
          } else {
            // Si no, mostrar un mensaje de error
            this.error = "Credenciales incorrectas";
          }
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          this.error = "Hubo un error al verificar las credenciales.";
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    background-color: var(--daisyui-base-100);
    color: var(--daisyui-base-content);
  }
  </style>
  