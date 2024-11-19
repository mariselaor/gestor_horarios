import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store'; // Importa el almacén de autenticación

import AdminLogin from '../components/auth/AdminLogin.vue';
import Registro from '../components/auth/Registro.vue';
import Logout from '../components/auth/Logout.vue'; 
import Categorias from '../components/Categorias.vue';
import AddSchedule from '../components/schedules/AddSchedule.vue';
import Scheduler from '@/components/Scheduler.vue';
import UserLogin from '../components/auth/UserLogin.vue';

const routes = [
  { path: '/', name: 'Categorias', component: Categorias, meta: { requiresAuth: true } },
  { path: '/adminlogin', name: 'AdminLogin', component: AdminLogin, meta: { hideMenu: true } },
  { path: '/userlogin', name: 'Login', component: UserLogin, meta: { hideMenu: true } },
  { path: '/registro', name: 'Registro', component: Registro, meta: { hideMenu: true } },
  { path: '/logout', name: 'Logout', component: Logout },
  { path: '/add', name: 'AddSchedule', component: AddSchedule, meta: { requiresAuth: true } },
  { path: '/scheduler', name: 'Scheduler', component: Scheduler, meta: { hideMenu: true } },
  {
    path: '/days',
    name: 'DiasSemana',
    component: () => import('../components/schedules/DiasSemana.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/schedule/:day',
    name: 'Horario',
    component: () => import('../components/schedules/Horario.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// global para proteger rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAdminAuthenticated) {
    next({ name: 'AdminLogin' }); // Redirige al inicio de sesión del administrador
  } else {
    next();
  }
});

export default router;