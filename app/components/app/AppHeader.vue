<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const { t, locale, setLocale } = useI18n();

const layerId = inject<string>("header_layer_id", "default");

const { bottomOffsets } = useHeaderStack();

const slideoverState = reactive({
  left: false,
});

const items = computed<NavigationMenuItem[]>(() =>
  markRaw([
    {
      label: t("app.header.navigation.about"),
      to: "/about",
      active: route.path.startsWith("/about"),
    },
    {
      label: t("app.header.navigation.certification"),
      to: "/certification",
      active: route.path === "/certification",
    },
    {
      label: t("app.header.navigation.wiki"),
      to: "/wiki",
      active: route.path.startsWith("/wiki"),
    },

    {
      label: t("app.header.navigation.blog"),
      to: "/blog",
      active: route.path.startsWith("/blog"),
    },
    {
      label: t("app.header.navigation.store"),
      to: "/store",
      active: route.path.startsWith("/store"),
    },
  ]),
);
</script>

<template>
  <RCHeader :contain="false" class="bg-white shadow-sm">
    <template #left>
      <div class="flex flex-row items-center gap-md">
        <ClientOnly>
          <RCLogo class="h-6 w-auto" mode="color" variant="combomark_horizontal" />
        </ClientOnly>
      </div>
    </template>
    <template #center>
      <UNavigationMenu
        :items="items"
        :style="{ '--header-bottom-boundary': `${(bottomOffsets[layerId] || 0) - 64}px` }"
        :ui="{
          viewportWrapper:
            'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)] z-[100]',
          viewport: 'rounded-none ring-0',
          link: [
            'text-neutral-900 transition-colors duration-200',
            'hover:text-primary-500',
            'data-[state=open]:text-primary-500',
            'aria-[current]:text-primary-500',
          ],
        }"
        variant="link"
      />
    </template>
    <template #right>
      <div class="flex flex-row items-center gap-sm h-full">
        <ClientOnly>
          <USelectMenu
            :model-value="locale"
            @update:model-value="setLocale($event as 'en' | 'pt')"
            :items="[
              { code: 'en', name: 'English' },
              { code: 'pt', name: 'Português' }
            ]"
            value-key="code"
            label-key="name"
            icon="lucide:languages"
            variant="ghost"
            size="sm"
            class="rounded-md shrink-0 h-9"
            :ui="{
              value: 'hidden',
              content: 'w-48',
            }"
            :aria-label="t('app.language_picker')"
          >
            <template #leading="{ modelValue }">
              <span class="text-xs font-medium">{{ modelValue === 'pt' ? 'PT' : 'EN' }}</span>
            </template>
            <template #item-leading="{ item }">
              <span class="text-xs font-medium">{{ item.code.toUpperCase() }}</span>
            </template>
          </USelectMenu>

          <UButton
            icon="i-simple-icons-instagram"
            to="https://instagram.com"
            target="_blank"
            variant="ghost"
            color="neutral"
            size="md"
            class="rounded-md hover:text-primary-500"
            aria-label="Instagram"
          />
        </ClientOnly>
      </div>
    </template>
    <template #collapsed-left>
      <div class="flex justify-start">
        <ClientOnly>
          <USlideover
            v-model:open="slideoverState.left"
            :handle="false"
            :ui="{
              header: 'flex items-center justify-between',
              content: 'w-full max-w-4/5 rounded-none',
            }"
            side="left"
          >
            <UButton
              color="neutral"
              icon="lucide:menu"
              variant="ghost"
              @click="slideoverState.left = true"
            />
            <template #header>
               <RCLogo class="h-6 w-auto" mode="color" variant="combomark_horizontal" />
               <UButton
                 color="neutral"
                 icon="lucide:x"
                 variant="ghost"
                 @click="slideoverState.left = false"
               />
             </template>
             <template #body>
               <div class="flex size-full flex-col items-start gap-md">
                 <UNavigationMenu :items="items" orientation="vertical" variant="link" />
               </div>
             </template>
          </USlideover>
        </ClientOnly>
      </div>
    </template>
    <template #collapsed-center>
      <ClientOnly>
        <RCLogo class="h-6 w-auto" mode="color" variant="logomark" />
      </ClientOnly>
    </template>
    <template #collapsed-right>
      <div class="flex flex-row items-center justify-end gap-sm h-full">
        <ClientOnly>
          <USelectMenu
            :model-value="locale"
            @update:model-value="setLocale($event as 'en' | 'pt')"
            :items="[
              { code: 'en', name: 'English' },
              { code: 'pt', name: 'Português' }
            ]"
            value-key="code"
            label-key="name"
            icon="lucide:languages"
            variant="ghost"
            size="sm"
            class="rounded-md shrink-0 h-9"
            :ui="{
              value: 'hidden',
              content: 'w-48',
            }"
            :aria-label="t('app.language_picker')"
          >
            <template #leading="{ modelValue }">
              <span class="text-xs font-medium">{{ modelValue === 'pt' ? 'PT' : 'EN' }}</span>
            </template>
            <template #item-leading="{ item }">
              <span class="text-xs font-medium">{{ item.code.toUpperCase() }}</span>
            </template>
          </USelectMenu>

          <UButton
            icon="i-simple-icons-instagram"
            to="https://instagram.com"
            target="_blank"
            variant="ghost"
            color="neutral"
            size="md"
            class="rounded-md hover:text-primary-500"
            aria-label="Instagram"
          />
        </ClientOnly>
      </div>
    </template>
  </RCHeader>
</template>

<style scoped></style>
