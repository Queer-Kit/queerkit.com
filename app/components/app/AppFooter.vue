<script lang="ts" setup>
import * as locales from "@nuxt/ui/locale";
import type { FooterColumn } from "@nuxt/ui";

const appConfig = useAppConfig();
const { locale, setLocale } = useI18n();

function onLocaleUpdate(newLocale: string | undefined) {
  if (typeof newLocale === "string") {
    setLocale(newLocale as "en");
  }
}

const columns: FooterColumn[] = [
  {
    label: "Resources",
    children: [
      {
        label: "Branding",
        to: "/branding",
      },
      {
        label: "Visitor Count",
        to: "/visitors",
      },
    ],
  },
  {
    label: "Documents",
    children: [
      {
        label: "Privacy Policy",
        to: "/documents/policies/privacy-policy",
      },
      {
        label: "Cookie Policy",
        to: "/documents/policies/cookie-policy",
      },
      {
        label: "Terms of Service",
        to: "/documents/policies/term-of-service",
      },
      {
        label: "Code of Conduct",
        to: "/documents/policies/code-of-conduct",
      },
      {
        label: "Other Documents",
        to: "/documents/other",
      },
    ],
  },
];
onMounted(() => {
  console.log("AppFooter mounted on client");
});
</script>

<template>
  <RCFooter :contain="false" class="bg-black z-50">
    <template #left>
      <RCNewsletterSignup class="max-w-64" />
      <div class="flex flex-col items-center gap-xs lg:items-start">
        <RCLogo class="h-6 w-auto" variant="type" />
        <p class="text-sm text-white">Your guide to all things queer.</p>
        <span class="text-sm text-white">
          © {{ new Date().getFullYear() }} {{ appConfig.title }}
        </span>
      </div>
    </template>
    <template #center>
      <UFooterColumns :columns="columns" />
    </template>
    <template #right>
      <div class="flex flex-col gap-sm lg:items-end">
        <ClientOnly>
          <UColorModeSelect class="rounded-none" />
          <template #fallback>
            <div class="h-9 w-32 rounded-md border bg-transparent"></div>
          </template>
        </ClientOnly>
        <ClientOnly>
          <ULocaleSelect v-model="locale"
            :locales="[locales.ar, locales.en, locales.es, locales.fr, locales.ja, locales.ko, locales.pt, locales.ro, locales.zh_cn]"
            class="w-48 rounded-none" color="secondary" @update:model-value="onLocaleUpdate($event)" />
          <template #fallback>
            <div class="h-9 w-48 rounded-md border bg-transparent"></div>
          </template>
        </ClientOnly>
      </div>
      <div class="flex flex-col items-center gap-xs lg:items-end">
        <div class="flex flex-row gap-sm lg:items-end">
          <UButton class="text-white hover:text-primary-100" color="neutral" icon="mdi:instagram" size="xl"
            to="https://www.instagram.com/queerkit" variant="ghost" />
          <UButton class="text-white hover:text-primary-100" color="neutral" icon="ic:baseline-discord" size="xl"
            to="https://discord.gg/queerkit" variant="ghost" />
          <UButton class="text-white hover:text-primary-100" color="neutral" icon="mdi:github" size="xl"
            to="https://www.github.com/queerkit" variant="ghost" />
        </div>
      </div>
    </template>
  </RCFooter>
</template>

<style scoped></style>
