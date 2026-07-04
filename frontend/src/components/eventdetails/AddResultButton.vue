<template>
    <button class="open-button" @click="openModal">Add Result</button>

    <div v-if="isOpen" class="modal-backdrop" role="presentation" @click.self="closeModal">
        <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="add-result-title">
            <header class="modal-header">
                <h2 id="add-result-title">Add Result</h2>
            </header>

            <form class="modal-body" @submit.prevent="handleSave">
                <div class="form-wrapper">
                    <table class="form-table">
                        <thead>
                            <tr>
                                <th scope="col">Bushi Navi ID:</th>
                                <th scope="col">Player Name:</th>
                                <th scope="col">Format:</th>
                                <th scope="col">Region:</th>
                                <th scope="col">Rank:</th>
                                <th scope="col">Sponsored:</th>
                                <th scope="col">Form Complete:</th>
                                <th scope="col">Qualified:</th>
                                <th scope="col">Invite Accepted Here:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        name="bushiNaviId"
                                        required
                                        :class="{ 'input-invalid': fieldErrors.bushiNaviId }"
                                        @input="validateInputField('bushiNaviId', $event)"
                                        @blur="validateInputField('bushiNaviId', $event)"
                                    />
                                    <p v-if="fieldErrors.bushiNaviId" class="field-error">{{ fieldErrors.bushiNaviId }}</p>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="playerName"
                                        required
                                        :class="{ 'input-invalid': fieldErrors.playerName }"
                                        @input="validateInputField('playerName', $event)"
                                        @blur="validateInputField('playerName', $event)"
                                    />
                                    <p v-if="fieldErrors.playerName" class="field-error">{{ fieldErrors.playerName }}</p>
                                </td>
                                <td>
                                    <select
                                        name="format"
                                        required
                                        v-model="selectedFormat"
                                        :class="{ 'input-invalid': fieldErrors.format }"
                                        @change="validateSelectField('format', $event)"
                                        @blur="validateSelectField('format', $event)"
                                    >
                                        <option value="" disabled>Select format</option>
                                        <option
                                            v-for="format in props.eventDetails?.formats ?? []"
                                            :key="format"
                                            :value="format"
                                            :disabled="isFormatAtCapacity(format)"
                                        >{{
                                            format }}</option>
                                    </select>
                                    <p v-if="fieldErrors.format" class="field-error">{{ fieldErrors.format }}</p>
                                </td>
                                <td>
                                    <input type="text" name="regionCode" :value="props.eventDetails?.regionCode ?? ''" class="locked-input"
                                        readonly tabindex="-1" aria-disabled="true" />
                                </td>
                                <td>
                                    <select
                                        name="rank"
                                        required
                                        v-model="selectedRank"
                                        :class="{ 'input-invalid': fieldErrors.rank }"
                                        @change="validateSelectField('rank', $event)"
                                        @blur="validateSelectField('rank', $event)"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <p v-if="fieldErrors.rank" class="field-error">{{ fieldErrors.rank }}</p>
                                </td>
                                <td class="checkbox-cell">
                                    <input
                                        type="checkbox"
                                        name="isSponsored"
                                        v-model="isSponsoredChecked"
                                        :disabled="selectedRank !== '1'"
                                        :aria-disabled="selectedRank !== '1'"
                                    />
                                </td>
                                <td class="checkbox-cell"><input type="checkbox" name="isFormComplete" /></td>
                                <td class="checkbox-cell"><input type="checkbox" name="isQualified" /></td>
                                <td class="checkbox-cell"><input type="checkbox" name="invTakenHere" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

                <div class="modal-actions">
                    <button type="button" class="secondary" @click="closeModal">Cancel</button>
                    <button type="submit" class="primary" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Adding...' : 'Add' }}
                    </button>
                </div>
            </form>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { IEventDetailsSummary, playerResults } from '../../../shared/array-types';

import { useEventTimelineStore } from '@/stores/eventTimeline';
import { API_BASE_URL, API_PATH } from '@/services/api-path';

const eventTimelineStore = useEventTimelineStore();
const emit = defineEmits<{
    (event: 'saved'): void;
}>();

const props = defineProps<{
    eventDetails?: IEventDetailsSummary;
    existingResults?: playerResults[];
}>();

const isOpen = ref(false);
const errorMessage = ref('');
const isSubmitting = ref(false);
const fieldErrors = ref<FieldErrors>({});
const selectedFormat = ref('');
const selectedRank = ref('1');
const isSponsoredChecked = ref(false);


type FieldErrors = {
    bushiNaviId?: string;
    playerName?: string;
    format?: string;
    rank?: string;
};

type CreateResultPayload = {
    bushiNaviId: string;
    playerName: string;
    formatCode: string;
    rank: string;
    isSponsored: boolean;
    isFormComplete: boolean;
    isQualified: boolean;
    eventTimelineYear: string;
    eventType: string;
    eventSeries: string;
    regionCode: string;
    invTakenHere: boolean;
};

const validatePayload = (payload: CreateResultPayload): string | null => {
    if (!payload.regionCode.trim()) return 'Region code is required.';
    if (!payload.eventType.trim() || !payload.eventSeries.trim()) return 'Event details are still loading. Please try again.';
    if (!payload.eventTimelineYear.trim()) return 'Event timeline year is missing.';

    return null;
};

const validateFieldValue = (field: keyof FieldErrors, value: string): string => {
    if (field === 'bushiNaviId') {
        return value.trim() ? '' : 'Bushi Navi ID is required.';
    }

    if (field === 'playerName') {
        return value.trim() ? '' : 'Player name is required.';
    }

    if (field === 'format') {
        return value.trim() ? '' : 'Format is required.';
    }

    if (field === 'rank') {
        const rankNumber = Number(value);
        return Number.isInteger(rankNumber) && rankNumber > 0 ? '' : 'Rank must be at least 1.';
    }

    return '';
};

const setFieldError = (field: keyof FieldErrors, message: string) => {
    if (message) {
        fieldErrors.value[field] = message;
        return;
    }

    delete fieldErrors.value[field];
};

const validateInputField = (field: 'bushiNaviId' | 'playerName', event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    setFieldError(field, validateFieldValue(field, value));
};

const validateSelectField = (field: 'format' | 'rank', event: Event) => {
    const value = (event.target as HTMLSelectElement).value;
    setFieldError(field, validateFieldValue(field, value));
};

const validateAllFields = (formData: FormData): boolean => {
    const nextErrors: FieldErrors = {};

    const bushiNaviIdMessage = validateFieldValue('bushiNaviId', String(formData.get('bushiNaviId') ?? ''));
    if (bushiNaviIdMessage) nextErrors.bushiNaviId = bushiNaviIdMessage;

    const playerNameMessage = validateFieldValue('playerName', String(formData.get('playerName') ?? ''));
    if (playerNameMessage) nextErrors.playerName = playerNameMessage;

    const formatMessage = validateFieldValue('format', String(formData.get('format') ?? ''));
    if (formatMessage) nextErrors.format = formatMessage;

    const rankMessage = validateFieldValue('rank', String(formData.get('rank') ?? ''));
    if (rankMessage) nextErrors.rank = rankMessage;

    fieldErrors.value = nextErrors;
    return Object.keys(nextErrors).length === 0;
};

const hasDuplicateRankForFormat = (formatCode: string, rank: string): boolean => {
    const rankNumber = Number(rank);

    return (props.existingResults ?? []).some((result) => {
        return result.formatCode === formatCode && result.rank === rankNumber;
    });
};

const getFormatRecordCount = (formatCode: string): number => {
    return (props.existingResults ?? []).filter((result) => result.formatCode === formatCode).length;
};

const isFormatAtCapacity = (formatCode: string): boolean => {
    return getFormatRecordCount(formatCode) >= 4;
};

const openModal = () => {
    errorMessage.value = '';
    fieldErrors.value = {};
    selectedFormat.value = '';
    selectedRank.value = '1';
    isSponsoredChecked.value = false;
    isOpen.value = true;
};

const closeModal = () => {
    errorMessage.value = '';
    fieldErrors.value = {};
    selectedFormat.value = '';
    selectedRank.value = '1';
    isSponsoredChecked.value = false;
    isOpen.value = false;
};

watch(selectedRank, (rank) => {
    if (rank !== '1') {
        isSponsoredChecked.value = false;
    }
});

const handleSave = async (event: Event) => {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    errorMessage.value = '';

    const areInlineFieldsValid = validateAllFields(formData);
    if (!areInlineFieldsValid) {
        errorMessage.value = 'Please fix the highlighted fields.';
        return;
    }

    const payload = {
        bushiNaviId: formData.get('bushiNaviId') as string,
        playerName: formData.get('playerName') as string,
        formatCode: formData.get('format') as string,
        rank: formData.get('rank') as string,
        isSponsored: formData.get('isSponsored') === 'on',
        isFormComplete: formData.get('isFormComplete') === 'on',
        isQualified: formData.get('isQualified') === 'on',
        eventTimelineYear: eventTimelineStore.eventTimelineYear,
        eventType: props.eventDetails?.eventType ?? '',
        eventSeries: props.eventDetails?.name ?? '',
        regionCode: formData.get('regionCode') as string,
        invTakenHere: formData.get('invTakenHere') === 'on',
    };

    if (isFormatAtCapacity(payload.formatCode)) {
        const fullFormatMessage = `${payload.formatCode} already has 4 records.`;
        setFieldError('format', fullFormatMessage);
        errorMessage.value = fullFormatMessage;
        return;
    }

    if (hasDuplicateRankForFormat(payload.formatCode, payload.rank)) {
        const duplicateMessage = `Rank ${payload.rank} is already used for ${payload.formatCode}.`;
        setFieldError('rank', duplicateMessage);
        errorMessage.value = duplicateMessage;
        return;
    }

    const validationError = validatePayload(payload);
    if (validationError) {
        errorMessage.value = validationError;
        return;
    }

    try {
        isSubmitting.value = true;

        const response = await fetch(`${API_BASE_URL}/${API_PATH.playerResults}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseMessage = await response.text();
            throw new Error(responseMessage || 'Failed to add result');
        }

        closeModal();
        emit('saved');
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Something went wrong while adding the result.';
    } finally {
        isSubmitting.value = false;
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
    width: min(96vw, 84rem);
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
    min-width: 62rem;
}

.form-table th:nth-child(1),
.form-table th:nth-child(2),
.form-table td:nth-child(1),
.form-table td:nth-child(2) {
    width: 22%;
}

.form-table th:nth-child(3),
.form-table th:nth-child(4),
.form-table th:nth-child(5),
.form-table td:nth-child(3),
.form-table td:nth-child(4),
.form-table td:nth-child(5) {
    width: 12%;
}

.form-table th {
    text-align: left;
    padding: 0 0.4rem 0.5rem;
    font-weight: 600;
    font-size: 0.92rem;
}

.form-table td {
    padding: 0.25rem 0.4rem;
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

.input-invalid {
    border-color: #dc2626 !important;
    background: #fff7f7 !important;
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

.checkbox-cell input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
    margin: 0 auto;
    display: block;
}

.checkbox-cell input[type='checkbox']:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.helper-text {
    color: #4b5563;
    margin: 0 0 1rem;
}

.form-error {
    margin: 0 0 0.8rem;
    padding: 0.55rem 0.7rem;
    border: 1px solid #fca5a5;
    background: #fef2f2;
    color: #b91c1c;
    border-radius: 0.4rem;
    font-size: 0.9rem;
}

.field-error {
    margin: 0.2rem 0 0;
    color: #b91c1c;
    font-size: 0.75rem;
    line-height: 1.25;
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

.primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}
</style>