<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => route.params.slug as string)

const { data: page } = await useAsyncData(
  `document-${slug.value}-${locale.value}`,
  async () => {
    const collection = `${locale.value}_documents` as any
    return queryCollection(collection).path(`/documents/${slug.value}`).first()
  },
  { watch: [locale] }
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Document not found",
    fatal: true
  })
}

if (page.value?.ogImage) {
  defineOgImage(page.value.ogImage)
} else if (page.value?.image) {
  defineOgImage({ url: page.value.image })
}

useHead(page.value?.head || {})
useSeoMeta(page.value?.seo || {})
</script>

<template>
  <UPage v-if="page" class="bg-white text-black">
    <UContainer>
      <UPageBody class="text-black prose prose-black">
        <div v-if="page.lastUpdated" class="text-sm text-neutral-500 mb-4">
          {{ t("pages.documents.last_updated") }}:
          {{ new Date(page.lastUpdated).toLocaleDateString() }}
        </div>
        <ContentRenderer v-if="page.body" :value="page" class="prose prose-black max-w-none" />
        <div v-else>
          <p>{{ page.description }}</p>
        </div>
      </UPageBody>
    </UContainer>
  </UPage>
</template>

<style scoped>
:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  color: black;
}

:deep(.prose p),
:deep(.prose li),
:deep(.prose strong),
:deep(.prose span) {
  color: black;
}

:deep(.prose ul > li::marker),
:deep(.prose ol > li::marker) {
  color: black;
}

:deep(.prose hr) {
  border-color: black;
}

:deep(.prose blockquote) {
  color: black;
  border-left-color: black;
}

:deep(.prose code) {
  color: black;
}

:deep(.prose pre code) {
  color: inherit;
}

:deep(.prose thead th) {
  color: black;
}

:deep(.prose tbody td) {
  color: black;
}
</style>
