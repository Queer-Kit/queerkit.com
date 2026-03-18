<script setup lang="ts">
definePageMeta({
  layout: "wiki"
})

const route = useRoute()
const { user } = useAuth()
const { t } = useI18n()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join("/")
  return s
})

const lookupSlug = computed(() => `wiki/${slug.value}`)
const canEdit = computed(() => user.value?.role === "owner" || user.value?.role === "admin")
</script>

<template>
  <RCPageLiveView
    :lookup-path="lookupSlug"
    :cache-key="`wiki-${slug}`"
    base-url="/wiki"
    :can-edit="canEdit"
    :error-redirect-params="{
      redirect: '/wiki',
      label: t('pages.wiki.error.back'),
      message: t('pages.wiki.error.notFound')
    }"
  />
</template>
