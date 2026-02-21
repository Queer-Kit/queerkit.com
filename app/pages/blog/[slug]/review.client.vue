<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types";

const route = useRoute();
const { permissions } = useAuth();
const isAdmin = permissions?.admin?.canAccess ?? true;

const slug = computed(() => route.params.slug as string);
const lookupSlug = computed(() => `blog/${slug.value}`);
</script>

<template>
  <RCPageReviewView
    :lookup-path="lookupSlug"
    :cache-key="`blog-review-${slug}`"
    :page-definitions="pageDefinitions"
    base-url="/blog"
    :is-admin="isAdmin"
    :error-redirect-params="{
      redirect: '/blog',
      label: 'Back to Blog',
      message: 'The requested blog post could not be located.',
    }"
  />
</template>
