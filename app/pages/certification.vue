<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { createCmykPdf, downloadBlob } from "~/utils/cmyk-pdf";
import { getFlagPathByIdentity } from "~/utils/flags";

// Metadata
useSeoMeta({
  title: "LGBT+ Certification - QueerKit",
  description: "Get your official (totally legitimate) LGBT+ Certification Card!",
});

const { t } = useI18n();

// Form state
const formData = reactive({
  name: "",
  pronouns: null as any,
  identity: null as any,
  image: null as string | null,
});

// Front Layout Constants
const FRONT_LAYOUT = {
  PADDING_TOP: 128,
  PADDING_BOTTOM: 40,
  PADDING_LEFT: 40,
  PADDING_RIGHT: 40,
  GAP_HORIZONTAL: 24,
  GAP_VERTICAL: 16,
  PHOTO_W: 192,
  PHOTO_H: 256,
  PHOTO_CORNER_RADIUS: 16,
  TITLE_SIZE: 28,
  SUBTITLE_SIZE: 20,
  LABEL_SIZE: 20,
  FIELD_SIZE: 24,
  NOTE_SIZE: 16,
  EMBLEM_SIZE: 80,
  EMBLEM_GAP: 12,
  FLAG_W: 80,
  FLAG_CORNER_RADIUS: 4,
  RENDER_DEBUG: false
};

// Back Layout Constants
const BACK_LAYOUT = {
  PADDING_X: 192, // Horizontal padding for the logo block
  PADDING_Y: 192, // Vertical padding for the logo block
  LOGO_PADDING_X: 40, // Horizontal padding inside the logo block
  LOGO_PADDING_Y: 20, // Vertical padding inside the logo block
  PLACEHOLDER_BG: "#ec4899", // primary-500 fallback
  BLOCK_BG: "#ffffff", // Color of the logo container
  RENDER_LOGO: false
};

const frontImageStats = reactive({ width: 0, height: 0 });
const backImageStats = reactive({ width: 0, height: 0 });

// Dynamic preview scaling: compute scale from actual container width
// so preview layout matches canvas export proportions exactly
const frontCardRef = ref<HTMLElement | null>(null);
const { width: frontCardWidth } = useElementSize(frontCardRef);
const BASE_WIDTH = 1011;
const previewScale = computed(() => {
  if (!frontCardWidth.value || frontCardWidth.value <= 0) return 1 / 1.5;
  return frontCardWidth.value / BASE_WIDTH;
});

onMounted(() => {
  const front = new Image();
  front.src = "/images/certification_front.jpg";
  front.onload = () => {
    frontImageStats.width = front.naturalWidth;
    frontImageStats.height = front.naturalHeight;
  };

  const back = new Image();
  back.src = "/images/certification_back.jpg";
  back.onload = () => {
    backImageStats.width = back.naturalWidth;
    backImageStats.height = back.naturalHeight;
  };
});

// Helper for display preview
const getTagLabel = (val: any) => {
  if (!val) return "—";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val.label) return val.label;
    if (val.value) return val.value;
  }
  return val;
};

// Handle image upload
function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.image = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Generate and download both sides of the card
async function downloadCard() {
  const namePart = (formData.name || "CERTIFICATE").toUpperCase().replace(/\s+/g, "-");
  const baseName = `QUEERKIT_CERTIFICATION_${namePart}`;

  // Front Side
  const frontCanvas = await generateFrontCanvas();
  const frontDataUrl = frontCanvas.toDataURL("image/png");
  downloadFile(frontDataUrl, `${baseName}_FRONT.png`);

  // Back Side
  const backCanvas = await generateBackCanvas(frontCanvas.width, frontCanvas.height);
  const backDataUrl = backCanvas.toDataURL("image/png");
  downloadFile(backDataUrl, `${baseName}_BACK.png`);

  // PDF Group (Print Ready - CMYK Color Space - 2 Pages at Card Size)
  const pdfBytes = await createCmykPdf(
    [frontCanvas, backCanvas],
    85.6,
    53.98,
  );
  downloadBlob(pdfBytes, `${baseName}_GROUP.pdf`);
}

function downloadFile(href: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = href;
  link.click();
}

// 1. Front Side
async function generateFrontCanvas() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get context");

  const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(" ");
    let line = "";
    let testY = y;

    // Calculate initial Y based on textBaseline "bottom"
    // Since we're drawing from bottom up if we have multiple lines,
    // we should actually calculate the number of lines first.
    const lines = [];
    let currentLine = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(currentLine);
        currentLine = words[n] + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    // Draw lines from bottom to top
    for (let i = lines.length - 1; i >= 0; i--) {
      ctx.fillText(lines[i]!, x, testY);
      testY -= lineHeight;
    }
  };

  // 1. Draw Background
  const frontImg = new Image();
  frontImg.src = "/images/certification_front.jpg";
  await new Promise((resolve) => {
    frontImg.onload = resolve;
    frontImg.onerror = () => resolve(null);
  });

  // Base dimensions used for scaling (based on standard preview width)
  const baseWidth = 1011;
  const baseHeight = 674;

  if (frontImg.complete && frontImg.naturalWidth > 0) {
    canvas.width = frontImg.naturalWidth;
    canvas.height = frontImg.naturalHeight;
    ctx.drawImage(frontImg, 0, 0, canvas.width, canvas.height);
  } else {
    canvas.width = baseWidth;
    canvas.height = baseHeight;
    ctx.fillStyle = "#ec4899";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const scale = canvas.width / baseWidth;
  const fontMain = '"JetBrains Mono", sans-serif';

  // 2. Header
  // NO DEBUG RENDERING IN EXPORT

  // 3. Left Column: Photo (Top) and Note (Bottom)
  // A. Image
  if (formData.image) {
    const img = new Image();
    img.src = formData.image;
    await new Promise((resolve) => (img.onload = resolve));

    const imgX = FRONT_LAYOUT.PADDING_LEFT * scale;
    const imgY = FRONT_LAYOUT.PADDING_TOP * scale;
    const imgW = FRONT_LAYOUT.PHOTO_W * scale;
    const imgH = FRONT_LAYOUT.PHOTO_H * scale;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgW, imgH, FRONT_LAYOUT.PHOTO_CORNER_RADIUS * scale);
    ctx.clip();

    const ratio = Math.max(imgW / img.width, imgH / img.height);
    const newWidth = img.width * ratio;
    const newHeight = img.height * ratio;
    ctx.drawImage(
      img,
      imgX + (imgW - newWidth) / 2,
      imgY + (imgH - newHeight) / 2,
      newWidth,
      newHeight,
    );
    ctx.restore();
  }

  // B. Institute Note (Bottom Left of writable area)
  ctx.fillStyle = "#000000";
  ctx.font = `${FRONT_LAYOUT.NOTE_SIZE * scale}px ${fontMain}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  const instituteText = t('pages.certification.card.instituteNote');
  const noteMaxWidth = FRONT_LAYOUT.PHOTO_W * scale;
  const noteLineHeight = FRONT_LAYOUT.NOTE_SIZE * 1.2 * scale;

  wrapText(
    instituteText,
    FRONT_LAYOUT.PADDING_LEFT * scale,
    canvas.height - FRONT_LAYOUT.PADDING_BOTTOM * scale,
    noteMaxWidth,
    noteLineHeight
  );

  // 4. Middle Column: Fields (Top Block vs Bottom Block)
  const textX = (FRONT_LAYOUT.PADDING_LEFT + FRONT_LAYOUT.PHOTO_W + FRONT_LAYOUT.GAP_HORIZONTAL) * scale;
  const textWidth = canvas.width - textX - FRONT_LAYOUT.PADDING_RIGHT * scale;

  // A. Top Block
  let topY = FRONT_LAYOUT.PADDING_TOP * scale;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  const idLabel = getTagLabel(formData.identity);
  const displayIdentity = (!idLabel || idLabel === "—") ? t('pages.certification.card.defaultIdentity') : String(idLabel);
  const headingText = t('pages.certification.card.title', { identity: displayIdentity });

  // Track Top Block Height for Debug
  let currentTopY = topY;

  // Title
  ctx.fillStyle = "#ec4899";
  ctx.font = `bold ${FRONT_LAYOUT.TITLE_SIZE * scale}px ${fontMain}`;
  ctx.fillText(headingText, textX, currentTopY);
  currentTopY += (FRONT_LAYOUT.TITLE_SIZE + FRONT_LAYOUT.GAP_VERTICAL / 2) * scale;

  // Registry ID
  ctx.fillStyle = "#000000";
  ctx.font = `bold ${FRONT_LAYOUT.SUBTITLE_SIZE * scale}px ${fontMain}`;
  ctx.fillText(`${t('pages.certification.card.registryId')}: ${generationId.value}`, textX, currentTopY);
  currentTopY += (FRONT_LAYOUT.SUBTITLE_SIZE + FRONT_LAYOUT.GAP_VERTICAL) * scale;

  // Name (Moved to Top Block)
  ctx.fillStyle = "#ec4899";
  ctx.font = `bold ${(FRONT_LAYOUT.LABEL_SIZE - 4) * scale}px ${fontMain}`;
  ctx.fillText(t('pages.certification.card.name').toUpperCase(), textX, currentTopY);
  currentTopY += (FRONT_LAYOUT.LABEL_SIZE + 4 * scale) * scale; // Scaled offset
  ctx.fillStyle = "#000000";
  ctx.font = `bold ${FRONT_LAYOUT.FIELD_SIZE * scale}px ${fontMain}`;
  ctx.fillText(formData.name || "—", textX, currentTopY);
  currentTopY += (FRONT_LAYOUT.FIELD_SIZE + FRONT_LAYOUT.GAP_VERTICAL) * scale;

  // Pronouns (Always visible, moved to Top Block)
  ctx.fillStyle = "#ec4899";
  ctx.font = `bold ${(FRONT_LAYOUT.LABEL_SIZE - 4) * scale}px ${fontMain}`;
  ctx.fillText(t('pages.certification.card.pronounsLabel').toUpperCase(), textX, currentTopY);
  currentTopY += (FRONT_LAYOUT.LABEL_SIZE + 4 * scale) * scale; // Scaled offset
  ctx.fillStyle = "#000000";
  ctx.font = `bold ${(FRONT_LAYOUT.FIELD_SIZE - 4) * scale}px ${fontMain}`;
  
  let pronounsLabel = "—";
  if (formData.pronouns) {
    if (typeof formData.pronouns === 'string') {
      pronounsLabel = formData.pronouns;
    } else if (formData.pronouns.value && ['heHim', 'sheHer', 'theyThem'].includes(formData.pronouns.value)) {
      pronounsLabel = t(`pages.certification.card.pronouns.${formData.pronouns.value}`);
    } else {
      pronounsLabel = formData.pronouns.label || "—";
    }
  }
  
  ctx.fillText(pronounsLabel, textX, currentTopY);
  currentTopY += FRONT_LAYOUT.FIELD_SIZE * scale;

  const topBlockHeight = currentTopY - topY;

  // B. Bottom Block (Positioned at the bottom of writable area)
  let bottomY = canvas.height - FRONT_LAYOUT.PADDING_BOTTOM * scale;
  ctx.textBaseline = "bottom";

  // Track Bottom Block Height for Debug
  let currentBottomY = bottomY;

  // Render Issued/Expires
  ctx.fillStyle = "#000000";
  ctx.font = `bold ${FRONT_LAYOUT.SUBTITLE_SIZE * scale}px ${fontMain}`;
  ctx.fillText(issueDate.value, textX, currentBottomY);
  ctx.fillText(expiryDate.value, textX + 180 * scale, currentBottomY);
  currentBottomY -= (FRONT_LAYOUT.SUBTITLE_SIZE + 4 * scale) * scale; // Scaled offset

  ctx.fillStyle = "#ec4899";
  ctx.font = `bold ${(FRONT_LAYOUT.LABEL_SIZE - 4) * scale}px ${fontMain}`;
  ctx.fillText(t('pages.certification.card.issued').toUpperCase(), textX, currentBottomY);
  ctx.fillText(t('pages.certification.card.expires').toUpperCase(), textX + 180 * scale, currentBottomY);
  currentBottomY -= FRONT_LAYOUT.LABEL_SIZE * scale;

  const bottomBlockHeight = bottomY - currentBottomY;

  // 5. Emblems (Absolute Bottom Right of the WHOLE card)
  const drawEmblem = async (src: string, x: number, y: number, size: number) => {
    const img = new Image();
    img.src = src;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => resolve(null);
    });
    if (img.complete && img.naturalWidth > 0) {
      const ratio = size / Math.max(img.naturalWidth, img.naturalHeight);
      ctx.drawImage(img, x, y, img.naturalWidth * ratio, img.naturalHeight * ratio);
    }
  };

  const emblemSize = FRONT_LAYOUT.EMBLEM_SIZE * scale;
  const emblemY = canvas.height - (FRONT_LAYOUT.PADDING_BOTTOM + FRONT_LAYOUT.EMBLEM_SIZE) * scale;
  const emblem2X = canvas.width - (FRONT_LAYOUT.PADDING_RIGHT + FRONT_LAYOUT.EMBLEM_SIZE) * scale;
  const emblem1X = emblem2X - (FRONT_LAYOUT.EMBLEM_SIZE + FRONT_LAYOUT.EMBLEM_GAP) * scale;

  await drawEmblem("/images/emblem_01.png", emblem1X, emblemY, emblemSize);
  await drawEmblem("/images/emblem_02.png", emblem2X, emblemY, emblemSize);

  // 6. Flag (Top Right)
  const flagPath = getFlagPath();
  if (flagPath) {
    const flagImg = new Image();
    flagImg.src = flagPath;
    await new Promise((resolve) => {
      flagImg.onload = resolve;
      flagImg.onerror = () => resolve(null);
    });
    if (flagImg.complete && flagImg.naturalWidth > 0) {
      const flagW = FRONT_LAYOUT.FLAG_W * scale;
      const flagH = (flagW * 3) / 4; // 4:3 Aspect Ratio
      const flagX = canvas.width - (FRONT_LAYOUT.PADDING_RIGHT + FRONT_LAYOUT.FLAG_W) * scale;
      const flagY = FRONT_LAYOUT.PADDING_TOP * scale;
      
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(flagX, flagY, flagW, flagH, FRONT_LAYOUT.FLAG_CORNER_RADIUS * scale);
      ctx.clip();
      ctx.drawImage(flagImg, flagX, flagY, flagW, flagH);
      ctx.restore();
    }
  }

  return canvas;
}

async function generateBackCanvas(targetWidth?: number, targetHeight?: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get context");

  // 1. Draw Background (and set canvas size based on natural dimensions)
  const bgImg = new Image();
  bgImg.src = "/images/certification_back.jpg";
  await new Promise((resolve) => {
    bgImg.onload = resolve;
    bgImg.onerror = () => resolve(null);
  });

  if (bgImg.complete && bgImg.naturalWidth > 0) {
    canvas.width = targetWidth || bgImg.naturalWidth;
    canvas.height = targetHeight || bgImg.naturalHeight;
    ctx.fillStyle = BACK_LAYOUT.PLACEHOLDER_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background covering the canvas
    const ratio = Math.max(canvas.width / bgImg.naturalWidth, canvas.height / bgImg.naturalHeight);
    const newW = bgImg.naturalWidth * ratio;
    const newH = bgImg.naturalHeight * ratio;
    ctx.drawImage(bgImg, (canvas.width - newW) / 2, (canvas.height - newH) / 2, newW, newH);
  } else {
    canvas.width = targetWidth || 1011;
    canvas.height = targetHeight || 674;
    ctx.fillStyle = BACK_LAYOUT.PLACEHOLDER_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const scale = canvas.width / 1011;

  // 2. Draw Flag SVG (Full Span)
  const flagPath = getFlagPath();
  if (flagPath) {
    const flagImg = new Image();
    flagImg.src = flagPath;
    await new Promise((resolve) => {
      flagImg.onload = resolve;
      flagImg.onerror = () => resolve(null);
    });

    if (flagImg.complete && flagImg.naturalWidth > 0) {
      const ratio = Math.max(canvas.width / flagImg.width, canvas.height / flagImg.height);
      const newW = flagImg.width * ratio;
      const newH = flagImg.height * ratio;
      ctx.drawImage(flagImg, (canvas.width - newW) / 2, (canvas.height - newH) / 2, newW, newH);
    }
  }

  // 3. Draw White Logo Block
  if (BACK_LAYOUT.RENDER_LOGO) {
    const blockX = BACK_LAYOUT.PADDING_X * scale;
    const blockY = BACK_LAYOUT.PADDING_Y * scale;
    const blockW = canvas.width - BACK_LAYOUT.PADDING_X * 2 * scale;
    const blockH = canvas.height - BACK_LAYOUT.PADDING_Y * 2 * scale;

    ctx.fillStyle = BACK_LAYOUT.BLOCK_BG;
    ctx.fillRect(blockX, blockY, blockW, blockH);

    // 4. Draw Horizontal Cor Logo
    const logoImg = new Image();
    logoImg.src = "/images/QUEERKIT_COMBOMARK_HORIZONTAL_COLOR.svg";
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = () => resolve(null);
    });

    if (logoImg.complete && logoImg.naturalWidth > 0) {
      const px = BACK_LAYOUT.LOGO_PADDING_X * scale;
      const py = BACK_LAYOUT.LOGO_PADDING_Y * scale;
      const availableW = blockW - px * 2;
      const availableH = blockH - py * 2;
      const ratio = Math.min(availableW / logoImg.width, availableH / logoImg.height);
      const newW = logoImg.width * ratio;
      const newH = logoImg.height * ratio;
      ctx.drawImage(logoImg, blockX + (blockW - newW) / 2, blockY + (blockH - newH) / 2, newW, newH);
    }
  }

  return canvas;
}

// Predefined options
const pronounOptions = computed(() => [
  { label: t('pages.certification.card.pronouns.heHim'), value: "heHim" },
  { label: t('pages.certification.card.pronouns.sheHer'), value: "sheHer" },
  { label: t('pages.certification.card.pronouns.theyThem'), value: "theyThem" },
]);

const genderIdentityOptions = ref([
  { label: "Cisgender", value: "Cisgender" },
  { label: "Transgender", value: "Transgender" },
  { label: "Bigender", value: "Bigender" },
  { label: "Genderfluid", value: "Genderfluid" },
  { label: "Intersex", value: "Intersex" },
  { label: "Agender", value: "Agender" },
]);

const sexualIdentityOptions = ref([
  { label: "Heterosexual", value: "Heterosexual" },
  { label: "Homosexual (Gay)", value: "Homosexual-Gay" },
  { label: "Homosexual (Lesbian)", value: "Homosexual-Lesbian" },
  { label: "Bisexual", value: "Bisexual" },
  { label: "Pansexual", value: "Pansexual" },
  { label: "Abrosexual", value: "Abrosexual" },
  { label: "Demisexual", value: "Demisexual" },
  { label: "Asexual", value: "Asexual" },
]);

const romanticIdentityOptions = ref([
  { label: "Heteroromantic", value: "Heteroromantic" },
  { label: "Homoromantic", value: "Homoromantic" },
  { label: "Biromantic", value: "Biromantic" },
  { label: "Panromantic", value: "Panromantic" },
  { label: "Abroromantic", value: "Abroromantic" },
  { label: "Demiromantic", value: "Demiromantic" },
  { label: "Aromantic", value: "Aromantic" },
]);

const relationshipIdentityOptions = ref([
  { label: "Monogamous", value: "Monogamous" },
  { label: "Polygamous", value: "Polygamous" },
]);

const customOptions = ref<any[]>([]);

const identityOptions = computed(() => [
  { type: "label", label: "Gender Identity" },
  ...genderIdentityOptions.value.map((o) => ({ ...o, category: "Gender" })),
  { type: "separator" },
  { type: "label", label: "Sexual Identity" },
  ...sexualIdentityOptions.value.map((o) => ({ ...o, category: "Sexual" })),
  { type: "separator" },
  { type: "label", label: "Romantic Identity" },
  ...romanticIdentityOptions.value.map((o) => ({ ...o, category: "Romantic" })),
  { type: "separator" },
  { type: "label", label: "Relationship Identity" },
  ...relationshipIdentityOptions.value.map((o) => ({ ...o, category: "Relationship" })),
  ...(customOptions.value.length > 0
    ? [
        { type: "separator" },
        { type: "label", label: "Custom" },
        ...customOptions.value.map((o) => ({ ...o, category: "Identity" })),
      ]
    : []),
]);

function onIdentityCreate(item: string) {
  const newOption = { label: item, value: item, category: "Identity" };
  customOptions.value.push(newOption);
  formData.identity = newOption;
}

// Generate ID (QK-xxxxxx derived from name and date)
const generationId = computed(() => {
  if (!formData.name) return "QK-000000";
  const dateParts = new Date().toISOString().split("T")[0];
  const dateStr = (dateParts || "").replace(/-/g, "");
  const hash = formData.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const derivedNum = (hash * parseInt(dateStr.slice(-4) || "0")) % 1000000;
  return `QK-${derivedNum.toString().padStart(6, "0")}`;
});

// Helper to format date as dd/mm/yyyy
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Generate issue date (today)
const issueDate = computed(() => {
  return formatDate(new Date());
});

// Generate expiry date (1 year from now)
const expiryDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return formatDate(date);
});

const getFlagPath = (identityLabel?: string) => {
  const identity = identityLabel || getTagLabel(formData.identity);
  return getFlagPathByIdentity(identity);
};

const backCardBackground = computed(() => {
  return "/images/certification_back.jpg";
});
</script>

<template>
  <UContainer class="py-12">
    <!-- Header Section -->
    <div class="mb-12 text-center">
      <h1 class="mb-4 text-4xl font-bold md:text-5xl text-black">{{ t('pages.certification.sections.hero.title') }}</h1>
      <p class="mx-auto max-w-2xl text-lg text-black">
        {{ t('pages.certification.sections.hero.description') }}
      </p>
    </div>

    <!-- Form Section -->
    <div class="mb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column: Photo & Name -->
        <div class="flex flex-col gap-6">
          <!-- Photo Upload -->
          <UFormField :label="t('pages.certification.sections.apply.fields.photo.label')" name="image" :ui="{ label: 'text-black', help: 'text-neutral-600' }">
            <UInput type="file" accept="image/*" size="lg" @change="onFileChange" />
            <template #help> {{ t('pages.certification.sections.apply.fields.photo.description') }} </template>
          </UFormField>

          <!-- Name -->
          <UFormField :label="t('pages.certification.sections.apply.fields.name.label')" name="name" required :ui="{ label: 'text-black' }">
            <UInput v-model="formData.name" :placeholder="t('pages.certification.sections.apply.fields.name.placeholder')" size="lg" />
          </UFormField>
        </div>

        <!-- Right Column: Pronouns & Identity -->
        <div class="flex flex-col gap-6">
          <!-- Pronouns -->
          <UFormField :label="t('pages.certification.sections.apply.fields.pronouns.label')" name="pronouns" required :ui="{ label: 'text-black' }">
            <USelectMenu
              v-model="formData.pronouns"
              :items="pronounOptions"
              by="value"
              label-key="label"
              create-item
              :placeholder="t('pages.certification.sections.apply.fields.pronouns.placeholder')"
              searchable
              size="lg"
              @create="
                (item) => {
                  formData.pronouns = { label: item, value: item };
                }
              "
            />
          </UFormField>

          <!-- Combined Identity Select -->
          <UFormField :label="t('pages.certification.sections.apply.fields.identity.label')" name="identity" required :ui="{ label: 'text-black', help: 'text-neutral-600' }">
            <USelectMenu
              v-model="formData.identity"
              :items="identityOptions"
              by="value"
              label-key="label"
              create-item
              :placeholder="t('pages.certification.sections.apply.fields.identity.placeholder')"
              searchable
              size="lg"
              @create="onIdentityCreate"
            />
            <template #help> {{ t('pages.certification.sections.apply.fields.identity.description') }} </template>
          </UFormField>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div>
      <h2 class="mb-6 text-2xl font-bold text-black">{{ t('pages.certification.sections.preview.title') }}</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Front Card Preview -->
        <div>
          <h3 class="mb-4 text-lg font-semibold text-black">Front</h3>
          <div
            ref="frontCardRef"
            class="relative overflow-hidden rounded-xl shadow-2xl bg-cover bg-center"
            :style="{
              backgroundImage: 'url(/images/certification_front.jpg)',
              aspectRatio: frontImageStats.width && frontImageStats.height ? `${frontImageStats.width}/${frontImageStats.height}` : '3/2',
            }"
          >
              <div class="h-full relative overflow-hidden">
                <div
                  v-if="getFlagPath()"
                  class="absolute z-30 rounded-sm overflow-hidden"
                  :style="{
                    top: `${FRONT_LAYOUT.PADDING_TOP * previewScale}px`,
                    right: `${FRONT_LAYOUT.PADDING_RIGHT * previewScale}px`,
                    width: `${FRONT_LAYOUT.FLAG_W * previewScale}px`,
                    aspectRatio: '4/3'
                  }"
                >
                  <img :src="getFlagPath()!" class="w-full h-full object-cover" />
                </div>

                <!-- Content Row (Flexbox Boundary) -->
              <div
                class="absolute flex items-start z-10"
                :style="{
                  top: `${FRONT_LAYOUT.PADDING_TOP * previewScale}px`,
                  bottom: `${FRONT_LAYOUT.PADDING_BOTTOM * previewScale}px`,
                  left: `${FRONT_LAYOUT.PADDING_LEFT * previewScale}px`,
                  right: `${FRONT_LAYOUT.PADDING_RIGHT * previewScale}px`,
                  gap: `${FRONT_LAYOUT.GAP_HORIZONTAL * previewScale}px`
                }"
              >
                <!-- Photo / Note Column (Left) -->
                <div class="flex flex-col justify-between h-full" :style="{ width: `${FRONT_LAYOUT.PHOTO_W * previewScale}px` }">
                  <!-- Photo Placeholder -->
                  <div
                    class="shrink-0 flex items-center justify-center bg-black/40 border border-primary-500 overflow-hidden"
                    :style="{
                      width: `${FRONT_LAYOUT.PHOTO_W * previewScale}px`,
                      height: `${FRONT_LAYOUT.PHOTO_H * previewScale}px`,
                      borderRadius: `${FRONT_LAYOUT.PHOTO_CORNER_RADIUS * previewScale}px`
                    }"
                  >
                    <img
                      v-if="formData.image"
                      :src="formData.image"
                      class="w-full h-full object-cover"
                    />
                    <UIcon v-else class="size-12 text-primary-400" name="lucide:user" />
                  </div>

                  <!-- Institute Note (Left Bottom) -->
                  <p
                    class="text-black leading-tight"
                    :style="{ fontSize: `${FRONT_LAYOUT.NOTE_SIZE * previewScale}px` }"
                  >
                    {{ $t('pages.certification.card.instituteNote') }}
                  </p>
                </div>

                <!-- Personal Information / Middle Column (Vertical Flexbox) -->
                <div class="flex flex-col flex-1 h-full">
                  <!-- Top Block -->
                  <div
                    class="flex flex-col"
                    :class="{ 'border-2 border-blue-500': FRONT_LAYOUT.RENDER_DEBUG }"
                  >
                    <h2
                      class="font-bold text-pink-500 leading-none m-0"
                      :style="{ fontSize: `${FRONT_LAYOUT.TITLE_SIZE * previewScale}px` }"
                    >
                      {{ $t('pages.certification.card.title', { identity: (!getTagLabel(formData.identity) || getTagLabel(formData.identity) === '—') ? $t('pages.certification.card.defaultIdentity') : getTagLabel(formData.identity) }) }}
                    </h2>
                    <p
                      class="font-bold text-black opacity-80 m-0"
                      :style="{ fontSize: `${FRONT_LAYOUT.SUBTITLE_SIZE * previewScale}px` }"
                    >
                      {{ $t('pages.certification.card.registryId') }}: {{ generationId }}
                    </p>

                    <div class="flex flex-col">
                      <p
                        class="font-semibold uppercase tracking-wider text-pink-500 m-0"
                        :style="{ fontSize: `${(FRONT_LAYOUT.LABEL_SIZE - 4) * previewScale}px` }"
                      >
                        {{ $t('pages.certification.card.name') }}
                      </p>
                      <p
                        class="font-bold text-black leading-tight m-0"
                        :style="{ fontSize: `${FRONT_LAYOUT.FIELD_SIZE * previewScale}px` }"
                      >
                        {{ formData.name || "—" }}
                      </p>
                    </div>
                    <div class="flex flex-col">
                      <p
                        class="font-semibold uppercase tracking-wider text-pink-500 m-0"
                        :style="{ fontSize: `${(FRONT_LAYOUT.LABEL_SIZE - 4) * previewScale}px` }"
                      >
                        {{ $t('pages.certification.card.pronounsLabel') }}
                      </p>
                      <p
                        class="font-bold text-black m-0"
                        :style="{ fontSize: `${(FRONT_LAYOUT.FIELD_SIZE - 4) * previewScale}px` }"
                      >
                        <template v-if="formData.pronouns">
                          {{ ['heHim', 'sheHer', 'theyThem'].includes(formData.pronouns.value) ? $t(`pages.certification.card.pronouns.${formData.pronouns.value}`) : getTagLabel(formData.pronouns) }}
                        </template>
                        <template v-else>—</template>
                      </p>
                    </div>
                  </div>

                  <!-- Bottom Block -->
                  <div
                    class="flex flex-col"
                    :class="{ 'border-2 border-blue-500': FRONT_LAYOUT.RENDER_DEBUG }"
                    :style="{ gap: `${(FRONT_LAYOUT.GAP_VERTICAL / 2) * previewScale}px` }"
                  >
                    <div class="flex">
                      <div :style="{ width: `${180 * previewScale}px` }">
                        <p
                          class="font-semibold uppercase text-pink-500"
                          :style="{ fontSize: `${(FRONT_LAYOUT.LABEL_SIZE - 4) * previewScale}px` }"
                        >
                          {{ $t('pages.certification.card.issued') }}
                        </p>
                        <p
                          class="text-black font-bold"
                          :style="{ fontSize: `${FRONT_LAYOUT.SUBTITLE_SIZE * previewScale}px` }"
                        >
                          {{ issueDate }}
                        </p>
                      </div>
                      <div>
                        <p
                          class="font-semibold uppercase text-pink-500"
                          :style="{ fontSize: `${(FRONT_LAYOUT.LABEL_SIZE - 4) * previewScale}px` }"
                        >
                          {{ $t('pages.certification.card.expires') }}
                        </p>
                        <p
                          class="text-black font-bold"
                          :style="{ fontSize: `${FRONT_LAYOUT.SUBTITLE_SIZE * previewScale}px` }"
                        >
                          {{ expiryDate }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Emblems (Absolute Bottom Right of CARD) -->
                <div
                  class="absolute pointer-events-none flex items-end z-30"
                  :style="{
                    gap: `${FRONT_LAYOUT.EMBLEM_GAP * previewScale}px`,
                    bottom: 0,
                    right: 0
                  }"
                >
                  <img
                    src="/images/emblem_01.png"
                    class="object-contain"
                    :style="{ height: `${FRONT_LAYOUT.EMBLEM_SIZE * previewScale}px`, width: `${FRONT_LAYOUT.EMBLEM_SIZE * previewScale}px` }"
                  />
                  <img
                    src="/images/emblem_02.png"
                    class="object-contain"
                    :style="{ height: `${FRONT_LAYOUT.EMBLEM_SIZE * previewScale}px`, width: `${FRONT_LAYOUT.EMBLEM_SIZE * previewScale}px` }"
                  />
                </div>

                <!-- Preview Watermark -->
                <div
                  class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none opacity-20 select-none overflow-hidden"
                >
                  <span
                    class="text-primary-500 font-bold border-8 border-primary-500 px-8 py-4 rounded-3xl whitespace-nowrap"
                    :style="{ fontSize: `${120 * previewScale}px` }"
                  >
                    PREVIEW
                  </span>
                </div>
              </div>
            </div>
            <!-- Debug Border Overlay -->
            <div
              v-if="FRONT_LAYOUT.RENDER_DEBUG"
              class="absolute border-2 border-red-500 pointer-events-none z-50"
              :style="{
                top: `${FRONT_LAYOUT.PADDING_TOP * previewScale}px`,
                bottom: `${FRONT_LAYOUT.PADDING_BOTTOM * previewScale}px`,
                left: `${FRONT_LAYOUT.PADDING_LEFT * previewScale}px`,
                right: `${FRONT_LAYOUT.PADDING_RIGHT * previewScale}px`
              }"
            ></div>
          </div>
        </div>

        <!-- Back Side Preview -->
        <div>
          <h3 class="mb-4 text-lg font-semibold text-black">Back</h3>
          <div
            class="relative overflow-hidden rounded-xl shadow-2xl bg-cover bg-center"
            :style="{
              backgroundImage: `url(${backCardBackground})`,
              backgroundColor: BACK_LAYOUT.PLACEHOLDER_BG,
              aspectRatio: frontImageStats.width && frontImageStats.height ? `${frontImageStats.width}/${frontImageStats.height}` : '3/2',
            }"
          >
            <!-- Full Span Flag Overlay -->
            <img
              v-if="getFlagPath()"
              :key="getFlagPath()!"
              :src="getFlagPath()!"
              class="absolute inset-0 h-full w-full object-cover z-0 rounded-xl"
              @error="(e) => (e.target as any).style.visibility = 'hidden'"
              @load="(e) => (e.target as any).style.visibility = 'visible'"
            />

            <!-- Logo Overlay -->
            <div
              v-if="BACK_LAYOUT.RENDER_LOGO"
              class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
              <!-- White Logo Block -->
              <div
                class="shadow-2xl flex items-center justify-center pointer-events-auto"
                :style="{
                  top: `${BACK_LAYOUT.PADDING_Y * previewScale}px`,
                  bottom: `${BACK_LAYOUT.PADDING_Y * previewScale}px`,
                  left: `${BACK_LAYOUT.PADDING_X * previewScale}px`,
                  right: `${BACK_LAYOUT.PADDING_X * previewScale}px`,
                  paddingTop: `${BACK_LAYOUT.LOGO_PADDING_Y * previewScale}px`,
                  paddingBottom: `${BACK_LAYOUT.LOGO_PADDING_Y * previewScale}px`,
                  paddingLeft: `${BACK_LAYOUT.LOGO_PADDING_X * previewScale}px`,
                  paddingRight: `${BACK_LAYOUT.LOGO_PADDING_X * previewScale}px`,
                  backgroundColor: BACK_LAYOUT.BLOCK_BG,
                  position: 'absolute'
                }"
              >
                <img src="/images/QUEERKIT_COMBOMARK_HORIZONTAL_COLOR.svg" class="h-full w-auto object-contain" />
              </div>
            </div>

            <!-- Preview Watermark -->
            <div
              v-if="formData.identity"
              class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none opacity-20 select-none overflow-hidden"
            >
              <span
                class="text-primary-500 font-bold border-8 border-primary-500 px-8 py-4 rounded-3xl whitespace-nowrap"
                :style="{ fontSize: `${120 * previewScale}px` }"
              >
                PREVIEW
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Download Button -->
      <div class="mt-8">
        <UButton
          :disabled="!formData.name"
          block
          color="primary"
          label="Download Your Card"
          leading-icon="lucide:download"
          size="lg"
          @click="downloadCard"
        />
        <p class="mt-2 text-center text-xs text-neutral-600">Fill out your name to download</p>
      </div>
    </div>
  </UContainer>
</template>
