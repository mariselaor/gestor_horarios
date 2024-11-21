<template>
  <!-- Mostrar solo el mensaje de carga mientras la variable 'loading' es verdadera -->
  <div v-if="loading" class="flex justify-center items-center h-screen">
    <p class="text-lg font-bold">Cargando...</p>
  </div>

  <!-- Una vez cargados los datos, mostrar el contenido de la página -->
  <div v-else>
    <div class="p-6 max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg">
      <!-- Botón para retroceder a la página anterior -->
      <div class="mb-4">
        <button 
      @click="goBack" 
      class="mb-4 inline-flex items-center justify-center w-10 h-10 text-white bg-gray-500 rounded-full hover:bg-gray-600 transition duration-200"
    >
      <!-- Ícono (usando Heroicons como ejemplo) -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
      </div>

      <!-- Mostrar el día seleccionado -->
      <h2 class="text-2xl font-bold text-primary mb-4">{{ selectedDay }}</h2>

      <!-- Mensaje de éxito o error -->
      <div v-if="message" class="mt-4 p-4" :class="{'bg-green-100 text-green-800': message.type === 'success', 'bg-red-100 text-red-800': message.type === 'error'}">
        {{ message.text }}
      </div>

      <!-- Mostrar un mensaje si no hay clases filtradas -->
      <div v-if="clasesFiltradas.length === 0 && !loading" class="mt-4 text-red-500">
        <p>No se encontraron clases para el día seleccionado.</p>
      </div>

      <!-- Tabla de horarios si hay clases filtradas -->
      <table v-else class="table table-zebra w-full">
        <thead>
          <tr>
            <th>Asignatura</th>
            <th>Día</th>
            <th>Horario</th>
            <th>Docente</th>
            <th>Salón</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clase in clasesFiltradas" :key="clase.id">
            <td>{{ clase.asignatura }}</td>
            <td>{{ clase.dia }}</td>
            <td>{{ clase.horaInicio }} - {{ clase.horaFin }}</td>
            <td>{{ clase.docente }}</td>
            <td>{{ clase.salon }}</td>
            <td class="flex justify-start space-x-2">
              <button @click="editClase(clase)" class="btn btn-outline btn-warning btn-sm">Editar</button>
              <button @click="askDeleteClase(clase.id)" class="btn btn-outline btn-error btn-sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario de edición -->
<div v-if="editMode" class="mt-4 p-4 bg-gray-800 text-white rounded-xl shadow-md">
  <h3 class="text-xl font-bold">Editar Clase</h3>
  <form @submit.prevent="saveClase">
    <div>
      <label for="asignatura" class="block">Asignatura</label>
      <input type="text" v-model="editableClase.asignatura" class="input input-bordered w-full" />
    </div>
    <div class="mt-2">
      <label for="dia" class="block">Día</label>
      <input type="text" v-model="editableClase.dia" class="input input-bordered w-full" />
    </div>
    <div class="mt-2">
      <label for="horario" class="block">Horario</label>
      <input type="text" v-model="editableClase.horario" class="input input-bordered w-full" />
    </div>
    <div class="mt-2">
      <label for="docente" class="block">Docente</label>
      <input type="text" v-model="editableClase.docente" class="input input-bordered w-full" />
    </div>
    <div class="mt-2">
      <label for="salon" class="block">Salón</label>
      <input type="text" v-model="editableClase.salon" class="input input-bordered w-full" />
    </div>
    <div class="mt-4 flex space-x-2">
      <button type="submit" class="btn btn-outline btn-success">Guardar cambios</button>
      <button @click.prevent="cancelEdit" class="btn btn-outline btn-error">Cancelar</button>
    </div>
  </form>
</div>


      <!-- Modal de confirmación de eliminación -->
      <div v-if="deletingClaseId" class="modal modal-open">
        <div class="modal-box">
          <h2 class="text-xl font-bold">Confirmar eliminación</h2>
          <p>¿Estás seguro de que deseas eliminar esta clase? Esta acción no se puede deshacer.</p>
          <div class="modal-action">
            <button @click="deleteClase(deletingClaseId)" class="btn btn-outline btn-error">Eliminar</button>
            <button @click="cancelDelete" class="btn btn-outline">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/stores/firebase';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      selectedDay: this.$route.params.day, // Obtiene el día de la URL
      clases: [],  // Array para almacenar los horarios
      editMode: false, // Controla si estamos en modo edición
      editableClase: {}, // Almacena los datos de la clase que se está editando
      message: null,  // Mensaje de éxito o error
      deletingClaseId: null,  // ID de la clase que se está eliminando
      loading: true,  // Indicador de carga
    };
  },
  computed: {
    // Filtrar las clases por el día seleccionado
    clasesFiltradas() {
      return this.clases.filter(clase => clase.dia === this.selectedDay);
    },
  },
  async created() {
    // Llamar a la función para cargar los horarios
    await this.fetchHorarios();
  },
  methods: {
    // Función para retroceder a la página anterior
    goBack() {
      this.$router.go(-1); // Retroceder en el historial del navegador
    },

    // Cargar los horarios desde Firebase
    async fetchHorarios() {
      try {
        const category = this.$route.query.category;
        if (!category) {
          console.error('No se pasó ninguna categoría en la URL');
          return;
        }

        // Simular un retraso de 2 segundos antes de cargar los datos
        setTimeout(async () => {
          const categoriaDoc = await getDocs(query(collection(db, 'categorias'), where('__name__', '==', category)));

          if (categoriaDoc.empty) {
            console.log("Categoría no encontrada.");
            return;
          }

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

          this.loading = false; // Cambiar el estado de carga a falso
        }, 2000); // Espera de 2 segundos
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
        this.loading = false; // En caso de error también cambiamos el estado
      }
    },

    // Activar el modo de edición para una clase específica
    editClase(clase) {
      this.editMode = true;
      this.editableClase = { ...clase }; // Cargar los datos de la clase seleccionada
    },

    // Guardar los cambios realizados en la clase
    async saveClase() {
      try {
        if (!this.editableClase.id) {
          console.error('ID de la clase no encontrado. No se puede guardar.');
          return;
        }

        const claseRef = doc(db, 'categorias', this.$route.query.category, 'horarios', this.editableClase.id);

        // Actualizamos los datos de la clase en Firebase
        await updateDoc(claseRef, {
          asignatura: this.editableClase.asignatura,
          dia: this.editableClase.dia,
          horario: this.editableClase.horario,
          docente: this.editableClase.docente,
          salon: this.editableClase.salon,
        });

        // Actualizamos el array local de clases con los nuevos datos
        const index = this.clases.findIndex(clase => clase.id === this.editableClase.id);
        if (index !== -1) {
          this.clases[index] = { ...this.editableClase };
        }

        // Mostrar un mensaje de éxito
        this.message = { text: 'Clase actualizada correctamente', type: 'success' };

        // Ocultar el mensaje después de 1 segundo
        setTimeout(() => {
          this.message = null;
        }, 1000);

        // Salir del modo de edición
        this.editMode = false;
        this.editableClase = {};
      } catch (error) {
        console.error('Error al guardar la clase:', error);
        this.message = { text: 'Error al guardar la clase', type: 'error' };
        
        // Ocultar el mensaje después de 1 segundo
        setTimeout(() => {
          this.message = null;
        }, 1000);
      }
    },

    // Cancelar la edición
    cancelEdit() {
      this.editMode = false;
      this.editableClase = {};
    },

    // Mostrar el modal para confirmar la eliminación
    askDeleteClase(id) {
      this.deletingClaseId = id;
    },

    // Cancelar la eliminación
    cancelDelete() {
      this.deletingClaseId = null;
    },

    // Eliminar la clase
    async deleteClase(id) {
      try {
        const claseRef = doc(db, 'categorias', this.$route.query.category, 'horarios', id);
        await deleteDoc(claseRef);

        // Filtrar la clase eliminada en el array local
        this.clases = this.clases.filter(clase => clase.id !== id);

        // Mostrar un mensaje de éxito
        this.message = { text: 'Clase eliminada correctamente', type: 'success' };

        // Ocultar el mensaje después de 1 segundo
        setTimeout(() => {
          this.message = null;
        }, 1000);

        this.deletingClaseId = null; // Cerrar el modal
      } catch (error) {
        console.error('Error al eliminar la clase:', error);
        this.message = { text: 'Error al eliminar la clase', type: 'error' };

        // Ocultar el mensaje después de 1 segundo
        setTimeout(() => {
          this.message = null;
        }, 1000);
      }
    },
  },
};
</script>
