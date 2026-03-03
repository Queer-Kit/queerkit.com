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

const teamMembers = [
  {
    name: "Bruna Corso",
    role: "Co-Founder",
    roleSecondary: "Designer",
    description: "Passionate about creating inclusive spaces and building community.",
    image: "https://cdn.queerkit.com/Images/Team/bruna_corso_00.webp",
    links: [
      { icon: "mdi:instagram", to: "https://instagram.com/brunacorso", target: "_blank" }
    ]
  },
  {
    name: "Daniel Marchi",
    role: "Co-Founder",
    roleSecondary: "Developer",
    description: "Dedicated to providing accessible resources for the LGBTQ+ community.",
    image: "https://cdn.queerkit.com/Images/Team/daniel_marchi_00.webp",
    links: [
      { icon: "mdi:instagram", to: "https://instagram.com/danielmarchi", target: "_blank" },
      { icon: "mdi:github", to: "https://github.com/danielmarchi", target: "_blank" },
      { icon: "lucide:globe", to: "https://danielmarchi.com", target: "_blank" }
    ]
  },
  {
    name: "Gustavo Cardoso",
    role: "Co-Founder",
    roleSecondary: "Designer",
    description: "Committed to amplifying queer voices and stories.",
    image: "https://cdn.queerkit.com/Images/Team/gustavo_cardoso_00.webp",
    links: [
      { icon: "mdi:instagram", to: "https://instagram.com/gustavocardoso", target: "_blank" }
    ]
  }
];
</script>

<template>
  <div>
    <UPageHero
      title="About Queer Kit"
      description="We are dedicated to providing a comprehensive, accessible hub for all things queer. Explore our mission, values, and the people behind the platform."
      align="center"
      icon="lucide:info"
      :ui="{
        title: 'text-black',
        description: 'text-neutral-600',
      }"
    />

    <UPageSection
      title="The Story Behind Queer Kit"
      align="left"
      :ui="{
        title: 'text-black',
        description: 'text-neutral-600',
      }"
    >
      <div class="grid lg:grid-cols-2 gap-12 items-stretch text-lg text-black leading-relaxed">
        <div class="flex items-center">
          <div>
            <p class="mb-6">
              Queer Kit started as a simple idea: what if there was a centralized, welcoming space where anyone could learn about queer identities, discover resources, and find their community?
            </p>
            <p class="mb-6">
              Over time, we've grown into a comprehensive platform featuring a deeply detailed wiki, community forums, and a store to support our operations—all designed with love, clarity, and bold aesthetics.
            </p>
            <p>
              Our journey is just beginning. We are continually partnering with creators, educators, and activists to expand our content and ensure every narrative within the vast LGBTQ+ spectrum is represented and celebrated.
            </p>
          </div>
        </div>
        <div class="rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 h-full">
          <NuxtImg
            src="https://images.unsplash.com/photo-1573039603378-f75a96db576e?q=80&w=2670&auto=format&fit=crop"
            alt="Diverse group of friends"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="Meet the Team"
      description="The people behind Queer Kit."
      align="center"
      :ui="{
        title: 'text-black',
        description: 'text-neutral-600',
      }"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <RCTeamCard
          v-for="(member, index) in teamMembers"
          :key="index"
          :src="member.image"
          :alt="member.name"
          :name="member.name"
          :role="member.role"
          :description="member.description"
          :links="member.links"
          :rc="{
            card: 'bg-neutral-100 border-0 shadow-none',
            name: 'text-black text-left',
            description: 'text-neutral-400 text-left',
          }"
        >
          <template #badge>
            <div class="flex flex-wrap gap-sm">
              <UBadge color="primary" variant="soft">
                {{ member.role }}
              </UBadge>
              <UBadge color="primary" variant="soft">
                {{ member.roleSecondary }}
              </UBadge>
            </div>
          </template>
        </RCTeamCard>
      </div>
    </UPageSection>

    <UPageSection
      title="Join the Movement"
      description="Whether you're looking to learn, share, or simply belong—there's a place for you here."
      align="center"
      :ui="{
        title: 'text-black',
        description: 'text-neutral-600',
      }"
    >
      <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <UButton to="/wiki" size="xl" color="primary" variant="solid" icon="lucide:book-open">Explore Wiki</UButton>
        <UButton to="/support" size="xl" variant="outline" icon="lucide:life-buoy">Get Support</UButton>
      </div>
    </UPageSection>
  </div>
</template>
