<script setup lang="ts">
definePageMeta({
  layout: "guides",
});

const route = useRoute();
const { user } = useAuth();

const slug = computed(() => {
  const s = route.params.slug;
  if (Array.isArray(s)) return s.join("/");
  return s;
});

const lookupSlug = computed(() => `guides/${slug.value}`);
const canEdit = computed(() => user.value?.role === "owner" || user.value?.role === "admin");
</script>

<template>
  <RCPageLiveView
    :lookup-path="lookupSlug"
    :cache-key="`guides-${slug}`"
    base-url="/guides"
    :can-edit="canEdit"
    :error-redirect-params="{
      redirect: '/guides',
      label: 'Back to Guides',
      message: 'The requested guide could not be located.',
    }"
  />
</template>
