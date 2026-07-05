<template>
  
  <div class="app">
    <Sidebar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/sidebar/Sidebar.vue';


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
  
  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 768px) {
      padding-left: 6rem;
    }
  }
}
</style>
