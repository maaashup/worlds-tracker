<template>
    <main>
        <div class="filter-wrapper">Filters here</div>
        <div class="data-wrapper">
            <div class="data-scroll">
                <section v-for="group in groupedEventsSummary" :key="group.eventType" class="event-group">
                    <h2>{{ group.eventType }}</h2>
                    <ul class="summary-grid">
                        <li v-for="summary in group.items" :key="summary.id" class="summary-card">
                            <div class="summary-card__title">{{ summary.event }}</div>
                            <div class="summary-card__meta">
                                <span class="summary-card__date">{{ formatDate(summary.date) }}</span>
                                <span class="summary-card__region">{{ summary.region }}</span>
                            </div>
                            <div class="summary-card__type">{{ summary.eventType }}</div>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </main>

</template>

<script setup lang="ts">
import { type IEventSummaryArray } from '@/../shared/array-types';

type GroupedEventsSummary = {
    eventType: string;
    items: IEventSummaryArray;
}

defineProps<{ groupedEventsSummary: GroupedEventsSummary[] }>();

const formatDate = (date: string) => {

    const dateObj = new Date(date);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-GB', { month: 'long' });
    const year = dateObj.getFullYear();

    const rule = new Intl.PluralRules('en-GB', { type: 'ordinal' });

    const suffixes: Record<Intl.LDMLPluralRule, string> = {
        zero: 'th',
        one: 'st',
        two: 'nd',
        few: 'rd',
        many: 'th',
        other: 'th'
    };

    const suffix = suffixes[rule.select(day)];

    return `${day}${suffix} ${month}, ${year}`;
};

</script>

<style lang="scss" scoped>
.filter-wrapper {
    margin-bottom: 1.5rem;
}

.data-wrapper {
    width: 100%;
    min-width: 0;
    background: var(--surface, #f8fafc);
    border-radius: 1rem;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.04);
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