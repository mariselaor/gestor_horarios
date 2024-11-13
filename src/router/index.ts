import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/auth/Login.vue';
import Registro from '../components/auth/Registro.vue';
import Logout from '../components/auth/Logout.vue'; 
import Categorias from '../components/Categorias.vue';
import AddSchedule from '../components/schedules/AddSchedule.vue';
import Scheduler from '@/components/Scheduler.vue';

const routes = [
  { path: '/', name: 'Categorias', component: Categorias },
  { path: '/login', name: 'Login', component: Login, meta: { hideMenu: true } },
  { path: '/registro', name: 'Registro', component: Registro, meta: { hideMenu: true } },
  { path: '/logout', name: 'Logout', component: Logout }, 
  { path: '/add', name: 'AddSchedule', component: AddSchedule },
  { path: '/scheduler', name: 'Scheduler', component: Scheduler },
  {
    path: '/days',
    name: 'DiasSemana',
    component: () => import('../components/schedules/DiasSemana.vue'),
  },
  {
    path: '/schedule/:day',
    name: 'Horario',
    component: () => import('../components/schedules/Horario.vue'),
  },  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
