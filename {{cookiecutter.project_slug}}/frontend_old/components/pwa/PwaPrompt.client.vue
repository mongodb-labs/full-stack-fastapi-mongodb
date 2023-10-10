<template>
    <div
      v-if="$pwa?.needRefresh"
      class="inline-flex justify-between space-x-5 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
        <div class="inline-flex items-center">
            <ArrowPathIcon  class="block h-5 w-5" aria-hidden="true" />
            <h2 class="ml-1">{{ $t('pwa.title') }}</h2>
        </div>
        <div class="inline-flex items-center space-x-3">
            <button type="button" @click="$pwa.updateServiceWorker()">
                <span class="sr-only">$t('pwa.update')</span>
                <CheckCircleIcon  class="block h-5 w-5 text-green-500" aria-hidden="true" />
            </button>
            <button type="button" @click="$pwa.cancelPrompt()">
                <span class="sr-only">$t('pwa.dismiss')</span>
                <XCircleIcon  class="block h-5 w-5 text-rose-500" aria-hidden="true" />
            </button>
        </div>
    </div>
  </template>

<script setup lang="ts">
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/outline"
</script>