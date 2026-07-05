import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useEventTimelineStore = defineStore('eventTimeline', () => {
    const eventTimelineYear = ref('2026 - 2027');

    return {
        eventTimelineYear,
    };
});
