<template>
    <button
        v-if="$pwa?.needRefresh"
        class="inline-flex items-center rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        @click="$pwa.updateServiceWorker()"
    >
        <CloudArrowDownIcon  class="block h-5 w-5 text-rose-500" aria-hidden="true" />
        <h2 class="ml-1">
        {{ $t('pwa.update_available_short') }}
        </h2>
    </button>
</template>  

<script setup lang="ts">
import { CloudArrowDownIcon } from "@heroicons/vue/24/outline"
</script>