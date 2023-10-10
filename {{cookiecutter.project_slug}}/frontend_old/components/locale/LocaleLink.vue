<template>
    <NuxtLink :to="localePath(props.to)">
        <slot />
    </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const props = defineProps<{
    to: any,
}>()
</script>