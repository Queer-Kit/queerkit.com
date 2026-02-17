<script lang="ts" setup>
import mainCss from "~/assets/css/main.css?raw";

const appConfig = useAppConfig();
const { t } = useI18n();

useHead({
  title: "Branding",
});

useSeoMeta({
  title: "Branding",
  ogTitle: "Branding",
  description: `Branding guidelines and assets for ${appConfig.title}.`,
  ogDescription: `Branding guidelines and assets for ${appConfig.title}.`,
});

const logomarkMonochromeWhite = computed(() => ({
  jpg: `${appConfig.cdn}/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/queerkit.com%20-%20Logomark%20-%20Monochrome%20White.jpg`,
  png: `${appConfig.cdn}/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/queerkit.com%20-%20Logomark%20-%20Monochrome%20White.png`,
  svg: `${appConfig.cdn}/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/queerkit.com%20-%20Logomark%20-%20Monochrome%20White.svg`,
  webp: `${appConfig.cdn}/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/queerkit.com%20-%20Logomark%20-%20Monochrome%20White.webp`,
}));

// Add more computed as needed or simplify the template
</script>

<template>
  <UContainer>
    <UPage>
      <UPageBody>
        <RCSection :description="t('page_branding_description')" :level="1" :title="t('page_branding_title')">
          <RCSection :level="2" description="The logos and variations we use in our branding." title="Logo">
            <RCCallout variant="error">
              <p>If a color combination isn't listed, it means it shouldn't be used.</p>
            </RCCallout>

            <RCSection :level="3" title="Logomark">
              <RCSection :level="4" title="Monochrome White">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch v-bind="logomarkMonochromeWhite" name="Logomark - Monochrome White" />
                </div>
              </RCSection>
            </RCSection>

            <RCSection :level="2" description="The color palette used across our branding." title="Colors">
              <RCColorPalette :css="mainCss" />
            </RCSection>

            <RCSection :level="2" title="Typography" description="The font families and styles used in our branding.">
              <RCFontPalette :css="mainCss" />
            </RCSection>
          </RCSection>
        </RCSection>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
