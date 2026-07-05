<template>
    <div class="radio-wrapper">
        <label>
            <input type="radio" name="show" value="all" checked @change="filterRegion"/>
            <span>Show All</span>
        </label>

        <label>
            <input type="radio" name="show" value="EU" @change="filterRegion"/>
            <span>EU</span>
        </label>

        <label>
            <input type="radio" name="show" value="NALA" @change="filterRegion"/>
            <span>NALA</span>
        </label>

        <label>
            <input type="radio" name="show" value="AO" @change="filterRegion"/>
            <span>AO</span>
        </label>
    </div>

</template>

<script setup lang="ts">
const emit = defineEmits(['filterRegion']);

const filterRegion = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('filterRegion', target.value);

};

</script>

<style lang="scss" scoped>
.radio-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

span {
    margin-left: 0.25rem;
}
</style>