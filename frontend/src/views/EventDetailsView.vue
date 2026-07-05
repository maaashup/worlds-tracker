<template>
    <main>
        <div class="top-container">
            <h1> {{ eventDetails?.eventType }} {{ eventDetails?.name }} ({{ eventDetails?.regionCode }})</h1>
            <h4>{{ formatDate(eventDetails?.eventDate as string) }}</h4>
            <div class="button-container">
                <AddResultButton :eventDetails="eventDetails" :existingResults="playerSummary" @saved="loadPlayerResults" />
            </div>
        </div>


        <div class="main-container">
            <div class="data-container">
                <article
                    v-for="format in eventDetails?.formats ?? []"
                    :key="format"
                    class="format-card"
                    :class="{ 'format-card--empty': !playersByFormat[format]?.length }"
                >
                    <h3 class="format-title">{{ format }}</h3>

                    <div v-if="playersByFormat[format]?.length" class="table-wrapper">
                        <table class="player-table">
                            <thead>
                                <tr>
                                    <th scope="col">Bushi Navi ID</th>
                                    <th scope="col">Player Name</th>
                                    <th scope="col">Decklog</th>
                                    <th scope="col">Rank</th>
                                    <th scope="col">Sponsored</th>
                                    <th scope="col">Form Complete</th>
                                    <th scope="col">Qualified</th>
                                    <th scope="col">Invite Accepted Here</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="player in playersByFormat[format]" :key="player.id">
                                    <td>{{ player.bushiNaviId }}</td>
                                    <td>{{ player.playerName }}</td>
                                    <td>
                                        <a
                                            v-if="player.decklog"
                                            :href="getDecklogUrl(player.decklog)"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >{{ player.decklog }}</a>
                                        <span v-else>N/A</span>
                                    </td>
                                    <td>{{ player.rank }}</td>
                                    <td>{{ player.isSponsored ? 'Yes' : 'No' }}</td>
                                    <td>{{ player.isFormComplete ? 'Yes' : 'No' }}</td>
                                    <td>{{ player.isQualified ? 'Yes' : 'No' }}</td>
                                    <td>{{ player.invTakenHere ? 'Yes' : 'No' }}</td>
                                    <td>
                                        <EditResultButton
                                            :player="player"
                                            :formats="eventDetails?.formats ?? []"
                                            :regionCode="eventDetails?.regionCode ?? ''"
                                            @updated="loadPlayerResults"
                                        />
                                    </td>
                                    <td><DeleteResultButton :player="player" @deleted="loadPlayerResults" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p v-else class="empty-state">No player results found for this format.</p>
                </article>
            </div>

        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate } from '@/../shared/helperfunctions';


import AddResultButton from '@/components/eventdetails/AddResultButton.vue';
import EditResultButton from '@/components/eventdetails/EditResultButton.vue';
import DeleteResultButton from '@/components/eventdetails/DeleteResultButton.vue';

import { API_PATH, API_BASE_URL } from '@/services/api-path';

import type { IEventDetailsSummary, playerResults } from '../../shared/array-types';

const DECKLOG_BASE_URL = 'https://decklog-en.bushiroad.com/view/';

const route = useRoute();

const eventId = String(route.params.id ?? '');
const playerSummary = ref<playerResults[]>([]);
const eventDetails = ref<IEventDetailsSummary>();

const loadPlayerResults = async () => {
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
};

const loadEventDetails = async () => {
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
};

onMounted(async () => {
    await Promise.all([
        loadPlayerResults(),
        loadEventDetails(),
    ]);
});

const getDecklogUrl = (decklog: string | null) => {
    if (!decklog) {
        return '';
    }

    return `${DECKLOG_BASE_URL}${decklog}`;
};

const playersByFormat = computed<Record<string, playerResults[]>>(() => {
    const grouped: Record<string, playerResults[]> = {};

    for (const player of playerSummary.value) {
        const formatPlayers = grouped[player.formatCode] ?? [];
        formatPlayers.push(player);
        grouped[player.formatCode] = formatPlayers.sort((left, right) => left.rank - right.rank);
    }

    return grouped;
});


</script>

<style lang="scss" scoped>

.button-container {
    display: flex;
    justify-content: flex-end;
    position: relative;
    top: -3rem;
}

.data-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}

.format-card {
    border: 1px solid #d9d9d9;
    border-radius: 0.75rem;
    padding: 1rem;
    background: #fff;
}

.format-card--empty {
    display: flex;
    flex-direction: column;
    min-height: 18rem;
}

.format-title {
    margin: 0 0 0.75rem;
}

.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.player-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 520px;
}

.player-table th,
.player-table td {
    padding: 0.45rem 0.5rem;
    border-bottom: 1px solid #efefef;
    text-align: left;
    font-size: 0.92rem;
}

.player-table th {
    font-weight: 700;
    white-space: nowrap;
}

.empty-state {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.format-card--empty .empty-state {
    flex: 1;
}

@media (max-width: 768px) {
    .data-container {
        grid-template-columns: 1fr;
    }
}
</style>