<template>
    <button class="open-button" @click="openModal">Add Result</button>

    <div v-if="isOpen" class="modal-backdrop" role="presentation">
        <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="add-result-title">
            <header class="modal-header">
                <h2 id="add-result-title">Add Result</h2>
            </header>

            <form class="modal-body" @submit.prevent="handleSave" @keydown.enter.prevent>
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
                                <th scope="col" class="center-column">Actions:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in rows" :key="row.id">
                                <td>
                                    <input type="text" v-model="row.bushiNaviId"
                                        :class="{ 'input-invalid': !!rowErrors[index]?.bushiNaviId }"
                                        @input="validateRowField(index, 'bushiNaviId')"
                                        @blur="validateRowField(index, 'bushiNaviId')" />
                                    <p v-if="rowErrors[index]?.bushiNaviId" class="field-error">{{
                                        rowErrors[index]?.bushiNaviId }}</p>
                                </td>
                                <td>
                                    <input type="text" v-model="row.playerName"
                                        :class="{ 'input-invalid': !!rowErrors[index]?.playerName }"
                                        @input="validateRowField(index, 'playerName')"
                                        @blur="validateRowField(index, 'playerName')" />
                                    <p v-if="rowErrors[index]?.playerName" class="field-error">{{
                                        rowErrors[index]?.playerName }}</p>
                                </td>

                                <td>
                                    <input type="text" v-model="row.decklog" placeholder="Decklog code" />
                                </td>

                                <td>
                                    <select v-model="row.formatCode"
                                        :class="{ 'input-invalid': !!rowErrors[index]?.formatCode }"
                                        @change="onFormatChanged(index)" @blur="validateRowField(index, 'formatCode')">
                                        <option value="" disabled>Select format</option>
                                        <option v-for="format in props.eventDetails?.formats ?? []" :key="format"
                                            :value="format" :disabled="isFormatAtCapacityForRow(format, index)">{{
                                                format }}</option>
                                    </select>
                                    <p v-if="rowErrors[index]?.formatCode" class="field-error">{{
                                        rowErrors[index]?.formatCode }}</p>
                                </td>
                                <td>
                                    <input type="text" :value="props.eventDetails?.regionCode ?? ''"
                                        class="locked-input" readonly tabindex="-1" aria-disabled="true" />
                                </td>
                                <td>
                                    <select v-model="row.rank" :class="{ 'input-invalid': !!rowErrors[index]?.rank }"
                                        @change="onRankChanged(index)" @blur="validateRowField(index, 'rank')">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <p v-if="rowErrors[index]?.rank" class="field-error">{{ rowErrors[index]?.rank }}
                                    </p>
                                </td>
                                <td class="checkbox-cell center-column">
                                    <input type="checkbox" v-model="row.isSponsored" :disabled="row.rank !== '1'"
                                        :aria-disabled="row.rank !== '1'" />
                                </td>
                                <td class="checkbox-cell center-column"><input type="checkbox"
                                        v-model="row.isFormComplete" /></td>
                                <td class="checkbox-cell center-column"><input type="checkbox"
                                        v-model="row.isQualified" /></td>
                                <td class="checkbox-cell center-column"><input type="checkbox"
                                        v-model="row.invTakenHere" /></td>
                                <td class="checkbox-cell row-action-cell center-column">
                                    <button type="button" class="remove-row-button" :disabled="rows.length === 1"
                                        @click="removeRow(index)">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="row-controls">
                    <button type="button" class="secondary" :disabled="rows.length >= 4" @click="addRow">Add
                        Row</button>
                </div>

                <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

                <div class="modal-actions">
                    <button type="button" class="secondary" @click="closeModal">Cancel</button>
                    <button type="submit" class="primary" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Adding...' : 'Add All' }}
                    </button>
                </div>
            </form>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue';
import type { IEventDetailsSummary, playerResults } from '../../../shared/array-types';
import type { AxiosInstance } from 'axios';

import { useEventTimelineStore } from '@/stores/eventTimeline';
import { API_PATH } from '@/services/api-path';

const api = inject('$api') as AxiosInstance;

type RowModel = {
    id: number;
    bushiNaviId: string;
    playerName: string;
    decklog: string;
    formatCode: string;
    rank: string;
    isSponsored: boolean;
    isFormComplete: boolean;
    isQualified: boolean;
    invTakenHere: boolean;
};

type RowErrors = {
    bushiNaviId?: string;
    playerName?: string;
    formatCode?: string;
    rank?: string;
};

type CreateResultPayload = {
    bushiNaviId: string;
    playerName: string;
    decklog: string;
    formatCode: string;
    rank: number;
    isSponsored: boolean;
    isFormComplete: boolean;
    isQualified: boolean;
    eventTimelineYear: string;
    eventType: string;
    eventSeries: string;
    regionCode: string;
    invTakenHere: boolean;
};

const eventTimelineStore = useEventTimelineStore();
const emit = defineEmits<{
    (event: 'saved'): void;
    (event: 'checkConflicts', payloads: { bushiNaviId: string; playerName: string; formatCode: string }[]): void;
}>();

const props = defineProps<{
    eventDetails?: IEventDetailsSummary;
    existingResults?: playerResults[];
}>();

const isOpen = ref(false);
const errorMessage = ref('');
const isSubmitting = ref(false);
const nextRowId = ref(1);
const rows = ref<RowModel[]>([]);
const rowErrors = ref<RowErrors[]>([]);

const createEmptyRow = (): RowModel => {
    const row: RowModel = {
        id: nextRowId.value,
        bushiNaviId: '',
        playerName: '',
        decklog: '',
        formatCode: '',
        rank: '1',
        isSponsored: false,
        isFormComplete: false,
        isQualified: false,
        invTakenHere: false,
    };

    nextRowId.value += 1;
    return row;
};

const resetModalState = () => {
    errorMessage.value = '';
    rows.value = [createEmptyRow()];
    rowErrors.value = [{}];
};

const openModal = () => {
    resetModalState();
    isOpen.value = true;
};

const closeModal = () => {
    resetModalState();
    isOpen.value = false;
};

const addRow = () => {
    if (rows.value.length >= 4) {
        return;
    }

    rows.value.push(createEmptyRow());
    rowErrors.value.push({});
};

const removeRow = (index: number) => {
    if (rows.value.length === 1) {
        return;
    }

    rows.value.splice(index, 1);
    rowErrors.value.splice(index, 1);
};

const validateRow = (row: RowModel): RowErrors => {
    const errors: RowErrors = {};

    if (!row.bushiNaviId.trim()) {
        errors.bushiNaviId = 'Bushi Navi ID is required.';
    }

    if (!row.playerName.trim()) {
        errors.playerName = 'Player name is required.';
    }

    if (!row.formatCode.trim()) {
        errors.formatCode = 'Format is required.';
    }

    const rankNumber = Number(row.rank);
    if (!Number.isInteger(rankNumber) || rankNumber < 1 || rankNumber > 4) {
        errors.rank = 'Rank must be between 1 and 4.';
    }

    return errors;
};

const validateRowField = (index: number, field: keyof RowErrors) => {
    const row = rows.value[index];
    if (!row) {
        return;
    }

    const rowValidation = validateRow(row);
    const fieldMessage = rowValidation[field];

    if (!rowErrors.value[index]) {
        rowErrors.value[index] = {};
    }

    if (fieldMessage) {
        rowErrors.value[index][field] = fieldMessage;
        return;
    }

    delete rowErrors.value[index][field];
};

const validateAllRows = (): boolean => {
    const nextErrors = rows.value.map((row) => validateRow(row));
    rowErrors.value = nextErrors;
    return nextErrors.every((rowError) => Object.keys(rowError).length === 0);
};

const getExistingCountForFormat = (formatCode: string): number => {
    return (props.existingResults ?? []).filter((result) => result.formatCode === formatCode).length;
};

const getDraftCountForFormat = (formatCode: string, excludeRowIndex?: number): number => {
    return rows.value.filter((row, index) => {
        if (excludeRowIndex !== undefined && index === excludeRowIndex) {
            return false;
        }

        return row.formatCode === formatCode;
    }).length;
};

const isFormatAtCapacityForRow = (formatCode: string, rowIndex: number): boolean => {
    if (!formatCode.trim()) {
        return false;
    }

    const reservedCount = getExistingCountForFormat(formatCode) + getDraftCountForFormat(formatCode, rowIndex);
    const isCurrentSelection = rows.value[rowIndex]?.formatCode === formatCode;
    return reservedCount >= 4 && !isCurrentSelection;
};

const onFormatChanged = (index: number) => {
    validateRowField(index, 'formatCode');
};

const onRankChanged = (index: number) => {
    const row = rows.value[index];
    if (!row) {
        return;
    }

    if (row.rank !== '1') {
        row.isSponsored = false;
    }

    validateRowField(index, 'rank');
};

const validateGlobalContext = (): string | null => {
    if (!(props.eventDetails?.regionCode ?? '').trim()) return 'Region code is required.';
    if (!(props.eventDetails?.eventType ?? '').trim() || !(props.eventDetails?.name ?? '').trim()) {
        return 'Event details are still loading. Please try again.';
    }
    if (!eventTimelineStore.eventTimelineYear.trim()) return 'Event timeline year is missing.';

    return null;
};

const applyCrossRowConstraints = (): boolean => {
    let hasError = false;

    const existingByFormatRank = new Set(
        (props.existingResults ?? []).map((result) => `${result.formatCode}::${result.rank}`),
    );

    const seenDraftRank = new Map<string, number>();
    const totalByFormat = new Map<string, number>();

    for (const existing of props.existingResults ?? []) {
        const current = totalByFormat.get(existing.formatCode) ?? 0;
        totalByFormat.set(existing.formatCode, current + 1);
    }

    rows.value.forEach((row, index) => {
        if (!rowErrors.value[index]) {
            rowErrors.value[index] = {};
        }

        const currentRowErrors = rowErrors.value[index];
        if (!currentRowErrors) {
            return;
        }

        const formatCode = row.formatCode;
        const rank = Number(row.rank);

        if (!formatCode) {
            return;
        }

        const currentFormatCount = totalByFormat.get(formatCode) ?? 0;
        totalByFormat.set(formatCode, currentFormatCount + 1);

        if ((totalByFormat.get(formatCode) ?? 0) > 4) {
            currentRowErrors.formatCode = `${formatCode} already has 4 records.`;
            hasError = true;
        }

        const key = `${formatCode}::${rank}`;
        if (existingByFormatRank.has(key)) {
            currentRowErrors.rank = `Rank ${row.rank} is already used for ${formatCode}.`;
            hasError = true;
            return;
        }

        const firstIndex = seenDraftRank.get(key);
        if (firstIndex !== undefined) {
            currentRowErrors.rank = `Rank ${row.rank} is duplicated in this submission.`;

            if (!rowErrors.value[firstIndex]) {
                rowErrors.value[firstIndex] = {};
            }

            const firstRowErrors = rowErrors.value[firstIndex];
            if (firstRowErrors) {
                firstRowErrors.rank = `Rank ${row.rank} is duplicated in this submission.`;
            }

            hasError = true;
            return;
        }

        seenDraftRank.set(key, index);
    });

    return !hasError;
};

const buildPayload = (row: RowModel): CreateResultPayload => {
    return {
        bushiNaviId: row.bushiNaviId.trim(),
        playerName: row.playerName.trim(),
        decklog: row.decklog.trim(),
        formatCode: row.formatCode,
        rank: Number(row.rank),
        isSponsored: row.isSponsored,
        isFormComplete: row.isFormComplete,
        isQualified: row.isQualified,
        eventTimelineYear: eventTimelineStore.eventTimelineYear,
        eventType: props.eventDetails?.eventType ?? '',
        eventSeries: props.eventDetails?.name ?? '',
        regionCode: props.eventDetails?.regionCode ?? '',
        invTakenHere: row.invTakenHere,
    };
};

const handleSave = async () => {
    errorMessage.value = '';

    const areRowsValid = validateAllRows();
    if (!areRowsValid) {
        errorMessage.value = 'Please fix the highlighted fields.';
        return;
    }

    const globalValidationError = validateGlobalContext();
    if (globalValidationError) {
        errorMessage.value = globalValidationError;
        return;
    }

    const areCrossRowRulesValid = applyCrossRowConstraints();
    if (!areCrossRowRulesValid) {
        errorMessage.value = 'Please resolve duplicate rank or format capacity issues.';
        return;
    }

    try {
        isSubmitting.value = true;

        for (const [index, row] of rows.value.entries()) {
            const payload = buildPayload(row);
            const response = await api.post(`${API_PATH.playerResults}/create`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200 && response.status !== 201) {
                const responseMessage = response.data?.message;
                throw new Error(`Row ${index + 1}: ${responseMessage || 'Failed to add result'}`);
            }
        }

        const savedRowsSummary = rows.value.map(row => ({
            bushiNaviId: row.bushiNaviId.trim(),
            playerName: row.playerName.trim(),
            formatCode: row.formatCode
        }));

        closeModal();
        emit('saved');
        emit('checkConflicts', savedRowsSummary);
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Something went wrong while adding results.';
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
    width: min(99vw, 104rem);
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

.center-column {
    text-align: center;
}

.row-action-cell.center-column {
    display: flex;
    align-items: center;
    justify-content: center;
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

.row-action-cell {
    min-width: 6rem;
}

.remove-row-button {
    border: 1px solid #d1d5db;
    background: #fff;
    border-radius: 0.45rem;
    padding: 0.32rem 0.55rem;
    cursor: pointer;
}

.remove-row-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.row-controls {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.9rem;
}

.row-controls button {
    border-radius: 0.5rem;
    padding: 0.45rem 0.8rem;
    cursor: pointer;
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

.primary:disabled,
.secondary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}
</style>