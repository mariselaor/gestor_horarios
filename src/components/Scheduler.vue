<template>
  <div class="scheduler">
    <h1 class="title">Gestor de Horarios</h1>
    <table class="schedule-table">
      <thead>
        <tr>
          <th>Aula</th>
          <th>Hora</th>
          <th>Clase</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in schedule" :key="index">
          <td>{{ item.room }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.subject }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      schedule: [
        { room: '101', time: '08:00 - 09:00', subject: 'Matemáticas' },
        { room: '102', time: '09:00 - 10:00', subject: 'Historia' },
        // Más datos...
      ],
    };
  },
};
</script>

<style scoped>
.scheduler {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #4CAF50;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.schedule-table th {
  background-color: #4CAF50;
  color: white;
}

.schedule-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.schedule-table tr:hover {
  background-color: #ddd;
}
</style>
