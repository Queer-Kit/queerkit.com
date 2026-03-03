<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: "About Our Mission | QueerKit",
  meta: [
    {
      name: "description",
      content: "Learn more about the mission, vision, and team behind QueerKit."
    }
  ]
});

const values = [
  {
    icon: "lucide:heart",
    title: "Inclusivity",
    description: "Creating a safe space where everyone belongs, regardless of identity or expression."
  },
  {
    icon: "lucide:book-open",
    title: "Education",
    description: "Providing accurate, accessible, and comprehensive information about queer identities."
  },
  {
    icon: "lucide:users",
    title: "Community",
    description: "Fostering connections and building a supportive network across the globe."
  },
  {
    icon: "lucide:shield",
    title: "Advocacy",
    description: "Standing up for rights, visibility, and positive representation in all spaces."
  }
];
</script>

<template>
  <div>
    <UPageHero
      title="About QueerKit"
      description="We are dedicated to providing a comprehensive, accessible hub for all things queer. Explore our mission, values, and the people behind the platform."
      align="center"
      icon="lucide:info"
    />

    <UPageSection title="Our Heart & Soul" description="Why we exist and what drives our community forward." align="center">
      <template #features>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <UCard v-for="(value, index) in values" :key="index" class="text-center group hover:border-primary-500 transition-colors">
            <UIcon :name="value.icon" class="w-12 h-12 mx-auto text-primary-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 class="text-xl font-bold mb-3">{{ value.title }}</h3>
            <p class="text-neutral-400 text-sm">{{ value.description }}</p>
          </UCard>
        </div>
      </template>
    </UPageSection>

    <UPageSection title="The Story Behind QueerKit" align="left" :ui="{ wrapper: 'bg-neutral-900/50' }">
      <div class="grid lg:grid-cols-2 gap-12 items-center text-lg text-neutral-300 leading-relaxed">
        <div>
          <p class="mb-6">
            QueerKit started as a simple idea: what if there was a centralized, welcoming space where anyone could learn about queer identities, discover resources, and find their community?
          </p>
          <p class="mb-6">
            Over time, we've grown into a comprehensive platform featuring a deeply detailed wiki, community forums, and a store to support our operations—all designed with love, clarity, and bold aesthetics.
          </p>
          <p>
            Our journey is just beginning. We are continually partnering with creators, educators, and activists to expand our content and ensure every narrative within the vast LGBTQ+ spectrum is represented and celebrated.
          </p>
        </div>
        <div class="rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
          <NuxtImg
            src="https://images.unsplash.com/photo-1573039603378-f75a96db576e?q=80&w=2670&auto=format&fit=crop"
            alt="Diverse group of friends"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </UPageSection>

    <UPageSection title="Join the Movement" description="Whether you're looking to learn, share, or simply belong—there's a place for you here." align="center">
      <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <UButton to="/community" size="xl" color="primary" variant="solid" icon="lucide:users">Join Community</UButton>
        <UButton to="/wiki" size="xl" variant="outline" icon="lucide:book-open">Explore Wiki</UButton>
      </div>
    </UPageSection>
  </div>
</template>
