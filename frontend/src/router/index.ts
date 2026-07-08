import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // -- Guest routes --
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { isPublic: true },
    },

    // -- Authenticated routes --
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/events',
      name: 'events',
      // route level code-splitting
      // this generates a separate chunk (Events.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EventsView.vue'),
    },
    {
      path: '/events/:id',
      name: 'event-details',
      component: () => import('../views/EventDetailsView.vue'),
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/InfoView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  //Check cookie status once if state is empty:
  if (authStore.user === null && !to.meta.isPublic) {
    await authStore.checkAuthStatus();
  }

  const isAuthenticated = authStore.isLoggedIn;

  //If the user tries to access something whilst unauthenticated, redirect to login:
  if (!to.meta.isPublic && !isAuthenticated) {
    return next({ name: 'login' });
  }

  //If the user tries to access login whilst authenticated, redirect to home:
  if (to.name === 'login' && isAuthenticated) {
    return next({ name: 'home' });
  }

  //Otherwise, allow access:
  next();
});

export default router
