<template>
  <div v-if="isOpen && flaggedPlayers.length > 0" class="conflict-backdrop">
    <section class="conflict-card" role="dialog" aria-modal="true">
      <header>
        <h2 class="warning-title">⚠️ Double Qualification Warning</h2>
      </header>
      
      <div class="conflict-body">
        <p>The system detected that the following player(s) from this submission have already locked in an invite at a different event this year:</p>
        
        <ul class="conflict-list">
          <li v-for="conflict in flaggedPlayers" :key="conflict.bushiNaviId">
            <strong>{{ conflict.playerName }}</strong> (ID: {{ conflict.bushiNaviId }}) 
            is registered for <strong>{{ conflict.formatCode }}</strong> here, but holds locked slots at:
            <ul>
              <li v-for="inv in conflict.acceptedInvites" :key="inv.id">
                Slot taken at <strong>{{ inv.event }} ({{ inv.formatCode }})</strong> — Rank: {{ inv.rank }}
              </li>
            </ul>
          </li>
        </ul>
        <p class="action-notice">Please review the 4th-place roll-down logic on your dashboard if these positions alter allocation standings.</p>
      </div>
      
      <footer>
        <button class="confirm-button" @click="closeModal">Acknowledge</button>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue';
import type { AxiosInstance } from 'axios';
import { API_PATH } from '@/services/api-path';

type SubmittedRow = {
  bushiNaviId: string;
  playerName: string;
  formatCode: string;
};

const props = defineProps<{
  submittedRows: SubmittedRow[];
  eventTimelineYear: string;
  eventId: string;
}>();

const emit = defineEmits<{
  (e: 'closed'): void;
}>();

const api = inject('$api') as AxiosInstance;
const isOpen = ref(false);
const flaggedPlayers = ref<any[]>([]);

const checkBatchConflicts = async () => {
  flaggedPlayers.value = [];
  
  if (props.submittedRows.length === 0) return;

  try {
    const checkPromises = props.submittedRows.map(async (row) => {
      const params = new URLSearchParams({
        bushiNaviId: row.bushiNaviId,
        eventTimeline: props.eventTimelineYear,
        eventId: props.eventId,
        formatCode: row.formatCode
      });

      const response = await api.get(`${API_PATH.playerResults}/check-invites`, { params });
      console.log("Checking row:", row.playerName, "Response data:", response.data);
      
      if (response.data.data?.hasAcceptedInviteElsewhere) {
        return {
          bushiNaviId: row.bushiNaviId,
          playerName: row.playerName,
          formatCode: row.formatCode,
          acceptedInvites: response.data.data.acceptedInvites
        };
      }
      return null;
    });

    const results = await Promise.all(checkPromises);
    flaggedPlayers.value = results.filter((r): r is any => r !== null);
    console.log("Flagged players:", flaggedPlayers.value);
    
    // Only swing open the modal if we have actual flags to show
    isOpen.value = flaggedPlayers.value.length > 0;
    
    if (flaggedPlayers.value.length === 0) {
      emit('closed'); // Notify parent nothing was blocked
    }
  } catch (err) {
    console.error("Batch verification failed", err);
  }
};

// Automatically run the check whenever a new batch of rows is passed down
watch(
  props, 
  async (newProps) => {
    if (newProps.submittedRows && newProps.submittedRows.length > 0) {
      console.log("Watcher caught new rows successfully!", newProps.submittedRows); // 👈 Verification log
      await checkBatchConflicts();
    }
  }, 
  { deep: true, immediate: true }
);

const closeModal = () => {
  isOpen.value = false;
  emit('closed');
};
</script>

<style lang="scss" scoped>
.conflict-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  z-index: 100;
}

.conflict-card {
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 38rem;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);

  header h2 {
    color: #d97706;
    margin: 0 0 1rem 0;
  }
}

.conflict-list {
  margin: 1rem 0;
  padding-left: 1.2rem;
  
  li {
    margin-bottom: 0.5rem;
    
    ul {
      margin-top: 0.25rem;
      padding-left: 1rem;
      color: #4b5563;
    }
  }
}

.action-notice {
  font-size: 0.88rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.375rem;
}

.confirm-button {
  background: #111827;
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  float: right;
  
  &:hover {
    background: #1f2937;
  }
}
</style>