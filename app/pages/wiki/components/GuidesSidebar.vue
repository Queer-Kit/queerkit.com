<script setup lang="ts">
const { t } = useI18n();

// Navigation items for Guides
const navigationItems = computed(() => [
    [
        {
            label: 'Guides Explorer',
            type: 'label' as const
        },
        {
            label: 'Featured Guides',
            to: '/guides'
        }
    ],
    [
        {
            label: 'Categories',
            type: 'label' as const
        },
        {
            label: 'Intro to Queer Kit',
            to: '/guides/getting-started'
        },
        {
            label: 'Identity & Discovery',
            to: '/guides/identity'
        },
        {
            label: 'Health & Wellness',
            to: '/guides/health'
        },
        {
            label: 'History & Advocacy',
            to: '/guides/advocacy'
        }
    ],
    [
        {
            label: 'Media',
            type: 'label' as const
        },
        {
            label: 'Video Library',
            to: '/guides/videos'
        }
    ],
    [
        {
            label: 'Community Tools',
            type: 'label' as const
        },
        {
            label: 'Safe Space Map',
            to: '/guides/tools/map'
        },
        {
            label: 'Resource Locators',
            to: '/guides/tools/locators'
        }
    ]
]);
</script>

<template>
    <div class="space-y-8 p-md">
        <UNavigationMenu :items="navigationItems" orientation="vertical" :ui="{
            label: 'text-[10px] font-black uppercase tracking-[0.1em]',
            link: 'text-[11px] text-dimmed py-1'
        }" class="w-full" />

        <!-- Community Tip -->
        <div class="px-4 py-6 bg-primary-900/50 border border-primary-800/50 rounded-none space-y-4">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 text-center">Community
                Knowledge</h3>
            <p class="text-xs text-primary-100/60 leading-relaxed text-center italic">
                "Respecting someone's pronouns is the simplest way to show they are seen and valued. Always ask if
                you're unsure."
            </p>
            <UButton block size="xs" color="primary" variant="ghost" class="text-[10px] font-bold">Contribute a Tip
            </UButton>
        </div>
    </div>
</template>

<style scoped></style>
