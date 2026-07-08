<template>
  <div class="timeline-wrapper">
    <div class="timeline-scroll-shell">
      <div v-if="loading" class="loading-state">
        Loading tournaments...
      </div>

      <div v-else class="timeline-scroll">
        <Timeline :value="tournaments" layout="horizontal" align="bottom">
          <template #opposite="slotProps: { item: IEventDetailsSummary }">
            <div class="timeline-date-label" :class="getDateStatusClass(slotProps.item.eventDate)">
              {{ formatDate(slotProps.item.eventDate) }}
            </div>
          </template>

          <template #marker="slotProps: { item: IEventDetailsSummary }">
            <span class="timeline-dot" :class="getDateStatusClass(slotProps.item.eventDate)">
              <span class="inner-core"></span>
            </span>
          </template>

          <template #content="slotProps: { item: IEventDetailsSummary }">
            <div class="tournament-card">
              <div class="tournament-text-accent">
                <h4 class="tournament-title">{{ slotProps.item.eventType }} {{ slotProps.item.name }}</h4>
              </div>
            </div>
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import Timeline from 'primevue/timeline';
import { API_BASE_URL, API_PATH } from '@/services/api-path';
import { useEventTimelineStore } from '@/stores/eventTimeline';
import { formatDate } from '@/../shared/helperfunctions';

import { type IEventDetailsSummary } from '@/../shared/array-types';
import type { AxiosInstance } from 'axios';

const api = inject('$api') as AxiosInstance;

const tournaments = ref<IEventDetailsSummary[]>([]);
const loading = ref<boolean>(true);
const eventTimelineId: string = useEventTimelineStore().eventTimelineYear;

onMounted(async () => {
  try {
    const response = await api.get(`${API_PATH.eventseries}/${eventTimelineId}/all`);
    tournaments.value = response.data.data ?? [];
  } catch (error) {
    console.error('Error fetching tournament timeline:', error);
  } finally {
    loading.value = false;
  }
});

const getDateStatusClass = (dateString: string): string => {
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate < today) return 'is-past';
  if (targetDate.getTime() === today.getTime()) return 'is-today';
  return 'is-future';
};

</script>

<style lang="scss" scoped>
.timeline-wrapper {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  overflow: clip;
  padding: 1.25rem;
  background: var(--surface, #f8fafc);
  border-radius: 1rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 18px 40px rgba(40, 43, 51, 0.04);

  .timeline-scroll-shell {
    overflow: hidden;
    width: 100%;
  }

  .timeline-scroll {
    width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0.45rem;
    scrollbar-width: thin;
  }

  .loading-state {
    text-align: center;
    color: var(--text-muted, #475569);
    padding: 2rem;
    font-weight: 600;
  }

  .timeline-date-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-muted, #475569);
    margin-bottom: 0.5rem;
    white-space: nowrap;

    &.is-past {
      color: #15803d;
    }

    &.is-today {
      color: #dc2626;
    }

    &.is-future {
      color: #1d4ed8;
    }
  }

  .timeline-dot {
    position: relative;
    display: inline-flex;
    width: 20px;
    height: 20px;
    margin: 0;
    padding: 0;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 3px solid #cbd5e1;
    box-sizing: border-box;
    line-height: 0;
    z-index: 5;

    .inner-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;
      width: 8px;
      height: 8px;
      margin: 0;
      padding: 0;
      border-radius: 50%;
      background: #94a3b8;
    }

    &.is-past {
      border-color: #16a34a;
      background-color: #dcfce7;

      .inner-core {
        background-color: #16a34a;
      }
    }

    &.is-today {
      border-color: #dc2626;
      box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2);

      .inner-core {
        background-color: #dc2626;
      }
    }

    &.is-future {
      border-color: #2563eb;

      .inner-core {
        background-color: #2563eb;
      }
    }
  }

  .tournament-card {
    margin-top: 0.75rem;
    min-width: 0;
    width: 100%;

    .tournament-text-accent {
      border-left: 2px solid rgba(148, 163, 184, 0.5);
      padding-left: 0.5rem;
    }

    .tournament-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-strong, #0f172a);
      line-height: 1.3;
    }

    .tournament-meta {
      margin: 0.25rem 0 0 0;
      font-size: 0.8rem;
      color: #64748b;
    }
  }

  :deep(.p-timeline) {
    width: max-content;
    min-width: 100%;
  }

  :deep(.p-timeline-event) {
    min-width: 220px;
    flex: 0 0 220px;
  }

  :deep(.p-timeline-event-opposite),
  :deep(.p-timeline-event-content) {
    min-width: 150px;
  }

  :deep(.p-timeline-event-separator) {
    align-items: center;
  }

  :deep(.p-timeline-event-connector) {
    height: 3px;
    margin-top: 0;
    background: #cbd5e1;
    border-radius: 999px;
  }
}
</style>