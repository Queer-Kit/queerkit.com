<script setup lang="ts">
import { QUEER_FLAGS } from "~/utils/flags";

const { t } = useI18n();

useHead({
  title: "Queer Kit | Your Guide to All Things Queer",
});

useSeoMeta({
  title: t("pages.home.meta.title"),
  ogTitle: t("pages.home.meta.title"),
  description: t("pages.home.meta.description"),
  ogDescription: t("pages.home.meta.description"),
});

const featuredResources = [
  {
    title: t("pages.home.sections.resources.items.wiki.title"),
    description: t("pages.home.sections.resources.items.wiki.description"),
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
    tags: [t("pages.home.sections.resources.items.wiki.tags.knowledge"), t("pages.home.sections.resources.items.wiki.tags.wiki")],
    to: "/wiki",
  },
  {
    title: t("pages.home.sections.resources.items.community.title"),
    description: t("pages.home.sections.resources.items.community.description"),
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop",
    tags: [t("pages.home.sections.resources.items.community.tags.community"), t("pages.home.sections.resources.items.community.tags.support")],
    to: "/wiki/community",
  },
  {
    title: t("pages.home.sections.resources.items.identity.title"),
    description: t("pages.home.sections.resources.items.identity.description"),
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop",
    tags: [t("pages.home.sections.resources.items.identity.tags.identity"), t("pages.home.sections.resources.items.identity.tags.education")],
    to: "/wiki/identity/gender",
  },
];
</script>

<template>
  <div class="bg-white text-black selection:bg-primary-500 selection:text-white">
    <!-- Hero Section -->
    <section
      class="relative min-h-[calc(100vh-var(--total-header-offset))] flex items-center overflow-hidden"
    >
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-50 via-white to-white opacity-80"
        />
        <NuxtImg
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f"
          alt="Hero Background"
          class="absolute top-0 left-0 w-full h-full object-cover opacity-20 mix-blend-overlay animate-pulse-slow"
          loading="eager"
          fetchpriority="high"
          preload
          format="webp"
        />
      </div>

      <!-- Content -->
      <UContainer class="relative z-10 w-full">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 border border-primary-500/30 bg-primary-500/10 backdrop-blur-sm text-primary-400 text-sm uppercase tracking-widest mb-4 animate-fade-in-up"
          >
            <span class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            {{ t("pages.home.sections.hero.badge") }}
          </div>

          <h1
            class="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-black to-neutral-600 animate-fade-in-up delay-100"
            v-html="t('pages.home.sections.hero.title')"
          />

          <p
            class="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200"
          >
            {{ t("pages.home.sections.hero.description") }}
          </p>

          <div
            class="flex flex-col sm:flex-row justify-center gap-6 pt-8 animate-fade-in-up delay-300"
          >
            <UButton size="xl" color="primary" variant="solid" to="/wiki" class="font-bold px-8">
              {{ t("pages.home.sections.hero.actions.wiki") }}
            </UButton>
            <UButton size="xl" variant="ghost" to="/about" class="group px-8">
              {{ t("pages.home.sections.hero.actions.about") }}
              <template #trailing>
                <UIcon
                  name="lucide:arrow-right"
                  class="group-hover:translate-x-1 transition-transform"
                />
              </template>
            </UButton>
          </div>
        </div>
      </UContainer>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-700 animate-bounce"
      >
        <span class="text-xs uppercase tracking-widest">{{ t("pages.home.sections.hero.scroll") }}</span>
        <UIcon name="lucide:chevron-down" class="w-6 h-6" />
      </div>
    </section>
      <UMarquee :overlay="false" class="[--duration:40s]">
        <div v-for="flag in QUEER_FLAGS" :key="flag.id" class="flex items-center mx-8">
          <div class="rounded-sm overflow-hidden">
            <UIcon :name="flag.icon" class="w-16 h-10 block rounded-sm overflow-hidden" />
          </div>
        </div>
      </UMarquee>

    <!-- Featured Resources -->
    <section id="resources" class="py-32 relative">
      <UContainer>
        <div class="flex justify-between items-end mb-16">
          <div>
            <h2 class="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
              {{ t("pages.home.sections.resources.title") }}
            </h2>
            <div class="h-1 w-24 bg-primary-500" />
          </div>
          <UButton variant="link" to="/wiki" class="hidden md:flex">{{
            t("pages.home.sections.resources.cta")
          }}</UButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="(resource, index) in featuredResources"
            :key="index"
            :to="resource.to"
            class="group relative h-[500px] border border-neutral-100 bg-neutral-50 overflow-hidden hover:border-primary-500/50 transition-colors duration-500"
          >
            <!-- Image Background -->
            <div class="absolute inset-0">
              <NuxtImg
                :src="resource.image"
                :alt="resource.title"
                class="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy"
                format="webp"
                width="600"
                height="500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"
              />
            </div>

            <!-- Content -->
            <div class="absolute inset-0 p-8 flex flex-col justify-end">
              <div
                class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
              >
                <div class="flex gap-2 mb-4">
                  <span
                    v-for="tag in resource.tags"
                    :key="tag"
                    class="text-xs font-bold uppercase tracking-wider py-1 px-2 border border-black/10 bg-white/30 backdrop-blur-md text-black/80"
                  >
                    {{ tag }}
                  </span>
                </div>
                <h3
                  class="text-3xl font-bold uppercase mb-2 group-hover:text-primary-400 transition-colors"
                >
                  {{ resource.title }}
                </h3>
                <p
                  class="text-neutral-600 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                >
                  {{ resource.description }}
                </p>
                <div
                  class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"
                >
                  {{ t("common.navigation.next") }}
                  <UIcon name="lucide:arrow-right" class="w-4 h-4" />
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- Project Vision -->
    <section class="py-32 border-y border-neutral-100 bg-neutral-50/50">
      <UContainer>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2
              class="text-3xl md:text-5xl font-bold uppercase leading-tight mb-6"
              v-html="t('pages.home.sections.vision.title')"
            />
            <p class="text-lg text-neutral-600 mb-8 leading-relaxed">
              {{ t("pages.home.sections.vision.description") }}
            </p>
            <div class="grid grid-cols-2 gap-8">
              <div>
                <div class="text-4xl font-bold text-black mb-2">400+</div>
                <div class="text-sm text-neutral-700 uppercase tracking-widest">
                  {{ t("pages.home.sections.vision.stats.articles") }}
                </div>
              </div>
              <div>
                <div class="text-4xl font-bold text-black mb-2">12+</div>
                <div class="text-sm text-neutral-700 uppercase tracking-widest">
                  {{ t("pages.home.sections.vision.stats.contributors") }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="relative aspect-video bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center group"
          >
            <div class="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-neutral-100" />
            <UIcon
              name="lucide:info"
              class="w-16 h-16 text-black opacity-80 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Community News -->
    <section class="py-32">
      <UContainer>
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold uppercase mb-4 text-black">{{ t("pages.home.sections.news.title") }}</h2>
          <p class="text-neutral-600">{{ t("pages.home.sections.news.description") }}</p>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-100 border border-neutral-100"
        >
          <div
            class="bg-white p-8 hover:bg-neutral-50 transition-colors cursor-pointer group"
          >
            <div class="text-primary-500 text-sm font-mono mb-4">OCT 24, 2025</div>
            <h3 class="text-xl font-bold mb-4 group-hover:text-primary-400 transition-colors">
              {{ t("pages.home.sections.news.items.history.title") }}
            </h3>
            <p class="text-neutral-600 text-sm">{{ t("pages.home.sections.news.items.history.description") }}</p>
          </div>
          <div
            class="bg-white p-8 hover:bg-neutral-50 transition-colors cursor-pointer group"
          >
            <div class="text-primary-500 text-sm font-mono mb-4">SEP 12, 2025</div>
            <h3 class="text-xl font-bold mb-4 group-hover:text-primary-400 transition-colors">
              {{ t("pages.home.sections.news.items.mod.title") }}
            </h3>
            <p class="text-neutral-600 text-sm">{{ t("pages.home.sections.news.items.mod.description") }}</p>
          </div>
          <div
            class="bg-white p-8 hover:bg-neutral-50 transition-colors cursor-pointer group"
          >
            <div class="text-primary-500 text-sm font-mono mb-4">AUG 01, 2025</div>
            <h3 class="text-xl font-bold mb-4 group-hover:text-primary-400 transition-colors">
              {{ t("pages.home.sections.news.items.term.title") }}
            </h3>
            <p class="text-neutral-600 text-sm">{{ t("pages.home.sections.news.items.term.description") }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Join Us -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-primary-600/5" />
      <UContainer class="relative z-10 text-center">
        <h2 class="text-3xl font-bold uppercase mb-8">{{ t("pages.home.sections.join.title") }}</h2>
        <div class="max-w-md mx-auto flex gap-2">
          <UInput :placeholder="t('pages.home.sections.join.placeholder')" class="flex-1" size="xl" />
          <UButton size="xl" color="primary" icon="lucide:send">{{
            t("pages.home.sections.join.button")
          }}</UButton>
        </div>
        <p class="text-neutral-500 text-sm mt-4">{{ t("pages.home.sections.join.privacy") }}</p>
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
