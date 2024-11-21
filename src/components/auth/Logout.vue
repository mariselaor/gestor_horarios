<template>
  <div class="logout-page flex flex-col items-center justify-center min-h-screen bg-base-300 text-base-content p-6 text-center">
    <!-- Enlace a la página principal -->
    <router-link 
      to="/" 
      class="link link-primary text-lg flex items-center gap-2">
      <!-- Ícono de Heroicons -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
      Volver a la página principal
    </router-link>

    <h1 class="text-2xl font-bold mb-6 drop-shadow-lg">
      ¿Estás seguro de que deseas cerrar sesión?
    </h1>

    <!-- Mostrar correo del administrador -->
    <p v-if="adminEmail" class="text-lg mb-4">
      Sección iniciada con: <span class="font-semibold">{{ adminEmail }}</span>
    </p>

    <!-- Botón de cerrar sesión -->
    <button 
      @click="logout" 
      class="btn btn-outline btn-error">
      Cerrar sesión
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  name: "Logout",
  setup() {
    const adminEmail = ref(""); // Usamos ref para administrar el estado reactivo en Composition API
    const router = useRouter();

    // Lógica para obtener el correo del administrador desde Firestore
    onMounted(async () => {
      const db = getFirestore();
      const adminRef = collection(db, "admin");
      const querySnapshot = await getDocs(adminRef);
      
      // Suponiendo que solo hay un administrador, obtenemos el primer correo encontrado
      if (!querySnapshot.empty) {
        const adminData = querySnapshot.docs[0].data();
        adminEmail.value = adminData.email; // Suponiendo que el campo en Firestore es 'email'
      }
    });

    // Función para cerrar sesión
    const logout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        router.push("/adminlogin");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    return {
      adminEmail, // Retornamos adminEmail para que esté disponible en el template
      logout,
    };
  },
};
</script>

<style scoped>
.logout-page {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}
</style>
