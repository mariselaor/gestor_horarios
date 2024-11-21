<template>
    <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black">
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold text-white">¿Estás seguro de que deseas cerrar sesión?</h3>
        <div class="mt-4 flex justify-between">
          <button @click="cerrarSesion" class="btn btn-outline btn-success">Sí, cerrar sesión</button>
          <button @click="cerrarAlerta" class="btn btn-outline btn-error">Cancelar</button>
        </div>
      </div>
    </div>
</template>
  
<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  methods: {
    cerrarAlerta() {
      this.$emit('cerrar-alerta'); // Emitir evento para cerrar la alerta
    },
    async cerrarSesion() {
      const auth = getAuth();
      try {
        await signOut(auth); // Cerrar sesión en Firebase
        console.log("Sesión cerrada con éxito.");
        this.$router.push({ name: 'UserLogin' });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }
  }
};
</script>
  
<style scoped>
.fixed {
  z-index: 1000;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
