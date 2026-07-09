<template>
  <div class="dashboard-card alert-card">
    <header class="card-header">
      <h2>⚠️ Pending Invite Roll-Downs ({{ rollDownAlerts.length }})</h2>
    </header>
    
    <!-- When alerts are present -->
    <div v-if="rollDownAlerts.length > 0" class="table-wrapper">
      <table class="dashboard-table">
        <thead>
          <tr>
            <th scope="col">Event / Format</th>
            <th scope="col">Vacated Slots</th>
            <th scope="col">Eligible Player (4th)</th>
            <th scope="col" class="actions-col">Navigation</th> <!-- 🚀 New Column Header -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in rollDownAlerts" :key="alert.eventId + '-' + alert.formatCode">
            <td>
              <strong class="event-title">{{ alert.eventName }}</strong>
              <span class="format-badge">{{ alert.formatCode }}</span>
            </td>
            <td class="count-cell">{{ alert.vacatedCount }} slot(s)</td>
            <td>
              <strong class="player-name">{{ alert.eligiblePlayer.name }}</strong> 
              <span class="id-sub">({{ alert.eligiblePlayer.bushiNaviId }})</span>
            </td>
            <td class="actions-col">
              <!-- 🚀 Clean RouterLink directly to the specific event details view -->
              <RouterLink 
                :to="{ name: 'event-details', params: { id: alert.eventId } }" 
                class="view-event-link"
              >
                Go to Event →
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Clean, Centered Empty State Container -->
    <div v-else class="empty-state-container">
      <div class="empty-state-content">
        <span class="status-icon">✅</span>
        <p class="status-text">All qualification slots are correctly allocated for this timeline year.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch } from 'vue';
import type { AxiosInstance } from 'axios';
import { RouterLink } from 'vue-router'; // Explicitly imported for safety
import { useEventTimelineStore } from '@/stores/eventTimeline';
import { API_PATH } from '@/services/api-path';

// Inject the global API instance configured with your baseURL/interceptors
const api = inject('$api') as AxiosInstance;
const timelineStore = useEventTimelineStore();

// Reactive array to store our structured roll-down anomalies
const rollDownAlerts = ref<any[]>([]);
const isLoading = ref(false);
const hasError = ref(false);

const loadDashboardAlerts = async () => {
  const timelineYear = timelineStore.eventTimelineYear;
  
  try {
    isLoading.value = true;
    hasError.value = false;

    const params = { eventTimeline: timelineYear };
    const response = await api.get(`${API_PATH.playerResults}/dashboard-alerts`, { params });
    
    // Grab the processed flagged formats array directly from our controller's response
    rollDownAlerts.value = response.data.data?.alerts ?? [];
  } catch (err) {
    hasError.value = true;
    console.error("Failed to load dashboard operational roll-down alerts", err);
  } finally {
    isLoading.value = false;
  }
};

// Execute the audit check as soon as the dashboard panel hits the DOM tree
onMounted(() => {
  loadDashboardAlerts();
});

// 🚀 Keep data reactive: Run the check again if an admin flips the year toggle on the dashboard
watch(
  () => timelineStore.eventTimelineYear,
  () => {
    loadDashboardAlerts();
  }
);
</script>

<style lang="scss" scoped>
.dashboard-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .card-header h2 {
    margin: 0 0 1.25rem 0;
    font-size: 1.2rem;
    color: #1f2937;
  }
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.92rem;
  
  th {
    padding: 0.75rem 1rem;
    background: #f9fafb;
    font-weight: 600;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
  }
  
  td {
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
  }

  .event-title {
    color: #111827;
  }

  .count-cell {
    font-weight: 500;
    color: #374151;
  }

  .player-name {
    color: #111827;
  }
}

.format-badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.5rem;
  display: inline-block;
}

.id-sub {
  font-size: 0.8rem;
  color: #9ca3af;
  display: block;
  margin-top: 0.15rem;
}

.actions-col {
  text-align: right;
  white-space: nowrap;
}

/* 🚀 Styled Navigation Link Component */
.view-event-link {
  display: inline-block;
  color: #111827;
  background-color: #fff;
  border: 1px solid #d1d5db;
  padding: 0.4rem 0.8rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.88rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
    color: #000;
  }
}

/* Styled Centered Container Block */
.empty-state-container {
  display: grid;
  place-items: center;
  min-height: 12rem;
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  background: #fafafa;
  padding: 2rem;
  text-align: center;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  
  .status-icon {
    font-size: 1.75rem;
  }
  
  .status-text {
    margin: 0;
    color: #4b5563;
    font-weight: 500;
    font-size: 0.95rem;
    line-height: 1.4;
  }
}
</style>