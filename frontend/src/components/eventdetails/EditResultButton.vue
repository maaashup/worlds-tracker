<template>
    <button class="open-button" @click="openModal">Edit Result</button>

    <div v-if="isOpen" class="modal-backdrop" role="presentation">
        <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-result-title">
            <header class="modal-header">
                <h2 id="edit-result-title">Edit Result</h2>
            </header>

            <form class="modal-body" @submit.prevent="save">
                <div class="form-wrapper">
                    <table class="form-table">
                        <thead>
                            <tr>
                                <th scope="col">Bushi Navi ID:</th>
                                <th scope="col">Player Name:</th>
                                <th scope="col">Decklog:</th>
                                <th scope="col">Format:</th>
                                <th scope="col">Region:</th>
                                <th scope="col">Rank:</th>
                                <th scope="col" class="center-column">Sponsored:</th>
                                <th scope="col" class="center-column">Form Complete:</th>
                                <th scope="col" class="center-column">Qualified:</th>
                                <th scope="col" class="center-column">Invite Accepted Here:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="text" v-model="form.bushiNaviId" required /></td>
                                <td><input type="text" v-model="form.playerName" required /></td>
                                <td><input type="text" v-model="form.decklog" placeholder="Decklog code" /></td>
                                <td>
                                    <select v-model="form.formatCode" required>
                                        <option value="" disabled>Select format</option>
                                        <option v-for="format in formatOptions" :key="format" :value="format">{{ format }}</option>
                                    </select>
                                </td>
                                <td><input type="text" class="locked-input" readonly :value="form.regionCode" /></td>
                                <td>
                                    <select v-model.number="form.rank">
                                        <option :value="1">1</option>
                                        <option :value="2">2</option>
                                        <option :value="3">3</option>
                                        <option :value="4">4</option>
                                    </select>
                                </td>
                                <td class="checkbox-cell center-column">
                                    <input type="checkbox" v-model="form.isSponsored" :disabled="form.rank !== 1" />
                                </td>
                                <td class="checkbox-cell center-column"><input type="checkbox" v-model="form.isFormComplete" /></td>
                                <td class="checkbox-cell center-column"><input type="checkbox" v-model="form.isQualified" /></td>
                                <td class="checkbox-cell center-column"><input type="checkbox" v-model="form.invTakenHere" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

                <div class="modal-actions">
                    <button type="button" class="secondary" @click="closeModal" :disabled="isSubmitting">Cancel</button>
                    <button type="submit" class="primary" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : 'Edit' }}
                    </button>
                </div>
            </form>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from 'vue';
import { API_PATH } from '@/services/api-path';
import type { playerResults } from '../../../shared/array-types';
import type { AxiosInstance } from 'axios';

const api = inject('$api') as AxiosInstance;

type EditFormModel = {
    id: string;
    bushiNaviId: string;
    playerName: string;
    decklog: string;
    formatCode: string;
    rank: number;
    isSponsored: boolean;
    isFormComplete: boolean;
    isQualified: boolean;
    invTakenHere: boolean;
    regionCode: string;
};

const props = defineProps<{
    player: playerResults;
    formats?: string[];
    regionCode?: string;
}>();

const emit = defineEmits<{
    (event: 'updated'): void;
}>();

const isOpen = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

const form = ref<EditFormModel>({
    id: '',
    bushiNaviId: '',
    playerName: '',
    decklog: '',
    formatCode: '',
    rank: 1,
    isSponsored: false,
    isFormComplete: false,
    isQualified: false,
    invTakenHere: false,
    regionCode: '',
});

const formatOptions = computed(() => {
    if ((props.formats ?? []).length) {
        return props.formats ?? [];
    }
    return props.player?.formatCode ? [props.player.formatCode] : [];
});

const buildFormFromPlayer = (): EditFormModel => {
    return {
        id: props.player.id,
        bushiNaviId: props.player.bushiNaviId,
        playerName: props.player.playerName,
        decklog: props.player.decklog ?? '',
        formatCode: props.player.formatCode,
        rank: props.player.rank,
        isSponsored: props.player.isSponsored,
        isFormComplete: props.player.isFormComplete,
        isQualified: props.player.isQualified,
        invTakenHere: props.player.invTakenHere,
        regionCode: props.regionCode ?? '',
    };
};

const openModal = () => {
    errorMessage.value = '';
    form.value = buildFormFromPlayer();
    isOpen.value = true;
};

const closeModal = () => {
    isOpen.value = false;
};

const save = async () => {
    errorMessage.value = '';
    isSubmitting.value = true;

    try {
        const updatedPlayerResults = await api.put(`${API_PATH.playerResults}/update/${form.value.id}`, form.value, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // ✅ FIX: Validate standard HTTP response success code status
        if (updatedPlayerResults.status !== 200 && updatedPlayerResults.status !== 204) {
            const responseMessage = updatedPlayerResults.data?.message;
            throw new Error(responseMessage || 'Failed to update player results');
        }

        emit('updated');
        closeModal();
    } catch (error: any) {
        console.error('Error updating player results:', error);
        errorMessage.value = error.response?.data?.message || error.message || 'Something went wrong while updating.';
    } finally {
        isSubmitting.value = false;
    }
};

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
    width: min(98vw, 92rem);
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

.form-wrapper {
    width: 100%;
    overflow-x: auto;
    margin-bottom: 1rem;
}

.form-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
    min-width: 74rem;
}

.form-table th {
    text-align: left;
    padding: 0 0.4rem 0.5rem;
    font-weight: 600;
    font-size: 0.92rem;
}

.form-table td {
    padding: 0.25rem 0.4rem;
    vertical-align: top;
}

.form-table input[type='text'],
.form-table select {
    width: 100%;
    min-height: 2rem;
    border: 1px solid #d1d5db;
    border-radius: 0.4rem;
    padding: 0.35rem 0.5rem;
    background: #fff;
}

.form-table select option:disabled {
    color: #9ca3af;
}

.locked-input {
    background: #e5e7eb;
    color: #6b7280;
    border-color: #d1d5db;
    user-select: none;
    pointer-events: none;
    caret-color: transparent;
}

.checkbox-cell {
    text-align: center;
}

.center-column {
    text-align: center;
}

.checkbox-cell input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
    margin: 0.4rem auto 0;
    display: block;
}

.checkbox-cell input[type='checkbox']:disabled {
    opacity: 0.45;
    cursor: not-allowed;
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

.primary {
    border: 1px solid #111827;
    background: #111827;
    color: #fff;
}

.primary:disabled,
.secondary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}
</style>