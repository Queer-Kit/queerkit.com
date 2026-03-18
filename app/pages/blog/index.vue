<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const { data: page } = await useAsyncData(
  route.path,
  async () => {
    const collection = `${locale.value}_pages` as any
    return queryCollection(collection).path("/blog").first()
  },
  { watch: [locale] }
)
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true
  })
}
const { data: posts } = await useAsyncData(
  `blogs-${locale.value}`,
  async () => {
    const collection = `${locale.value}_blog` as any
    return queryCollection(collection).order("date", "DESC").all()
  },
  { watch: [locale] }
)
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "blogs posts not found",
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
  <UPage v-if="page">
    <UPageSection
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: 'mx-0 text-left text-black font-extrabold',
        description: 'mx-0 text-left text-neutral-600 max-w-2xl',
        links: 'justify-start'
      }"
    >
      <UBlogPosts orientation="vertical">
        <UBlogPost
          v-for="(post, index) in posts"
          :key="index"
          variant="naked"
          orientation="horizontal"
          :to="localePath(post.path)"
          v-bind="post"
          :ui="{
            root: 'md:grid md:grid-cols-2 group overflow-visible transition-all duration-300',
            image: 'group-hover/blog-post:scale-105 rounded-xl shadow-lg',
            title: 'text-black font-bold group-hover:text-neutral-700 transition-colors',
            description: 'text-neutral-600 line-clamp-3',
            date: 'text-neutral-400 font-medium'
          }"
        />
      </UBlogPosts>
    </UPageSection>
  </UPage>
</template>
