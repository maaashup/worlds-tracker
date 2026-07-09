<script setup lang="ts">
import TournamentTimeline from '@/components/tournament-timeline/TournamentTimeline.vue';
import AlertDashboard from '@/components/alertdashboard/AlertDashboard.vue';

</script>

<template>
  <main>
    <div>
      <h1>Home Dashboard</h1>
      <p>Simple views, important information at a glance</p>
      <br>
      <TournamentTimeline />
      <br>
      <AlertDashboard />
    </div>
  </main>
</template>

<style scoped></style>