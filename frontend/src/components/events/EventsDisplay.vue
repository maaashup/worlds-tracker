<template>
    <main>
        <div class="filter-wrapper">Filters here</div>
        <div class="data-wrapper">
            <li v-for="summary in eventsSummary" :key="summary.id">
                {{ summary.event }}
                {{ summary.date }}
                {{ summary.region }}
                {{ summary.eventType }}
            </li>
        </div>
    </main>

</template>

<script setup lang="ts">
import { type IEventSummaryArray } from '@/../shared/array-types';

defineProps<{eventsSummary: IEventSummaryArray}>();

</script>



<style lang="scss" scoped>

</style>