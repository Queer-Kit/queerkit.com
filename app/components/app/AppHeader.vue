<script lang="ts" setup>
import type { ChipProps, DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const { session, signOut } = useAuth();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();

async function onSignOut() {
  const { error } = await signOut()
  if (error) {
    toast.add({
      color: "error",
      title: "Sign Out Failed",
      description: error.message || "A connection issue occurred."
    })
  } else {
    toast.add({
      color: "success",
      title: "Sign Out Successful",
      description: "You have been signed out."
    })
  }
}


const layerId = inject<string>("header_layer_id", "default");

const { bottomOffsets } = useHeaderStack();

const slideoverState = reactive({
  left: false,
  right: false,
  notifications: false
});

const { isNotificationsSlideoverOpen } = useDashboard();
watch(isNotificationsSlideoverOpen, (val: boolean) => {
  slideoverState.notifications = val;
}, { immediate: true });

watch(() => slideoverState.notifications, (val: boolean) => {
  isNotificationsSlideoverOpen.value = val;
});

type menuItem = NavigationMenuItem & DropdownMenuItem;

const items = computed<NavigationMenuItem[]>(() => markRaw([
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "About",
    to: "/company/about",
    active: route.path.startsWith("/company"),
  },
  {
    label: "Certification",
    to: "/certification",
    active: route.path === "/certification",
  },
  {
    label: "Wiki",
    to: "/wiki",
    active: route.path.startsWith("/wiki"),
  },
  {
    label: "Community",
    to: "/community",
    active: route.path.startsWith("/community"),
  },
  {
    label: "Store",
    to: "/store",
    active: route.path.startsWith("/store"),
  },
]));

const accountMenuItems = computed<menuItem[][]>(() => {
  return [
    [
      {
        slot: "user" as const,
      },
      {
        label: "Dashboard",
        icon: "lucide:layout-dashboard",
        to: "/dashboard",
      },
      {
        label: "Available",
        icon: "pajamas:status-active",
        color: "success",
        children: [
          [
            {
              label: "Available",
              icon: "pajamas:status-active",
              color: "success",
              onClick: async () => { },
            },
            {
              label: "Busy",
              icon: "pajamas:status-active",
              color: "success",
              onClick: async () => { },
            },
          ],
          [
            {
              label: "Invisible",
              icon: "pajamas:status-active",
              color: "success",
              onClick: async () => { },
            },
          ],
        ],
      },
    ],
    [
      {
        label: "Profile",
        icon: "lucide:user",
      },
      {
        label: "Billing",
        icon: "lucide:credit-card",
      },
    ],
    [
      {
        label: "Team",
        icon: "lucide:users",
      },
      {
        label: "Invite users",
        icon: "lucide:user-plus",
        children: [
          [
            {
              label: "Email",
              icon: "lucide:mail",
            },
            {
              label: "Message",
              icon: "lucide:message-square",
            },
          ],
          [
            {
              label: "More",
              icon: "lucide:circle-plus",
            },
          ],
        ],
      },
      {
        label: "New team",
        icon: "lucide:plus",
        kbds: ["meta", "n"],
      },
    ],
    [
      {
        label: "Support",
        icon: "lucide:headset",
        to: "/docs/components/dropdown-menu",
      },
    ],
    [
      {
        label: "Settings",
        icon: "lucide:cog",
        to: "/dashboard/settings",
        kbds: [","],
      },
    ],
  ];
});

const availabilityMenuItems = computed<menuItem[][]>(() => {
  return [
    [
      {
        label: "Available",
        icon: "pajamas:status-active",
        color: "success",
        onClick: async () => { },
      },
      {
        label: "Busy",
        icon: "pajamas:status-active",
        color: "error",
        onClick: async () => { },
      },
      {
        label: "Invisibile",
        icon: "pajamas:status-active",
        color: "neutral",
        onClick: async () => { },
      },
    ],
  ];
});

defineShortcuts(extractShortcuts(accountMenuItems.value));

const availabilityChip = computed<ChipProps | undefined>(() => {
  const availability = session.value?.user?.availability;

  if (!availability) {
    return undefined;
  }

  let color: ChipProps["color"];
  switch (availability) {
    case "available":
      color = "success";
      break;
    case "busy":
      color = "error";
      break;
    case "invisible":
      color = "neutral";
      break;
    default:
      color = "primary";
  }

  return {
    color: color,
    position: "bottom-right",
  };
});
</script>

<template>
  <RCHeader :contain="false" class="bg-black">
    <template #left>
      <div class="flex flex-row items-center gap-md">
        <ClientOnly>
          <RCLogo class="h-6 w-auto" variant="mark" />
        </ClientOnly>
        <UNavigationMenu :items="items"
          :style="{ '--header-bottom-boundary': `${(bottomOffsets[layerId] || 0) - 64}px` }" :ui="{
            viewportWrapper:
              'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)] z-[100]',
            viewport: 'rounded-none',
            label: 'text-white font-medium',
            link: 'hover:text-primary-200 active:text-500',
          }" variant="link" />
      </div>
    </template>
    <template #center></template>
    <template #right>
      <div class="flex flex-row gap-sm">
        <ClientOnly>
          <template v-if="session">
            <div class="flex flex-row items-center gap-md">
              <UButton color="neutral" label="Dashboard" to="/dashboard" variant="link" />
              <UTooltip text="Notifications">
                <UButton color="neutral" square variant="ghost" @click="slideoverState.notifications = true">
                  <UChip color="error" inset>
                    <UIcon class="size-5 shrink-0" name="i-lucide-bell" />
                  </UChip>
                </UButton>
              </UTooltip>
              <UPopover :ui="{ content: 'w-64' }" arrow mode="hover">
                <template #default>
                  <UTooltip>
                    <template #default>
                      <UButton variant="ghost">
                        <UUser v-if="session" :avatar="{
                          src: session?.user.image ?? '',
                          alt: session?.user.name ?? '',
                        }" :chip="availabilityChip" :description="session?.user.status ?? ''"
                          :name="session?.user.name" :ui="{ description: 'text-left' }" size="md" />
                      </UButton>
                    </template>
                  </UTooltip>
                </template>
                <template #content>
                  <div class="flex flex-col">
                    <div class="flex flex-col gap-xs bg-elevated p-sm">
                      <UUser v-if="session" :avatar="{
                        src: session?.user.image ?? '',
                        alt: session?.user.name ?? '',
                      }" :description="session?.user.status ?? 'Set a custom status...'"
                        :ui="{ name: 'text-left', description: 'text-left' }" size="md">
                        <template #name>
                          <span>{{ session?.user.name }}
                            <span class="text-dimmed">#{{ session?.user.tag }}</span></span>
                        </template>
                      </UUser>
                      <UButton :label="t('account_profile')" color="neutral" leading-icon="lucide:user"
                        variant="ghost" />
                    </div>
                    <div class="flex flex-col gap-xs bg-muted p-sm">
                      <UButton :label="t('account_support')" color="neutral" leading-icon="lucide:headset"
                        variant="ghost" />
                      <UButton :label="t('account_settings')" color="neutral" leading-icon="lucide:cog"
                        to="/dashboard/settings" variant="ghost" />
                      <UButton :label="t('auth_sign-out')" color="neutral" leading-icon="lucide:log-out" variant="ghost"
                        @click="onSignOut" />
                    </div>
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
          <template v-else>
            <UButton :label="t('auth_sign-up')" to="/auth/sign-up" variant="outline" />
            <UButton :label="t('auth_sign-in')" to="/auth/sign-in" variant="solid" />
          </template>
        </ClientOnly>
      </div>
    </template>
    <template #collapsed-left>
      <div class="flex justify-start">
        <ClientOnly>
          <USlideover v-model:open="slideoverState.left" :handle="false" :ui="{
            header: 'flex items-center justify-between',
            content: 'w-full max-w-4/5 rounded-none',
          }" side="left">
            <UButton color="neutral" icon="lucide:menu" variant="ghost" @click="slideoverState.left = true" />
            <template #header>
              <RCLogo class="h-6 w-auto" variant="mark" />
              <UButton color="neutral" icon="lucide:x" variant="ghost" @click="slideoverState.left = false" />
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
        <RCLogo class="h-6 w-auto" variant="mark" />
      </ClientOnly>
    </template>
    <template #collapsed-right>
      <div class="flex flex-row justify-end gap-sm">
        <ClientOnly>
          <UTooltip text="Notifications">
            <UButton color="neutral" square variant="ghost" @click="slideoverState.notifications = true">
              <UChip color="error" inset>
                <UIcon class="size-5 shrink-0" name="i-lucide-bell" />
              </UChip>
            </UButton>
          </UTooltip>
          <USlideover v-model:open="slideoverState.right" :handle="false" :ui="{
            header: 'flex items-center justify-between',
            content: 'w-full max-w-4/5 rounded-none',
          }" side="right">
            <UButton color="neutral" icon="lucide:user" variant="ghost" @click="slideoverState.right = true" />
            <template #header>
              <UUser v-if="session" :avatar="{
                src: session?.user.image ?? '',
                alt: session?.user.name ?? '',
              }" :description="session?.user.status ?? ''" :ui="{ description: 'text-left' }" size="md">
                <template #name>
                  <span>{{ session?.user.name }}
                    <span class="text-dimmed">#{{ session?.user.tag }}</span></span>
                </template>
              </UUser>
              <div v-else />
              <UButton color="neutral" icon="lucide:x" variant="ghost" @click="slideoverState.right = false" />
            </template>
            <template #body>
              <div class="flex flex-col gap-md">
                <template v-if="session">
                  <UNavigationMenu :items="accountMenuItems" orientation="vertical" />
                </template>
                <template v-else>
                  <UButton :label="t('auth_sign-up')" block to="/auth/sign-up" variant="outline"
                    @click="slideoverState.right = false" />
                  <UButton :label="t('auth_sign-in')" block to="/auth/sign-in" variant="solid"
                    @click="slideoverState.right = false" />
                </template>
              </div>
            </template>
          </USlideover>
        </ClientOnly>
      </div>
    </template>
  </RCHeader>
</template>

<style scoped></style>
