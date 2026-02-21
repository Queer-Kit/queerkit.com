<script setup lang="ts">
definePageMeta({
  layout: "wiki",
});

useHead({
  title: "Getting Started | QueerKit Wiki",
});
</script>

<template>
  <div class="space-y-16">
    <section class="space-y-6">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest"
      >
        Getting Started
      </div>
      <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">
        Welcome to <br />
        <span class="text-primary-500">QueerKit</span>
      </h1>
      <p class="text-xl text-primary-100/60 font-light max-w-2xl leading-relaxed">
        Your comprehensive guide to understanding identities, history, and community. Start here if
        you're looking to learn more about the LGBTQ+ community.
      </p>
    </section>

    <hr class="border-primary-800/30" />

    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
        <UIcon name="lucide:book-open" class="text-primary-500" />
        Foundations
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UCard class="bg-primary-800/10 border-primary-800/50">
          <template #header>
            <h3 class="text-lg font-bold text-white uppercase">Identity Basics</h3>
          </template>
          <p class="text-primary-100/60 text-sm leading-relaxed mb-4">
            Learn the core concepts of gender identity, sexual orientation, and romantic attraction.
          </p>
          <UButton variant="link" color="primary" class="p-0">Read Guide</UButton>
        </UCard>

        <UCard class="bg-primary-800/10 border-primary-800/50">
          <template #header>
            <h3 class="text-lg font-bold text-white uppercase">Inclusive Language</h3>
          </template>
          <p class="text-primary-100/60 text-sm leading-relaxed mb-4">
            Understand the importance of pronouns, terminology, and how to communicate respectfully.
          </p>
          <UButton variant="link" color="primary" class="p-0">Read Guide</UButton>
        </UCard>

        <UCard class="bg-primary-800/10 border-primary-800/50">
          <template #header>
            <h3 class="text-lg font-bold text-white uppercase">Community etiquette</h3>
          </template>
          <p class="text-primary-100/60 text-sm leading-relaxed mb-4">
            Best practices for interacting in queer spaces and supporting one another.
          </p>
          <UButton variant="link" color="primary" class="p-0">Read Guide</UButton>
        </UCard>

        <UCard class="bg-primary-800/10 border-primary-800/50">
          <template #header>
            <h3 class="text-lg font-bold text-white uppercase">Coming Out</h3>
          </template>
          <p class="text-primary-100/60 text-sm leading-relaxed mb-4">
            Resources and guidance for sharing your identity with others in a safe way.
          </p>
          <UButton variant="link" color="primary" class="p-0">Read Guide</UButton>
        </UCard>
      </div>
    </section>

    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
        <UIcon name="lucide:scroll-text" class="text-primary-500" />
        Exploring History
      </h2>

      <div class="space-y-4">
        <p class="text-primary-100/60 leading-relaxed">
          Dive into the rich history of the LGBTQ+ movement, from early activism to modern
          milestones. The world of QueerKit is built on the shoulders of those who fought for
          visibility and rights.
        </p>
        <div class="flex gap-4">
          <UButton color="primary" variant="outline">Timeline of History</UButton>
          <UButton color="primary" variant="outline">Key Figures</UButton>
        </div>
      </div>

      <UCard class="bg-primary-800/10 border-primary-800/50">
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <div class="p-4 bg-primary-500/20 rounded-none border border-primary-500/30">
            <UIcon name="lucide:info" class="size-8 text-primary-400" />
          </div>
          <div class="space-y-2">
            <h4 class="font-bold text-white uppercase">Early Access</h4>
            <p class="text-sm text-primary-100/40">
              Many articles are currently being researched and drafted. If you encounter missing
              information or placeholder content, please report it via our community channels.
            </p>
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>
