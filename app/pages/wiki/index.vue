<script setup lang="ts">
definePageMeta({
  layout: "wiki",
});

useHead({
  title: "QueerKit Wiki",
});
</script>

<template>
  <div class="space-y-16">
    <section class="space-y-6">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest"
      >
        Wiki Home
      </div>
      <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">
        The Collective <br />
        of
        <span class="text-primary-500">Knowledge</span>
      </h1>
      <p class="text-xl text-primary-100/60 font-light max-w-2xl leading-relaxed">
        Welcome to the central knowledge hub of QueerKit. Here you will find detailed documentation
        on everything from queer history and terminology to community resources and health guides.
      </p>
      <div class="bg-primary-950/50 border border-primary-800/50 p-6 flex gap-4 max-w-xl">
        <UInput icon="lucide:search" placeholder="Search the wiki..." size="xl" class="flex-1" />
        <UButton color="primary" icon="lucide:arrow-right" size="xl" />
      </div>
    </section>

    <hr class="border-primary-800/30" />

    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
        <UIcon name="lucide:compass" class="text-primary-500" />
        Quick Navigation
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink to="/wiki/getting-started" class="group">
          <UCard
            class="bg-primary-800/10 border-primary-800/50 hover:bg-primary-500/5 hover:border-primary-500/50 transition-all h-full"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 bg-primary-500/20 rounded-none border border-primary-500/30">
                <UIcon name="lucide:book-open" class="size-6 text-primary-400" />
              </div>
              <div class="space-y-2 flex-1">
                <h3 class="text-lg font-bold text-white group-hover:text-primary-400 uppercase">
                  Getting Started
                </h3>
                <p class="text-sm text-primary-100/60">
                  New to correctly understanding queer identities? Start here to learn the basics.
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <NuxtLink to="/wiki/identity/gender" class="group">
          <UCard
            class="bg-primary-800/10 border-primary-800/50 hover:bg-primary-500/5 hover:border-primary-500/50 transition-all h-full"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 bg-primary-500/20 rounded-none border border-primary-500/30">
                <UIcon name="lucide:users" class="size-6 text-primary-400" />
              </div>
              <div class="space-y-2 flex-1">
                <h3 class="text-lg font-bold text-white group-hover:text-primary-400 uppercase">
                  Identity
                </h3>
                <p class="text-sm text-primary-100/60">
                  Explore the spectrum of gender, sexuality, and self-expression.
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <NuxtLink to="/wiki/history" class="group">
          <UCard
            class="bg-primary-800/10 border-primary-800/50 hover:bg-primary-500/5 hover:border-primary-500/50 transition-all h-full"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 bg-primary-500/20 rounded-none border border-primary-500/30">
                <UIcon name="lucide:map-pin" class="size-6 text-primary-400" />
              </div>
              <div class="space-y-2 flex-1">
                <h3 class="text-lg font-bold text-white group-hover:text-primary-400 uppercase">
                  History
                </h3>
                <p class="text-sm text-primary-100/60">
                  Discover the figures, events, and movements that shaped our collective history.
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <NuxtLink to="/wiki/community" class="group">
          <UCard
            class="bg-primary-800/10 border-primary-800/50 hover:bg-primary-500/5 hover:border-primary-500/50 transition-all h-full"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 bg-primary-500/20 rounded-none border border-primary-500/30">
                <UIcon name="lucide:shield-check" class="size-6 text-primary-400" />
              </div>
              <div class="space-y-2 flex-1">
                <h3 class="text-lg font-bold text-white group-hover:text-primary-400 uppercase">
                  Community
                </h3>
                <p class="text-sm text-primary-100/60">
                  Find resources, safe spaces, and ways to connect with others.
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </section>

    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
        <UIcon name="lucide:flame" class="text-primary-500" />
        Trending Articles
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <NuxtLink v-for="i in 4" :key="i" to="#" class="group">
          <div
            class="p-6 bg-white/5 border border-primary-800/30 hover:bg-primary-500/5 hover:border-primary-500/50 transition-all flex flex-col items-start gap-3"
          >
            <div class="text-[10px] font-black text-primary-500 uppercase">Article</div>
            <div class="text-lg font-bold text-white group-hover:text-primary-400">
              Featured Resource {{ i }}
            </div>
            <div class="text-xs text-primary-100/40 text-left line-clamp-2">
              A summary of informative developments in this specific area of interest.
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
