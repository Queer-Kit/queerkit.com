<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: "Support & Help Center | QueerKit",
  meta: [
    {
      name: "description",
      content:
        "Get help with moderation, platform features, account settings, or report any issues regarding QueerKit.",
    },
  ],
});

const faqs = [
  {
    icon: "lucide:shield-alert",
    title: "Reporting Harassment",
    description:
      "Learn how our moderation tools work and what steps to take if you or someone else is targeted within the community.",
  },
  {
    icon: "lucide:book",
    title: "Wiki Contributions",
    description:
      "Find out how to suggest edits to existing wiki articles or submit your own research for approval.",
  },
  {
    icon: "lucide:user-cog",
    title: "Account & Privacy",
    description:
      "Manage your visibility, data privacy, display names, and identity tags on the platform.",
  },
  {
    icon: "lucide:badge-check",
    title: "Certification Help",
    description: "Need help generating your card or printing it? Check our troubleshooting guide.",
  },
];
</script>

<template>
  <div>
    <UPageHero
      title="How can we help?"
      description="You're not alone. Our support team and comprehensive help documentation are here to assist with any platform issues or community concerns you might have."
      align="center"
      icon="lucide:life-buoy"
      :ui="{ wrapper: 'py-24' }"
    >
      <div class="mt-8 flex justify-center max-w-lg mx-auto">
        <div class="w-full flex gap-2">
          <UInput
            placeholder="Search the help center..."
            size="xl"
            class="flex-1"
            icon="lucide:search"
          />
          <UButton color="primary" variant="solid" size="xl">Search</UButton>
        </div>
      </div>
    </UPageHero>

    <UPageSection title="Help topics" align="center">
      <template #features>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          <UCard
            v-for="(faq, index) in faqs"
            :key="index"
            class="hover:border-primary-500 transition-colors cursor-pointer group"
          >
            <template #header>
              <div class="flex items-center gap-4">
                <UIcon
                  :name="faq.icon"
                  class="w-8 h-8 text-primary-500 group-hover:scale-110 transition-transform"
                />
                <h3 class="text-xl font-bold">{{ faq.title }}</h3>
              </div>
            </template>
            <p class="text-neutral-400 leading-relaxed">{{ faq.description }}</p>
            <template #footer>
              <div class="flex items-center text-primary-500 text-sm font-bold uppercase">
                Read more
                <UIcon
                  name="lucide:arrow-right"
                  class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </template>
          </UCard>
        </div>
      </template>
    </UPageSection>

    <UPageSection
      title="Still need help?"
      description="If you couldn't find your answer, our moderation and support team is ready to step in."
      align="center"
      :ui="{ wrapper: 'bg-neutral-900/50' }"
    >
      <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <UButton to="/support/contact" size="xl" color="primary" variant="solid" icon="lucide:mail"
          >Contact Support</UButton
        >
        <UButton to="/wiki" size="xl" variant="outline" icon="lucide:users">Browse Wiki</UButton>
      </div>
    </UPageSection>
  </div>
</template>
