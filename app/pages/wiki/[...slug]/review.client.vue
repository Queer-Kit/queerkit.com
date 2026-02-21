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

const lookupSlug = computed(() => `wiki/${slug.value}`);
</script>

<template>
  <RCPageReviewView
    :lookup-path="lookupSlug"
    :cache-key="`wiki-review-${slug}`"
    :page-definitions="pageDefinitions"
    base-url="/wiki"
    :is-admin="isAdmin"
    :error-redirect-params="{
      redirect: '/wiki',
      label: 'Back to Wiki',
      message: 'The requested wiki page could not be located.',
    }"
  />
</template>
