<script lang="ts" setup>
const { t, locale } = useI18n();
const localePath = useLocalePath();

const { data: documents } = await useAsyncData(
  `documents-${locale.value}`,
  async () => {
    const collection = `${locale.value}_documents` as any;
    return queryCollection(collection).all();
  },
  { watch: [locale] },
);

useHead({
  title: t("pages.documents.meta.title"),
});

useSeoMeta({
  title: t("pages.documents.meta.title"),
  ogTitle: t("pages.documents.meta.title"),
  description: t("pages.documents.meta.description"),
  ogDescription: t("pages.documents.meta.description"),
});
</script>

<template>
  <UPage>
    <UContainer>
      <UPageHeader
        :title="t('pages.documents.meta.title')"
        :description="t('pages.documents.meta.description')"
        :ui="{
          title: 'text-black',
          description: 'text-neutral-500',
        }"
      />
      <UPageBody>
        <div v-if="documents?.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="doc in documents"
            :key="doc.slug"
            :to="localePath(doc.path)"
            class="group p-6 border border-neutral-200 hover:border-primary-500 transition-colors"
          >
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-bold text-black group-hover:text-primary-500 transition-colors">
                {{ doc.title }}
              </h3>
              <p class="text-sm text-neutral-500">
                {{ doc.description }}
              </p>
              <div v-if="doc.lastUpdated" class="text-xs text-neutral-400">
                {{ t("pages.documents.last_updated") }}: {{ new Date(doc.lastUpdated).toLocaleDateString() }}
              </div>
            </div>
          </NuxtLink>
        </div>

        <UEmpty
          v-else
          variant="naked"
          icon="lucide:file-text"
          :title="t('pages.documents.documents.empty.title')"
          :description="t('pages.documents.documents.empty.description')"
          :ui="{
            title: 'text-black',
            description: 'text-neutral-500'
          }"
        />
      </UPageBody>
    </UContainer>
  </UPage>
</template>
