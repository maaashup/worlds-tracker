<template>
    <main>
        <div class="top-container">
            <h1> {{ eventDetails?.eventType}} {{ eventDetails?.name}} ({{ eventDetails?.regionCode }})</h1>
            <h4>{{ formatDate(eventDetails?.eventDate as string) }}</h4>
            <button>Add Event</button>
        </div>
        <div class="main-container">
            
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { formatDate } from '@/../shared/helperfunctions';

import { API_PATH, API_BASE_URL } from '@/services/api-path';
import type { IEventDetailsSummary, playerResults } from '../../shared/array-types';

const route = useRoute();

const eventId = String(route.params.id ?? '');


onMounted(async () => {
    try {
        const params = new URLSearchParams({
            eventId,
        });

        const response = await fetch(`${API_BASE_URL}/${API_PATH.playerResults}/results?${params.toString()}`);
        if (!response.ok) throw new Error(await response.text());

        const payload = await response.json();
        playerSummary.value = payload.data ?? [];

    } catch (err) {
        console.error('Event fetch failed', err);
    }
});

onMounted(async () => {
    // Fetch formats for the event
    try {
        const params = new URLSearchParams({
            eventId,
        });

        const response = await fetch(`${API_BASE_URL}/${API_PATH.eventseries}/summary?${params.toString()}`);
        if (!response.ok) throw new Error(await response.text());

        const payload = await response.json();
        eventDetails.value = payload.data ?? [];
    } catch (err) {
        console.error('Formats fetch failed', err);
    }
});

const playerSummary = ref<playerResults[]>([]);
const eventDetails = ref<IEventDetailsSummary>();


</script>

<style lang="scss" scoped></style>