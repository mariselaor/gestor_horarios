import { createRouter, createWebHistory } from 'vue-router';
import AdminLogin from '../components/auth/AdminLogin.vue';
import Registro from '../components/auth/Registro.vue';
import Logout from '../components/auth/Logout.vue'; 
import Categorias from '../components/Categorias.vue';
import AddSchedule from '../components/schedules/AddSchedule.vue';
import Scheduler from '@/components/Scheduler.vue';
import UserLogin from '../components/auth/UserLogin.vue';

const routes = [
  { path: '/', name: 'Categorias', component: Categorias },
  { path: '/adminlogin', name: 'AdminLogin', component: AdminLogin, meta: { hideMenu: true } },
  { path: '/userlogin', name: 'Login', component: UserLogin, meta: { hideMenu: true } },
  { path: '/registro', name: 'Registro', component: Registro, meta: { hideMenu: true } },
  { path: '/logout', name: 'Logout', component: Logout }, 
  { path: '/add', name: 'AddSchedule', component: AddSchedule },
  { path: '/scheduler', name: 'Scheduler', component: Scheduler, meta: { hideMenu: true } },  // Ocultar menú en esta ruta
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
