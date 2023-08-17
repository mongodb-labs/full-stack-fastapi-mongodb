<template>
    <Html :lang="htmlAttrs.lang" :dir="htmlAttrs.dir">
        <Body>
            <div class="bg-white">
                <slot name="header" >
                    <LayoutsDefaultNavigation />
                </slot>
                <main>
                    <ContentDoc />
                </main>
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