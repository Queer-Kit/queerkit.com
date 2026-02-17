<script setup lang="ts">
import { type Page } from "#rimelight-components/types";

const route = useRoute()
const { user } = useAuth()
const { locale } = useI18n()
const appConfig = useAppConfig()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s
})

const canEdit = computed(() => user.value?.role === 'owner' || user.value?.role === 'admin')

const {
  data: page,
  status: pageStatus,
  error: pageError
} = await useApi<Page>(() => `/api/pages/find/${slug.value}`, {
  key: `catch-all-${slug.value}`,
})

const resolvePage = async (id: string) => {
  return $api<Page>(`/api/pages/id/${id}`, {
    query: { select: "title,icon,slug" },
  })
}

useHead({
  title: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title
})

useSeoMeta({
  title: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title,
  ogTitle: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title,
  description: () => getLocalizedContent(page.value?.description, locale) ?? appConfig.description,
  ogDescription: () => getLocalizedContent(page.value?.description, locale) ?? appConfig.description
})
</script>

<template>
  <USkeleton v-if="pageStatus === 'pending'" class="h-full w-full" />

  <LazyUError
    v-else-if="pageError || !page"
    :clear="{ label: 'Return Home' }"
    :error="{
      status: 404,
      statusText: 'Page Not Found',
      message: 'The requested page could not be located.',
    }"
    redirect="/"
  />

  <RCPageRenderer
    v-else
    v-model="page"
    :resolve-page="resolvePage"
    :can-edit="canEdit"
    :edit-url="`/${slug}/edit`"
  />
</template>

