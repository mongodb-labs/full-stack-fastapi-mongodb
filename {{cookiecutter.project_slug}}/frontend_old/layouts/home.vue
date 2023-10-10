<template>
    <Html :lang="htmlAttrs.lang" :dir="htmlAttrs.dir">
        <Body>
            <div class="bg-white">
                <slot name="header" >
                    <LayoutsHomeNavigation />
                </slot>
                <slot />
                <slot name="footer" >
                    <LayoutsNotification />
                    <LayoutsDefaultFooter />
                </slot>
            </div>
        </Body>
    </Html>
</template>

<script setup lang="ts">
const head = useLocaleHead({
    addDirAttribute: true,
    addSeoAttributes: true,
})
const htmlAttrs = computed(() => head.value.htmlAttrs!)
</script>