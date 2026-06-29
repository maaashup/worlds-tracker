<template>
    <main>
        <div class="filter-wrapper">Filters here</div>
        <div class="data-wrapper">
           <section v-for="group in groupedEventsSummary" :key="group.eventType">
                <h2>{{ group.eventType }}</h2>
                <ul>
                    <li v-for="summary in group.items" :key="summary.id">
                        {{ summary.event }}
                        {{ summary.date }}
                        {{ summary.region }}
                        {{ summary.eventType }}
                    </li>
                </ul>
           </section>
        </div>
    </main>

</template>

<script setup lang="ts">
import { type IEventSummaryArray } from '@/../shared/array-types';

type GroupedEventsSummary = {
    eventType: string;
    items: IEventSummaryArray;
}

defineProps<{groupedEventsSummary: GroupedEventsSummary[]}>();

</script>



<style lang="scss" scoped>

</style>