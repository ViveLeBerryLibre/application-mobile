import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import DashboardPage from '@/modules/Dashboard/pages/Dashboard.vue';
import NotesPage from '@/modules/Notes/Page/Notes.vue';


//import {registerGuard} from '@/router/Guards';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      requiresAuth: false
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: NotesPage,
    meta: {
      requiresAuth: false
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

//registerGuard(router);

export default router;
