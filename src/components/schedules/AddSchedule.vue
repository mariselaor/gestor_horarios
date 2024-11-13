<template>
  <div class="p-6 max-w-md mx-auto bg-base-100 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-primary mb-4">Añadir Nuevo Horario</h2>
    <form @submit.prevent="saveSchedule">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Día:</label>
        <select v-model="dia" required class="select select-bordered w-full">
          <option value="" disabled selected>Selecciona un día</option>
          <option value="lunes">Lunes</option>
          <option value="martes">Martes</option>
          <option value="miércoles">Miércoles</option>
          <option value="jueves">Jueves</option>
          <option value="viernes">Viernes</option>
          <option value="sábado">Sábado</option>
          <option value="domingo">Domingo</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Horario:</label>
        <input type="text" v-model="horario" required class="input input-bordered w-full" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Asignatura:</label>
        <input type="text" v-model="asignatura" required class="input input-bordered w-full" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Docente:</label>
        <input type="text" v-model="docente" required class="input input-bordered w-full" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Salón:</label>
        <select v-model="salon" required class="select select-bordered w-full">
          <option value="" disabled selected>Selecciona un salón</option>
          <option value="Computo A3">Computo A3</option>
          <option value="Computo C3">Computo C3</option>
          <option value="Computo B1">Computo B1</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Carrera:</label>
        <select v-model="categoria" required class="select select-bordered w-full">
          <option value="" disabled selected>Selecciona una carrera</option>
          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
            {{ categoria.nombre }}
          </option>
        </select>
      </div>

      <button type="submit" class="w-full mt-4 px-4 py-2 text-white bg-green-500 hover:bg-green-400 rounded">Guardar</button>
      <router-link :to="{ path: '/days', query: { category: categoria } }" class="inline-block w-full mt-2">
        <button type="button" class="btn btn-primary w-full">Cancelar</button>
      </router-link>
    </form>
  </div>
</template>

<script>
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '@/stores/firebase';

export default {
  data() {
    return {
      dia: '',
      horario: '',
      asignatura: '',
      docente: '',
      salon: '',
      categoria: '',
      categorias: [] 
    };
  },
  async created() {
    await this.loadCategorias();
  },
  methods: {
    async loadCategorias() {
      try {
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        this.categorias = categoriasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    },
    async saveSchedule() {
      try {
        const categoriaRef = doc(db, 'categorias', this.categoria);
        const horariosCollection = collection(categoriaRef, 'horarios');

        await addDoc(horariosCollection, {
          horario: this.horario,
          dia: this.dia,
          asignatura: this.asignatura,
          docente: this.docente,
          salon: this.salon,
        });
        console.log('Horario guardado con éxito');
        this.$router.push({ path: '/days', query: { category: this.categoria } });
      } catch (error) {
        console.error('Error al guardar el horario:', error);
      }
    }
  }
};
</script>

<style scoped>
</style>
