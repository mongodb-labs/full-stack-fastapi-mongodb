<template>
    <div
        v-if="$pwa?.showInstallPrompt && !$pwa?.needRefresh"
        class="inline-flex justify-between space-x-2 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        v-bind="$attrs"
    >
        <div class="inline-flex items-center">
            <CloudArrowDownIcon  class="block h-5 w-5" aria-hidden="true" />
            <h2 class="ml-1">{{ $t('pwa.install_title') }}</h2>
        </div>
        <div class="inline-flex items-center space-x-1">
            <button type="button" @click="$pwa.install()">
                <span class="sr-only">$t('pwa.install')</span>
                <CheckCircleIcon  class="block h-5 w-5 text-green-500" aria-hidden="true" />
            </button>
            <button type="button" @click="$pwa.cancelInstall()">
                <span class="sr-only">$t('pwa.dismiss')</span>
                <XCircleIcon  class="block h-5 w-5 text-rose-500" aria-hidden="true" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {CloudArrowDownIcon, CheckCircleIcon, XCircleIcon} from "@heroicons/vue/24/outline"
</script>