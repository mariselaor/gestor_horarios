import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store'; // Importa el almacén de autenticación

import AdminLogin from '../components/auth/AdminLogin.vue';
import Registro from '../components/auth/Registro.vue';
import Logout from '../components/auth/Logout.vue'; // Ruta para Logout (cerrar sesión de administrador)
import Categorias from '../components/Categorias.vue';
import AddSchedule from '../components/schedules/AddSchedule.vue';
import Scheduler from '@/components/Scheduler.vue';
import UserLogin from '../components/auth/UserLogin.vue';
import CerrarSesion from '@/components/auth/CerrarSesion.vue'; // Ruta para Cerrar Sesión (de usuario)

const routes = [
  { path: '/', name: 'Categorias', component: Categorias, meta: { requiresAuth: true } },
  { path: '/adminlogin', name: 'AdminLogin', component: AdminLogin, meta: { hideMenu: true } },
  { path: '/userlogin', name: 'UserLogin', component: UserLogin, meta: { hideMenu: true } }, // Nombre correcto de la ruta
  { path: '/registro', name: 'Registro', component: Registro, meta: { hideMenu: true } },
  { path: '/logout', name: 'AdminLogout', component: Logout }, // Renombrado como AdminLogout
  { path: '/cerrar', name: 'UserLogout', component: CerrarSesion }, // Renombrado como UserLogout
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Si la ruta requiere autenticación, verifica si el usuario está autenticado
  if (requiresAuth) {
    if (authStore.isAdminAuthenticated || authStore.isUserAuthenticated) {
      // El usuario o el administrador están autenticados, pueden continuar
      next();
    } else {
      // Si no están autenticados, redirige a la página de login de usuario
      next({ name: 'UserLogin' }); // Redirige al login de usuario, nombre correcto
    }
  } else {
    next(); // Si no requiere autenticación, permite continuar
  }
});

export default router;
