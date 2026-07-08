<template>
    <button class="open-button" @click="openModal">Delete</button>

    <div v-if="isOpen" class="modal-backdrop" role="presentation" @click.self="closeModal">
        <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="delete-result-title">
            <header class="modal-header">
                <h2 id="delete-result-title">Delete Result</h2>
            </header>

            <div class="modal-body">
                <p class="confirm-message">Are you sure you want to delete this record?</p>

                <div class="summary-wrapper">
                    <table class="summary-table">
                        <thead>
                            <tr>
                                <th scope="col">Player Name</th>
                                <th scope="col">Rank</th>
                                <th scope="col">Bushi Navi ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ props.player.playerName }}</td>
                                <td>{{ props.player.rank }}</td>
                                <td>{{ props.player.bushiNaviId }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

                <div class="modal-actions">
                    <button type="button" class="secondary" :disabled="isDeleting" @click="closeModal">Cancel</button>
                    <button type="button" class="danger" :disabled="isDeleting" @click="confirmDelete">
                        {{ isDeleting ? 'Deleting...' : 'Confirm' }}
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, inject } from 'vue';

import { API_BASE_URL, API_PATH } from '@/services/api-path';
import type { playerResults } from '../../../shared/array-types';
import type { AxiosInstance } from 'axios';

const api = inject('$api') as AxiosInstance;

const props = defineProps<{
    player: playerResults;
}>();

const emit = defineEmits<{
    (event: 'deleted'): void;
}>();

const isOpen = ref(false);
const isDeleting = ref(false);
const errorMessage = ref('');

const openModal = () => {
    errorMessage.value = '';
    isOpen.value = true;
};

const closeModal = () => {
    if (isDeleting.value) {
        return;
    }

    errorMessage.value = '';
    isOpen.value = false;
};

const confirmDelete = async () => {
    isDeleting.value = true;
    errorMessage.value = '';

    try {
        const response = await api.delete(`${API_PATH.playerResults}/delete/${props.player.id}`);

        if (response.status !== 200 && response.status !== 204) {
            const responseMessage = response.data?.message;
            throw new Error(responseMessage || 'Failed to delete player result');
        }

        emit('deleted');
        closeModal();
    } catch (error: any) {
        console.error('Error deleting player result:', error);
        errorMessage.value = error.response?.data?.message || error.message || 'Failed to delete the player result.';
    } finally {
        isDeleting.value = false;
    }
};

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
        closeModal();
    }
};

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
});

</script>

<style lang="scss" scoped>
.open-button {
    border: 1px solid var(--primary);
    background: var(--primary);
    color: #fff;
    border-radius: 0.5rem;
    padding: 0.55rem 0.9rem;
    cursor: pointer;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    padding: 1rem;
    z-index: 50;
}

.modal-card {
    width: min(96vw, 52rem);
    background: #fff;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.2);
}

.modal-header {
    padding: 1rem 1rem 0.5rem;
}

.modal-header h2 {
    margin: 0;
}

.modal-body {
    padding: 0.5rem 1rem 1rem;
}

.confirm-message {
    margin: 0 0 0.75rem;
}

.summary-wrapper {
    width: 100%;
    overflow-x: auto;
    margin-bottom: 1rem;
}

.summary-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
}

.summary-table th,
.summary-table td {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.summary-table th {
    font-weight: 600;
    font-size: 0.92rem;
}

.form-error {
    margin: 0 0 1rem;
    padding: 0.55rem 0.7rem;
    border: 1px solid #fca5a5;
    background: #fef2f2;
    color: #b91c1c;
    border-radius: 0.4rem;
    font-size: 0.9rem;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.modal-actions button {
    border-radius: 0.5rem;
    padding: 0.45rem 0.8rem;
    cursor: pointer;
}

.secondary {
    border: 1px solid #d1d5db;
    background: #fff;
}

.danger {
    border: 1px solid #b91c1c;
    background: #b91c1c;
    color: #fff;
}

.secondary:disabled,
.danger:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

</style>