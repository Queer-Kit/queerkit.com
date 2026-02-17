<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: "Queer Kit | Your Guide to All Things Queer",
});

useSeoMeta({
  title: "Queer Kit | Your Guide to All Things Queer",
  ogTitle: "Queer Kit | Your Guide to All Things Queer",
  description: "A collective resource for the LGBTQ+ community, covering history, identity, health, and more.",
  ogDescription: "A collective resource for the LGBTQ+ community, covering history, identity, health, and more.",
});

const featuredResources = [
  {
    title: "The Wiki",
    description: "Our community-driven encyclopedia covering everything from terminology to queer history.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
    tags: ["Knowledge", "Wiki"],
    to: "/wiki",
  },
  {
    title: "Community Guide",
    description: "Finding safe spaces, local organizations, and ways to connect with the global queer family.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop",
    tags: ["Community", "Support"],
    to: "/wiki/community",
  },
  {
    title: "Identity Labs",
    description: "Deep dives into gender, sexuality, and the nuances of self-expression and discovery.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop",
    tags: ["Identity", "Education"],
    to: "/wiki/identity/gender",
  },
];
</script>

<template>
  <div class="bg-neutral-950 text-white selection:bg-primary-500 selection:text-white">
    <!-- Hero Section -->
    <section class="relative min-h-[calc(100vh-var(--total-header-offset))] flex items-center overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 opacity-80" />
        <NuxtImg src="https://images.unsplash.com/photo-1550745165-9bc0b252726f" alt="Hero Background"
          class="absolute top-0 left-0 w-full h-full object-cover opacity-20 mix-blend-overlay animate-pulse-slow"
          loading="eager" fetchpriority="high" preload format="webp" />
      </div>

      <!-- Content -->
      <UContainer class="relative z-10 w-full">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 border border-primary-500/30 bg-primary-500/10 backdrop-blur-sm text-primary-400 text-sm uppercase tracking-widest mb-4 animate-fade-in-up">
            <span class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            Empowering the Collective
          </div>

          <h1
            class="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 animate-fade-in-up delay-100">
            All Things<br />Queer
          </h1>

          <p
            class="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
            We are QueerKit. A community-driven guide building the most comprehensive resource for LGBTQ+ knowledge and
            connection.
          </p>

          <div class="flex flex-col sm:flex-row justify-center gap-6 pt-8 animate-fade-in-up delay-300">
            <UButton size="xl" color="primary" variant="solid" to="/wiki" class="font-bold px-8">
              Open the Wiki
            </UButton>
            <UButton size="xl" variant="ghost" to="/about" class="group px-8">
              About QueerKit
              <template #trailing>
                <UIcon name="lucide:arrow-right" class="group-hover:translate-x-1 transition-transform" />
              </template>
            </UButton>
          </div>
        </div>
      </UContainer>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500 animate-bounce">
        <span class="text-xs uppercase tracking-widest">Scroll</span>
        <UIcon name="lucide:chevron-down" class="w-6 h-6" />
      </div>
    </section>

    <!-- Featured Resources -->
    <section id="resources" class="py-32 relative">
      <UContainer>
        <div class="flex justify-between items-end mb-16">
          <div>
            <h2 class="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">Essential Resources</h2>
            <div class="h-1 w-24 bg-primary-500" />
          </div>
          <UButton variant="link" to="/wiki" class="hidden md:flex">Browse Everything</UButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink v-for="(resource, index) in featuredResources" :key="index" :to="resource.to"
            class="group relative h-[500px] border border-neutral-800 bg-neutral-900 overflow-hidden hover:border-primary-500/50 transition-colors duration-500">
            <!-- Image Background -->
            <div class="absolute inset-0">
              <NuxtImg :src="resource.image" :alt="resource.title"
                class="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy" format="webp" width="600" height="500" />
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
            </div>

            <!-- Content -->
            <div class="absolute inset-0 p-8 flex flex-col justify-end">
              <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div class="flex gap-2 mb-4">
                  <span v-for="tag in resource.tags" :key="tag"
                    class="text-xs font-bold uppercase tracking-wider py-1 px-2 border border-white/10 bg-black/30 backdrop-blur-md text-white/80">
                    {{ tag }}
                  </span>
                </div>
                <h3 class="text-3xl font-bold uppercase mb-2 group-hover:text-primary-400 transition-colors">
                  {{ resource.title }}
                </h3>
                <p
                  class="text-neutral-400 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {{ resource.description }}
                </p>
                <div
                  class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  Explore
                  <UIcon name="lucide:arrow-right" class="w-4 h-4" />
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- Project Vision -->
    <section class="py-32 border-y border-neutral-800 bg-neutral-900/30">
      <UContainer>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-3xl md:text-5xl font-bold uppercase leading-tight mb-6">
              Building a world of <span class="text-primary-500">inclusive knowledge</span>
            </h2>
            <p class="text-lg text-neutral-400 mb-8 leading-relaxed">
              QueerKit is an independent, community-focused initiative. We don't just aggregate data; we curate a safe,
              accurate, and living knowledge base that respects the diversity of the queer experience.
            </p>
            <div class="grid grid-cols-2 gap-8">
              <div>
                <div class="text-4xl font-bold text-white mb-2">400+</div>
                <div class="text-sm text-neutral-500 uppercase tracking-widest">Wiki Articles</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-white mb-2">12+</div>
                <div class="text-sm text-neutral-500 uppercase tracking-widest">Active Contributors</div>
              </div>
            </div>
          </div>
          <div
            class="relative aspect-video bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center group">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary-900/20 to-neutral-900/20" />
            <UIcon name="lucide:info"
              class="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Community News -->
    <section class="py-32">
      <UContainer>
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold uppercase mb-4">Community Transmissions</h2>
          <p class="text-neutral-400">Stay updated with the latest news and additions to QueerKit.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800">
          <div class="bg-neutral-950 p-8 hover:bg-neutral-900 transition-colors cursor-pointer group">
            <div class="text-primary-500 text-sm font-mono mb-4">OCT 24, 2025</div>
            <h3 class="text-xl font-bold mb-4 group-hover:text-primary-400 transition-colors">Now Live: History Deep
              Dive
            </h3>
            <p class="text-neutral-500 text-sm">Our new section on early 20th-century queer activism is now available.
            </p>
          </div>
          <div class="bg-neutral-950 p-8 hover:bg-neutral-900 transition-colors cursor-pointer group">
            <div class="text-primary-500 text-sm font-mono mb-4">SEP 12, 2025</div>
            <h3 class="text-xl font-bold mb-4 group-hover:text-primary-400 transition-colors">Community Moderator
              Program
            </h3>
            <p class="text-neutral-500 text-sm">We're looking for passionate individuals to help maintain our safe
              spaces.
            </p>
          </div>
          <div class="bg-neutral-950 p-8 hover:bg-neutral-900 transition-colors cursor-pointer group">
            <div class="text-primary-500 text-sm font-mono mb-4">AUG 01, 2025</div>
            <h3 class="text-xl font-bold mb-4 group-hover:text-primary-400 transition-colors">Terminology Refresh</h3>
            <p class="text-neutral-500 text-sm">Updating our glossary with more modern and inclusive definitions.</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Join Us -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-primary-600/5" />
      <UContainer class="relative z-10 text-center">
        <h2 class="text-3xl font-bold uppercase mb-8">Join the Community</h2>
        <div class="max-w-md mx-auto flex gap-2">
          <UInput placeholder="Enter your email" class="flex-1" size="xl" />
          <UButton size="xl" color="primary" icon="lucide:send">Subscribe</UButton>
        </div>
        <p class="text-neutral-500 text-sm mt-4">We respect your privacy. Only major community updates.</p>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
}
</style>
