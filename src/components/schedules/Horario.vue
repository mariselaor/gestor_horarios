<template>
  <div class="p-6 max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg">
    <router-link to="/" class="link link-info mb-4">Volver a la página principal</router-link>

    <!-- Mostrar el día seleccionado -->
    <h2 class="text-2xl font-bold text-primary mb-4">{{ selectedDay }}</h2>

    <!-- Tabla de horarios -->
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>Asignatura</th>
          <th>Día</th>
          <th>Horario</th>
          <th>Docente</th>
          <th>Salón</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="clase in clasesFiltradas" :key="clase.id">
          <td>{{ clase.asignatura }}</td>
          <td>{{ clase.dia }}</td>
          <td>{{ clase.horario }}</td>
          <td>{{ clase.docente }}</td>
          <td>{{ clase.salon }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="clasesFiltradas.length === 0" class="mt-4 text-red-500">No hay clases programadas para este día.</p>
  </div>
</template>

<script>
import { db } from '@/stores/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default {
  data() {
    return {
      selectedDay: this.$route.params.day, // Obtiene el día de la URL
      clases: [],  // Array para almacenar los horarios
    };
  },
  computed: {
    // Filtrar por el día seleccionado
    clasesFiltradas() {
      return this.clases.filter(clase => clase.dia === this.selectedDay);
    },
  },
  async created() {
    // Llamar a la función para cargar los horarios
    await this.fetchHorarios();
  },
  methods: {
    async fetchHorarios() {
      try {
        const category = this.$route.query.category;  

        if (!category) {
          console.error('No se pasó ninguna categoría en la URL');
          return;
        }

        const categoriaDoc = await getDocs(query(collection(db, 'categorias'), where('__name__', '==', category)));

        if (categoriaDoc.empty) {
          console.log("Categoría no encontrada.");
          return;
        }

        // Obtener la subcolección 'horarios' dentro de la categoría seleccionada
        const horariosCollection = collection(categoriaDoc.docs[0].ref, 'horarios');
        const horariosSnapshot = await getDocs(horariosCollection);

        if (horariosSnapshot.empty) {
          console.log("No hay horarios disponibles para esta categoría.");
        } else {
          this.clases = horariosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      }
    },
  },
};
</script>
