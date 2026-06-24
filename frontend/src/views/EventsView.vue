<template>
  <main>
    <h1>Events Dashboard</h1>
    <p>Look up, create and add events/player results</p>

    <div class="events-container">
      <EventsDisplay :events="events" />
      

    </div>
  </main>
</template>

<script setup lang="ts">
import EventsDisplay from '@/components/events/EventsDisplay.vue';

import { type EventSeries } from '@/../shared/array-types';
import { onMounted, ref } from 'vue';
import { API_PATH, API_BASE_URL } from '@/services/api-path';

onMounted(async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/${API_PATH.eventseries}`);
    if (!response.ok) throw new Error(await response.text());
    events.value = await response.json();
  } catch (err) {
    console.error('Event fetch failed', err);
  }
});

const events = ref<EventSeries[]>([]);

</script>

<style lang="scss" scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    max-width: 100vw;
    margin: 0 auto;
    flex: 1; // Allows the main content to take up the remaining space next to the sidebar
    transition: padding 0.2s ease-out;

    @media (max-width: 768px) {
      // When the sidebar becomes 'fixed' (defined in Sidebar.vue), it overlaps content.
      // We add padding-left equal to the sidebar width (calc(2rem + 32px)) 
      // plus our existing 2rem padding to keep things clear.
      padding-left: calc(2rem + 32px + 2rem);
    }
  }

  h1, p {
    align-self: flex-start;
    width: 100%;
  }

  .events-container {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 80vw;
    max-height: 80vh;
    flex: 1; // Fills the remaining vertical space dynamically
    background-color: lightgray;
  }
</style>
