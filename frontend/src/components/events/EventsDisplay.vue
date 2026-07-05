<template>
    <main>
        <div class="filter-wrapper">
            <SearchForm @search="handleSearch" />
            <div class="filter-separator"> | </div>
            <RadioRegion @filterRegion="handleFilterRegion" />

        </div>

        <div class="data-wrapper">
            <div class="data-scroll">
                <section v-for="group in filteredEventsSummary" :key="group.eventType" class="event-group">
                    <h2>{{ group.eventType }}</h2>
                    <ul class="summary-grid">
                        <li v-for="summary in group.items" :key="summary.id" class="summary-card">
                            <router-link :to="{ name: 'event-details', params: { id: summary.id }}" class="summary-card__link">
                                <div class="summary-card__title">{{ summary.event }}</div>
                                <div class="summary-card__meta">
                                    <span class="summary-card__date">{{ formatDate(summary.date) }}</span>
                                    <span class="summary-card__region">{{ summary.region }}</span>
                                </div>
                                <div class="summary-card__type">{{ summary.eventType }}</div>
                            </router-link>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </main>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { type IEventSummaryArray } from '@/../shared/array-types';
import { formatDate } from '@/../shared/helperfunctions';

import SearchForm from '@/components/events/SearchForm.vue';
import RadioRegion from '@/components/events/RadioRegion.vue';

type GroupedEventsSummary = {
    eventType: string;
    items: IEventSummaryArray;
}

const searchFilter = ref('');
const regionFilter = ref('');

const props = defineProps<{ groupedEventsSummary: GroupedEventsSummary[] }>();

const filteredEventsSummary = computed(() => {
    let groups = props.groupedEventsSummary;

    const filterValue = searchFilter.value.trim().toLowerCase();

    switch (regionFilter.value) {
        case 'EU':
            groups = groups.map(group => ({
                ...group,
                items: group.items.filter(item => item.region === 'EU'),
            })).filter(group => group.items.length > 0);
            break;
        case 'NALA':
            groups = groups.map(group => ({
                ...group,
                items: group.items.filter(item => item.region === 'NALA'),
            })).filter(group => group.items.length > 0);
            break;
        case 'AO':
            groups = groups.map(group => ({
                ...group,
                items: group.items.filter(item => item.region === 'AO'),
            })).filter(group => group.items.length > 0);
            break;
    }

    if (filterValue !== '') {
        groups = groups
            .map(group => ({
                ...group,
                items: group.items.filter(item => item.event.toLowerCase().includes(filterValue)),
            }))
            .filter(group => group.items.length > 0);
    }

    return groups;
});

const handleSearch = (search: string) => {
    searchFilter.value = search;
};

const handleFilterRegion = (filterRegion: string) => {
    regionFilter.value = filterRegion;
};

</script>

<style lang="scss" scoped>
.filter-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    background: var(--surface, #ffffff);
    border-radius: 1rem;
    border: 1px solid rgba(15, 23, 42, 0.08);
    padding: 1rem;
    margin-bottom: 1.5rem;
}

.filter-separator {
    margin: 0 1rem;
    color: var(--text-muted, #475569);
    font-size: 0.92rem;
}

.data-wrapper {
    width: 100%;
    min-width: 0;
    background: var(--surface, #f8fafc);
    border-radius: 1rem;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 18px 40px rgba(40, 43, 51, 0.04);
    padding: 1rem;
    min-height: 60vh;
    max-height: 70vh;
    overflow: hidden;
}

.data-scroll {
    height: 100%;
    overflow-y: auto;
    padding-right: 0.5rem;
    min-width: 0;
}

.event-group {
    margin-bottom: 1.75rem;
}

.event-group:last-child {
    margin-bottom: 0;
}

.event-group h2 {
    margin-bottom: 0.8rem;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-strong, #0f172a);
    text-transform: capitalize;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
}

@media (max-width: 1100px) {
    .summary-grid {
        grid-template-columns: repeat(2, minmax(220px, 1fr));
    }
}

@media (max-width: 760px) {
    .summary-grid {
        grid-template-columns: 1fr;
    }
}

.summary-card {
    background: var(--card, #ffffff);
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card__link {
    text-decoration: none;
}

.summary-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 35px rgba(15, 23, 42, 0.08);
}

.summary-card__title {
    font-weight: 700;
    line-height: 1.3;
    color: var(--text-strong, #0f172a);
}

.summary-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    font-size: 0.92rem;
    color: var(--text-muted, #475569);
}

.summary-card__type {
    align-self: flex-start;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted, #475569);
}
</style>