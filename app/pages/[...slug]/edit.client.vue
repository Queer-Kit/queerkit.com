<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types";
const route = useRoute();

const slug = computed(() => {
  const s = route.params.slug;
  if (Array.isArray(s)) return s.join("/");
  return s;
});
const lookupPath = computed(() => slug.value);
</script>
<template>
  <RCPageEditView
    :page-definitions="pageDefinitions"
    :lookup-path="lookupPath"
    :cache-key="`catch-all-${slug.value}`"
    :live-url-builder="() => `/${slug.value}`"
    :review-url-builder="(s, versionId) => `/${slug.value}/review?version=${versionId}`"
    back-url="/"
    :error-redirect-params="{
      redirect: '/',
      label: 'Return Home',
      message: 'The requested page could not be located.',
    }"
  />
</template>
