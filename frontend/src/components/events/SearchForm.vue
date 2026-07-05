<template>
    <form class="form-wrapper" @submit.prevent>
        <div class="search-bar-wrapper">
            <input type="text" @input="search" placeholder="Search Event" class="search-bar"/>
        </div>
    </form>

</template>

<script setup lang="ts">

const emit = defineEmits(['search']);

const search = (event: Event) => {
    emit('search', (event.target as HTMLInputElement)?.value);
}

</script>

<style lang="scss" scoped>
.form-wrapper {
    display: flex;
    align-items: center;
}

.search-bar {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    border: 1px solid rgba(98, 99, 100, 0.493);
    color: gray;
    font-size: 1rem;
    background-color: var(--light);
}

.search-bar:focus {
    text-decoration: none;
    outline: 1px solid rgba(58, 59, 59, 0.493);
}

</style>