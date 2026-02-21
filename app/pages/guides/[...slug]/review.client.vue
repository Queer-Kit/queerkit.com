<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types";

const route = useRoute();
const { permissions } = useAuth();
const isAdmin = permissions?.admin?.canAccess ?? true;

const slug = computed(() => {
  const s = route.params.slug;
  if (Array.isArray(s)) return s.join("/");
  return s;
});

const lookupSlug = computed(() => `guides/${slug.value}`);
</script>

<template>
  <RCPageReviewView
    :lookup-path="lookupSlug"
    :cache-key="`guides-review-${slug}`"
    :page-definitions="pageDefinitions"
    base-url="/guides"
    :is-admin="isAdmin"
    :error-redirect-params="{
      redirect: '/guides',
      label: 'Back to Guides',
      message: 'The requested guide could not be located.',
    }"
  />
</template>
