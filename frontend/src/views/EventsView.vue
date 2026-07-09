<template>
  <main>
    <h1>Events Dashboard</h1>
    <p>Look up, create and add events/player results</p>

    <div class="events-container">
      <EventsDisplay :groupedEventsSummary="groupedEventsSummary" />
    </div>
  </main>
</template>

<script setup lang="ts">
import EventsDisplay from '@/components/events/EventsDisplay.vue';

import { type IEventSummaryArray } from '@/../shared/array-types';
import { onMounted, ref, computed, inject } from 'vue';
import { type AxiosInstance } from 'axios';
import { API_PATH } from '@/services/api-path';
const api = inject('$api') as AxiosInstance;

onMounted(async () => {
  try {
    const params = new URLSearchParams({
      eventTimelineId: 'ebe728bc-ab62-439a-8261-004e8fece0e0'
    });

    const response = await api.get(`${API_PATH.playerResults}/timelinesummary`, { params });
    eventsSummary.value = response.data.data ?? [];
  } catch (err) {
    console.error('Event fetch failed', err);
  }
});

const eventsSummary = ref<IEventSummaryArray>([]);

const groupedEventsSummary = computed(() => {
  const grouped = new Map<string, IEventSummaryArray>();

  for (const summary of eventsSummary.value) {
    const eventType = summary.eventType || 'Uncategorized';
    const existingGroup = grouped.get(eventType);

    if (existingGroup) {
      existingGroup.push(summary);
    } else {
      grouped.set(eventType, [summary]);
    }
  }

  return Array.from(grouped.entries()).map(([eventType, items]) => ({
    eventType,
    items
  }));
});



</script>

<style lang="scss" scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  }
</style>
