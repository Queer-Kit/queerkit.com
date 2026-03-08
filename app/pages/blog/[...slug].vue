<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { mapContentNavigation } from "@nuxt/ui/utils/content";
import { findPageBreadcrumb } from "@nuxt/content/utils";

definePageMeta({
  i18n: {
    paths: {
      pt: "/blog/[...slug]",
    },
  },
});
const route = useRoute();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const slug = computed(() => {
  const s = Array.isArray(route.params.slug) ? route.params.slug.join("/") : route.params.slug;
  return `/blog/${s}`;
});

const { data: page } = await useAsyncData(
  `blog-${route.path}`,
  async () => {
    const collection = `${locale.value}_blog` as any;
    return queryCollection(collection).path(slug.value).first();
  },
  { watch: [locale] },
);

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });

const { data: surround } = await useAsyncData(
  `${route.path}-surround`,
  async () => {
    const collection = `${locale.value}_blog` as any;
    return queryCollectionItemSurroundings(collection, slug.value, {
      fields: ["description"],
    });
  },
  { watch: [locale] },
);

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation", ref([]));
const blogNavigation = computed(
  () => navigation.value.find((item) => item.path === localePath("/blog"))?.children || [],
);

const breadcrumb = computed(() =>
  mapContentNavigation(findPageBreadcrumb(blogNavigation?.value, page.value?.path)).map(
    ({ icon, ...link }) => link,
  ),
);

if (page.value?.ogImage) {
  defineOgImage(page.value.ogImage);
} else if (page.value?.image) {
  defineOgImage({ url: page.value.image });
}

useHead(page.value?.head || {});
useSeoMeta(page.value?.seo || {});

const articleLink = computed(() => `${window?.location}`);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const toast = useToast();
const copyToClipboard = async (text: string, successMessage: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      title: successMessage,
      color: "success",
      icon: "lucide:check-circle",
    });
  } catch (err) {
    console.error("Failed to copy clipboard", err);
  }
};
</script>

<template>
  <UContainer>
    <UPage v-if="page">
      <UPageHeader :title="page.title" :description="page.description" class="border-none">
        <template #headline>
          <div class="flex text-xs text-muted items-center gap-2">
            <span v-if="page.date">
              {{ formatDate(page.date) }}
            </span>
            <span v-if="page.date && page.minRead"> - </span>
            <span v-if="page.minRead"> {{ page.minRead }} MIN READ </span>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <NuxtImg
          :src="page.image"
          :alt="page.title"
          class="rounded-lg w-full h-[300px] object-cover object-center mb-12 shadow-2xl ring-1 ring-default"
        />

        <div class="flex items-center justify-center gap-2 mb-8">
          <UUser
            orientation="horizontal"
            color="neutral"
            variant="ghost"
            class="justify-center items-center text-center"
            v-bind="page.author"
          />
        </div>

        <div class="max-w-none">
          <ContentRenderer
            v-if="page.body"
            :value="page"
            class="prose prose-primary dark:prose-invert"
          />
        </div>

        <div class="flex items-center justify-end gap-2 text-sm text-muted mb-8">
          <UButton
            size="sm"
            variant="link"
            color="neutral"
            :label="t('pages.blog.copyLink')"
            @click="copyToClipboard(articleLink, t('pages.blog.linkCopied'))"
          />
        </div>

        <USeparator class="my-16" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template #left>
        <UPageAside>
          <div class="flex flex-col gap-sm">
            <div class="text-sm font-semibold text-highlighted">
              {{ t("app.header.navigation.blog") }}
            </div>
            <UContentNavigation
              highlight
              :navigation="
                navigation?.find((item) => item.path === localePath('/blog'))?.children || []
              "
            />
          </div>
        </UPageAside>
      </template>

      <template v-if="page?.body?.toc?.links?.length" #right>
        <UPageAside>
          <UContentToc :links="page.body?.toc?.links" :ui="{ container: 'lg:py-0' }" />
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
