<template>
  <div class="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md dark:text-white">
    <!-- Ícono para retroceder a la página anterior -->
    <button 
      @click="goBack" 
      class="mb-4 inline-flex items-center justify-center w-10 h-10 text-white bg-gray-500 rounded-full hover:bg-gray-600 transition duration-200"
    >
      <!-- Ícono (usando Heroicons como ejemplo) -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <h2 class="text-2xl font-semibold text-center mb-6">Seleccionar Día</h2>
    <ul class="space-y-2">
      <li
        v-for="dia in dias"
        :key="dia"
        @click="selectDia(dia)"
        class="cursor-pointer p-4 rounded-lg bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-800 transition-all duration-300 hover:text-blue-700 flex justify-between items-center"
      >
        <span>{{ dia }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    };
  },
  methods: {
    // Función para retroceder a la página anterior
    goBack() {
      this.$router.go(-1); // Retroceder en el historial del navegador
    },

    selectDia(dia) {
      const diaSlug = dia.replace(/\s+/g, '-').toLowerCase();
      const categoria = this.$route.query.category;
      this.$router.push({ path: `/schedule/${diaSlug}`, query: { category: categoria } });
    }
  }
}
</script>

<style scoped>
/* Puedes agregar más estilos aquí si lo necesitas */
</style>
