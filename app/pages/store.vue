<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: "Store | QueerKit",
  meta: [
    {
      name: "description",
      content: "Support QueerKit by purchasing official merchandise, apparel, and accessories.",
    },
  ],
});

const categories = [
  {
    icon: "lucide:shirt",
    title: "Apparel",
    description: "T-shirts, hoodies, and wearable pride that support our mission directly.",
  },
  {
    icon: "lucide:coffee",
    title: "Accessories",
    description: "Mugs, pins, and tote bags to carry your identity and advocacy anywhere.",
  },
  {
    icon: "lucide:pen-tool",
    title: "Stationery",
    description: "Stickers, notebooks, and posters featuring artwork from queer creators.",
  },
];
</script>

<template>
  <div>
    <UPageHero
      title="QueerKit Store"
      description="Show your pride and support our platform. Every purchase goes directly towards maintaining our servers, paying contributors, and keeping the wiki ad-free."
      align="center"
      icon="lucide:shopping-bag"
      :ui="{ wrapper: 'py-24' }"
    >
      <div class="mt-8 flex justify-center gap-4">
        <UButton color="primary" variant="solid" size="xl" icon="lucide:layout-template"
          >Shop All</UButton
        >
        <UButton variant="outline" size="xl" icon="lucide:heart">Make a Donation</UButton>
      </div>
    </UPageHero>

    <UPageSection
      title="Browse Categories"
      description="Find exactly what you're looking for by browsing our curated collections."
      align="center"
    >
      <template #features>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
          <UCard
            v-for="(cat, index) in categories"
            :key="index"
            class="text-center group cursor-pointer hover:border-primary-500 transition-colors"
          >
            <UIcon
              :name="cat.icon"
              class="w-16 h-16 mx-auto text-primary-500 mb-6 group-hover:scale-110 transition-transform"
            />
            <h3 class="text-xl font-bold mb-3 group-hover:text-primary-400">{{ cat.title }}</h3>
            <p class="text-neutral-400 text-sm leading-relaxed">{{ cat.description }}</p>
          </UCard>
        </div>
      </template>
    </UPageSection>

    <UPageSection title="Support the Platform" align="left" :ui="{ wrapper: 'bg-neutral-900/50' }">
      <div class="grid lg:grid-cols-2 gap-12 items-center text-lg text-neutral-300 leading-relaxed">
        <div class="order-2 lg:order-1 flex justify-center">
          <div
            class="relative w-full max-w-sm aspect-[4/5] bg-gradient-to-br from-primary-900/40 to-neutral-900 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center rotate-3 hover:rotate-0 transition-transform duration-500"
          >
            <UIcon name="lucide:star" class="w-20 h-20 text-primary-500 mb-6 animate-pulse" />
            <h4 class="text-2xl font-black uppercase text-white mb-4">
              Limited Edition Merch Drop
            </h4>
            <p class="text-sm text-neutral-400 mb-8">
              Grab your exclusive QueerKit launch apparel.
            </p>
            <UButton color="primary" variant="solid" size="lg" block>Notify Me</UButton>
          </div>
        </div>
        <div class="order-1 lg:order-2">
          <h3 class="text-3xl font-bold mb-6">Why shop with us?</h3>
          <p class="mb-6">
            Building a safe, ad-free environment takes resources. We don't rely on intrusive
            advertising or selling data.
          </p>
          <p class="mb-6">
            When you purchase merchandise from our store, you're not just getting high-quality gear.
            You're ensuring our platform remains completely free for users globally who rely on us
            for resources and a safe community space.
          </p>
          <ul class="space-y-4 font-medium text-white">
            <li class="flex items-center gap-3">
              <UIcon name="lucide:check-circle" class="w-5 h-5 text-primary-500" />
              100% of proceeds fund platform operations
            </li>
            <li class="flex items-center gap-3">
              <UIcon name="lucide:check-circle" class="w-5 h-5 text-primary-500" />
              Direct support to queer artists and creators
            </li>
            <li class="flex items-center gap-3">
              <UIcon name="lucide:check-circle" class="w-5 h-5 text-primary-500" />
              Ethically sourced materials and labor
            </li>
          </ul>
        </div>
      </div>
    </UPageSection>
  </div>
</template>
