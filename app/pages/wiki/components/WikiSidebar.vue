<script setup lang="ts">
const { t } = useI18n();

// Navigation items grouped by section
const navigationItems = computed(() => [
  [
    {
      label: 'Wiki Explorer',
      type: 'label' as const
    },
    {
      label: 'Getting Started',
      to: '/wiki/getting-started'
    },
    {
      label: 'Contribution Guide',
      to: '/wiki/contribution-guide'
    }
  ],
  [
    {
      label: 'Resources',
      type: 'label' as const
    },
    {
      label: 'Queer History',
      to: '/wiki/history'
    },
    {
      label: 'Terminology',
      to: '/wiki/terminology'
    },
    {
      label: 'Community Guide',
      to: '/wiki/community'
    }
  ],
  [
    {
      label: 'Identity',
      type: 'label' as const
    },
    {
      label: 'Gender',
      to: '/wiki/identity/gender'
    },
    {
      label: 'Sexuality',
      to: '/wiki/identity/sexuality'
    },
    {
      label: 'Pronouns',
      to: '/wiki/identity/pronouns'
    }
  ],
  [
    {
      label: 'Health & Wellness',
      type: 'label' as const
    },
    {
      label: 'Mental Health',
      to: '/wiki/health/mental'
    },
    {
      label: 'Physical Health',
      to: '/wiki/health/physical'
    }
  ],
  [
    {
      label: 'Support',
      type: 'label' as const
    },
    {
      label: 'Contribute',
      to: '/wiki/contribution-guide'
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

    <!-- Stats or Contribution Info -->
    <div class="px-4 py-6 bg-primary-900/50 border border-primary-800/50 rounded-none space-y-4">
      <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Wiki Stats</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-lg font-bold text-white">428</div>
          <div class="text-[9px] text-primary-100/40 uppercase font-bold">Articles</div>
        </div>
        <div>
          <div class="text-lg font-bold text-white">12</div>
          <div class="text-[9px] text-primary-100/40 uppercase font-bold">Contributors</div>
        </div>
      </div>
    </div>
  </div>
</template>
