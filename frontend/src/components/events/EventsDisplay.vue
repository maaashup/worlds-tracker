<template>
    <main>
        <div class="filter-wrapper">Filters here</div>
        <div class="data-wrapper">
            <li v-for="event in events" :key="event.id">
                {{ event.name }}
            </li>
        </div>
    </main>

</template>

<script setup lang="ts">
import { type EventSeries } from '@/../shared/array-types';

defineProps<{events: EventSeries[]}>();

</script>



<style lang="scss" scoped>

</style>