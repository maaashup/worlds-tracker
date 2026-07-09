<template>
  <div class="app" :class="{ 'no-sidebar': !showSidebar }">
    <Sidebar v-if="showSidebar" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import Sidebar from './components/sidebar/Sidebar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const route = useRoute();

const sidebarHiddenRoutes = new Set(['login', 'reset-password']);
const showSidebar = computed(() => authStore.isLoggedIn && !sidebarHiddenRoutes.has(String(route.name)));

</script>

<style lang="scss">
:root {
    --primary: rgb(222, 74, 74);
    --grey: #64748b;
    --dark: #1e293b;
    --dark-alt: #334155;
    --light: #f8fafc;
    --sidebar-width: 300px;
}

html {
  height: 100%;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;
  min-height: 100vh;

  &.no-sidebar {
    display: block;
  }
  
  main {
    flex: 1 1 0;
    min-width: 0;
    padding: 2rem;

    @media (max-width: 768px) {
      padding-left: 6rem;
    }
  }
}
</style>
