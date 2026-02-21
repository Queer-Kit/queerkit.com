<script lang="ts" setup>
// Metadata
useSeoMeta({
  title: "LGBT+ Certification - QueerKit",
  description: "Get your official (totally legitimate) LGBT+ Certification Card!",
});

// Form state
const formData = reactive({
  name: "",
  pronouns: null as any,
  identity: null as any,
  image: null as string | null,
});

// Helper for display preview
const getTagLabel = (val: any) => {
  if (!val) return "â€”";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val.label) return val.label;
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

// Generate and download the card
// Generate and download both sides of the card
async function downloadCard() {
  const nameSlug = formData.name.toLowerCase().replace(/\s+/g, "-") || "card";

  // Front Side
  const frontCanvas = await generateFrontCanvas();
  downloadFile(frontCanvas.toDataURL("image/png"), `queerkit-front-${nameSlug}.png`);

  // Back Side
  const backCanvas = await generateBackCanvas();
  downloadFile(backCanvas.toDataURL("image/png"), `queerkit-back-${nameSlug}.png`);
}

function downloadFile(href: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = href;
  link.click();
}

async function generateFrontCanvas() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get context");

  canvas.width = 1011;
  canvas.height = 674; // 3:2 Ratio

  // 1. Draw Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#ec4899");
  gradient.addColorStop(0.5, "#a855f7");
  gradient.addColorStop(1, "#3b82f6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  const margin = 20;
  ctx.beginPath();
  ctx.roundRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2, 20);
  ctx.fill();

  // 2. Header
  ctx.fillStyle = "#fb7185";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("OFFICIAL LGBT+ CERTIFICATION", 60, 70);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px sans-serif";
  ctx.fillText("QueerKitâ„¢", 60, 120);
  ctx.font = "40px sans-serif";
  ctx.fillText("ðŸ³ï¸â€ðŸŒˆ", canvas.width - 100, 80);

  // 3. Image
  if (formData.image) {
    const img = new Image();
    img.src = formData.image;
    await new Promise((resolve) => (img.onload = resolve));
    const imgX = 60,
      imgY = 160,
      imgW = 210,
      imgH = 280;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgW, imgH, 20);
    ctx.clip();

    // Maintain aspect ratio (center crop)
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

  // 4. Fields
  const textX = 300;
  let currentY = 160; // Align with top of image (imgY)
  const drawFieldFront = (label: string, value: any, size: number = 24) => {
    const displayValue = getTagLabel(value);
    ctx.fillStyle = "#fb7185";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(label.toUpperCase(), textX, currentY);
    currentY += 30;
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillText(displayValue || "â€”", textX, currentY);
    currentY += 50;
  };

  drawFieldFront("Name", formData.name, 32);

  const startY = currentY;
  if (formData.pronouns) {
    drawFieldFront("Pronouns", formData.pronouns, 24);
  }

  if (formData.identity) {
    // Reset Y to start of previous field call to put them side-by-side
    currentY = startY;
    const label =
      (typeof formData.identity === "object" && formData.identity.category) || "Identity";

    // Draw identity to the right
    const identityX = 550; // Offset from textX (300)
    const displayValue = getTagLabel(formData.identity);

    ctx.fillStyle = "#fb7185";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(label.toUpperCase(), identityX, currentY);

    currentY += 30;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(displayValue || "â€”", identityX, currentY);

    currentY += 50; // Resume vertical flow
  }

  // 5. Footer
  ctx.strokeStyle = "rgba(251, 113, 133, 0.2)";
  ctx.beginPath();
  ctx.moveTo(60, 520);
  ctx.lineTo(canvas.width - 60, 520);
  ctx.stroke();

  currentY = 550;
  ctx.fillStyle = "#fb7185";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("CERT. NO.", 60, currentY);
  currentY += 20;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px monospace";
  ctx.fillText(generationId.value, 60, currentY);

  currentY += 30;
  ctx.font = "bold 12px sans-serif";
  ctx.fillStyle = "#fb7185";
  ctx.fillText("ISSUED:", 60, currentY);
  let labelWidth = ctx.measureText("ISSUED:").width;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(issueDate.value, 60 + labelWidth + 4, currentY);
  currentY += 18;
  ctx.fillStyle = "#fb7185";
  ctx.fillText("EXPIRES:", 60, currentY);
  labelWidth = ctx.measureText("EXPIRES:").width;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(expiryDate.value, 60 + labelWidth + 4, currentY);

  return canvas;
}

async function generateBackCanvas() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get context");

  canvas.width = 1011;
  canvas.height = 674; // 3:2 Ratio

  // 1. Draw Identity Background (Load image with gradient fallback)
  const theme = getIdentityTheme.value;

  try {
    const bgImg = new Image();
    bgImg.src = theme.bgImage;
    await new Promise((resolve, reject) => {
      bgImg.onload = resolve;
      bgImg.onerror = reject;
    });
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } catch (err) {
    // Fallback to gradient if image fails to load
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    theme.colors.forEach((color, i) => {
      gradient.addColorStop(i / (theme.colors.length - 1), color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 2. Draw White Logo Block (Same size as previous black block)
  const blockW = 600,
    blockH = 300;
  const blockX = (canvas.width - blockW) / 2;
  const blockY = (canvas.height - blockH) / 2;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(blockX, blockY, blockW, blockH);

  return canvas;
}

// Predefined options
const pronounOptions = ref([
  { label: "she/her", value: "she/her" },
  { label: "he/him", value: "he/him" },
  { label: "they/them", value: "they/them" },
  { label: "she/they", value: "she/they" },
  { label: "he/they", value: "he/they" },
  { label: "they/she", value: "they/she" },
  { label: "they/he", value: "they/he" },
  { label: "it/its", value: "it/its" },
  { label: "xe/xem", value: "xe/xem" },
  { label: "fae/faer", value: "fae/faer" },
  { label: "ze/zir", value: "ze/zir" },
  { label: "ze/hir", value: "ze/hir" },
  { label: "ey/em", value: "ey/em" },
  { label: "ve/ver", value: "ve/ver" },
  { label: "per/per", value: "per/per" },
  { label: "hu/hum", value: "hu/hum" },
  { label: "ae/aer", value: "ae/aer" },
  { label: "ne/nem", value: "ne/nem" },
  { label: "name only", value: "name only" },
  { label: "use name", value: "use name" },
  { label: "no pronouns", value: "no pronouns" },
  { label: "any pronouns", value: "any pronouns" },
  { label: "ask me", value: "ask me" },
]);

const genderIdentityOptions = ref([
  { label: "Woman", value: "Woman" },
  { label: "Man", value: "Man" },
  { label: "Non-binary", value: "Non-binary" },
  { label: "Genderfluid", value: "Genderfluid" },
  { label: "Genderqueer", value: "Genderqueer" },
  { label: "Agender", value: "Agender" },
  { label: "Bigender", value: "Bigender" },
  { label: "Demigirl", value: "Demigirl" },
  { label: "Demiboy", value: "Demiboy" },
  { label: "Demigender", value: "Demigender" },
  { label: "Two-Spirit", value: "Two-Spirit" },
  { label: "Transgender", value: "Transgender" },
  { label: "Trans-feminine", value: "Trans-feminine" },
  { label: "Trans-masculine", value: "Trans-masculine" },
  { label: "Cisgender", value: "Cisgender" },
  { label: "Cis-Woman", value: "Cis-Woman" },
  { label: "Cis-Man", value: "Cis-Man" },
  { label: "Pangender", value: "Pangender" },
  { label: "Neutrois", value: "Neutrois" },
  { label: "Intersex", value: "Intersex" },
  { label: "Maverique", value: "Maverique" },
  { label: "Gender Non-conforming", value: "Gender Non-conforming" },
  { label: "Gender-neutral", value: "Gender-neutral" },
  { label: "Polygender", value: "Polygender" },
  { label: "Xenogender", value: "Xenogender" },
  { label: "Liberafluid", value: "Liberafluid" },
  { label: "Liberragender", value: "Liberragender" },
  { label: "Gender-questioning", value: "Gender-questioning" },
]);

const sexualOrientationOptions = ref([
  { label: "Lesbian", value: "Lesbian" },
  { label: "Gay", value: "Gay" },
  { label: "Bisexual", value: "Bisexual" },
  { label: "Pansexual", value: "Pansexual" },
  { label: "Asexual", value: "Asexual" },
  { label: "Demisexual", value: "Demisexual" },
  { label: "Queer", value: "Queer" },
  { label: "Gray-asexual", value: "Gray-asexual" },
  { label: "Aromantic Asexual (AroAce)", value: "AroAce" },
  { label: "Polysexual", value: "Polysexual" },
  { label: "Omnisexual", value: "Omnisexual" },
  { label: "Ceterosexual", value: "Ceterosexual" },
  { label: "Heterosexual", value: "Heterosexual" },
  { label: "Homoflexible", value: "Homoflexible" },
  { label: "Biflexible", value: "Biflexible" },
  { label: "Questioning", value: "Questioning" },
  { label: "Unlabeled", value: "Unlabeled" },
  { label: "Fluid", value: "Fluid" },
  { label: "Abrosexual", value: "Abrosexual" },
  { label: "Androsexual", value: "Androsexual" },
  { label: "Gynesexual", value: "Gynesexual" },
  { label: "Skoliosexual", value: "Skoliosexual" },
  { label: "Pomosexual", value: "Pomosexual" },
  { label: "Sapiosexual", value: "Sapiosexual" },
  { label: "Ace-spec", value: "Ace-spec" },
  { label: "Aro-spec", value: "Aro-spec" },
]);

const romanticOrientationOptions = ref([
  { label: "Homoromantic", value: "Homoromantic" },
  { label: "Heteroromantic", value: "Heteroromantic" },
  { label: "Biromantic", value: "Biromantic" },
  { label: "Panromantic", value: "Panromantic" },
  { label: "Aromantic", value: "Aromantic" },
  { label: "Demiromantic", value: "Demiromantic" },
  { label: "Gray-romantic", value: "Gray-romantic" },
  { label: "Queer", value: "Queer" },
  { label: "Polyromantic", value: "Polyromantic" },
  { label: "Fluid", value: "Fluid" },
  { label: "Same as sexual orientation", value: "Matching" },
  { label: "Questioning", value: "Questioning" },
]);

const relationshipOrientationOptions = ref([
  { label: "Monogamous", value: "Monogamous" },
  { label: "Polyamorous", value: "Polyamorous" },
  { label: "Relationship Anarchist", value: "Relationship Anarchist" },
  { label: "Solo Poly", value: "Solo Poly" },
  { label: "Ambiamorous", value: "Ambiamorous" },
  { label: "Open Relationship", value: "Open Relationship" },
  { label: "Monogamish", value: "Monogamish" },
  { label: "Poly-fidelitous", value: "Poly-fidelitous" },
  { label: "Hierarchical Poly", value: "Hierarchical Poly" },
  { label: "Non-hierarchical Poly", value: "Non-hierarchical Poly" },
  { label: "Kitchen Table Poly", value: "Kitchen Table Poly" },
  { label: "Parallel Poly", value: "Parallel Poly" },
  { label: "Questioning", value: "Questioning" },
]);

const customOptions = ref<any[]>([]);

const identityOptions = computed(() => [
  { type: "label", label: "Gender Identity" },
  ...genderIdentityOptions.value.map((o) => ({ ...o, category: "Gender" })),
  { type: "separator" },
  { type: "label", label: "Sexual Orientation" },
  ...sexualOrientationOptions.value.map((o) => ({ ...o, category: "Orientation" })),
  { type: "separator" },
  { type: "label", label: "Romantic Orientation" },
  ...romanticOrientationOptions.value.map((o) => ({ ...o, category: "Romantic" })),
  { type: "separator" },
  { type: "label", label: "Relationship Orientation" },
  ...relationshipOrientationOptions.value.map((o) => ({ ...o, category: "Relationship Style" })),
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

// Back card background mapping (Colors for Canvas and Classes for CSS)
const identityThemes = {
  trans: {
    bgImage: "/images/certification/back-bg-trans.png",
    colors: ["#5BCEFA", "#F5A9B8", "#5BCEFA"],
  },
  nonbinary: {
    bgImage: "/images/certification/back-bg-nonbinary.png",
    colors: ["#FCF434", "#FFFFFF", "#9C59D1", "#2C2C2C"],
  },
  bi: {
    bgImage: "/images/certification/back-bg-bi.png",
    colors: ["#D60270", "#9B4F96", "#0038A8"],
  },
  pan: {
    bgImage: "/images/certification/back-bg-pan.png",
    colors: ["#FF218C", "#FFD800", "#21B1FF"],
  },
  lesbian: {
    bgImage: "/images/certification/back-bg-lesbian.png",
    colors: ["#D52D00", "#FF9A56", "#FFFFFF", "#D362A4", "#A30262"],
  },
  ace: {
    bgImage: "/images/certification/back-bg-ace.png",
    colors: ["#000000", "#A3A3A3", "#FFFFFF", "#800080"],
  },
  aro: {
    bgImage: "/images/certification/back-bg-aro.png",
    colors: ["#3DA542", "#A7D379", "#FFFFFF", "#A9A9A9", "#000000"],
  },
  genderqueer: {
    bgImage: "/images/certification/back-bg-genderqueer.png",
    colors: ["#B57EDC", "#FFFFFF", "#4A8123"],
  },
  genderfluid: {
    bgImage: "/images/certification/back-bg-genderfluid.png",
    colors: ["#FF75A2", "#FFFFFF", "#BE18D6", "#000000", "#333EBD"],
  },
  agender: {
    bgImage: "/images/certification/back-bg-agender.png",
    colors: ["#000000", "#B9B9B9", "#FFFFFF", "#B8F483", "#FFFFFF", "#B9B9B9", "#000000"],
  },
  rainbow: {
    bgImage: "/images/certification/back-bg-rainbow.png",
    colors: ["#FF0018", "#FFA52C", "#FFFF41", "#008018", "#0000F9", "#86007D"],
  },
};

const getIdentityTheme = computed(() => {
  const identity = getTagLabel(formData.identity)?.toLowerCase() || "";
  if (identity.includes("trans")) return identityThemes.trans;
  if (identity.includes("non-binary") || identity.includes("enby")) return identityThemes.nonbinary;
  if (identity.includes("bisexual") || identity.includes("bi ")) return identityThemes.bi;
  if (identity.includes("pansexual") || identity.includes("pan ")) return identityThemes.pan;
  if (identity.includes("lesbian")) return identityThemes.lesbian;
  if (identity.includes("asexual") || identity === "ace") return identityThemes.ace;
  if (identity.includes("aromantic")) return identityThemes.aro;
  if (identity.includes("genderqueer")) return identityThemes.genderqueer;
  if (identity.includes("genderfluid")) return identityThemes.genderfluid;
  if (identity.includes("agender")) return identityThemes.agender;
  return identityThemes.rainbow;
});

const backCardBackground = computed(() => {
  return {}; // No longer using class strings directly
});
</script>

<template>
  <UContainer class="py-12">
    <!-- Header Section -->
    <div class="mb-12 text-center">
      <h1 class="mb-4 text-4xl font-bold md:text-5xl">Official LGBT+ Certification</h1>
      <p class="mx-auto max-w-2xl text-lg text-dimmed">
        Welcome to the <em>totally official, absolutely legitimate, 100% legally binding</em> LGBT+
        Certification Processâ„¢! Fill out the form below to receive your personalized certification
        card. No tests requiredâ€”just vibes and authenticity! ðŸ³ï¸â€ðŸŒˆâœ¨
      </p>
      <p class="mt-4 text-sm italic text-dimmed">
        (Disclaimer: This is for fun and community celebration. Your identity is valid regardless of
        any "certification"!)
      </p>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Form Section -->
      <div>
        <UCard>
          <template #header>
            <h2 class="text-2xl font-bold">Certification Application</h2>
            <p class="text-sm text-dimmed">
              Tell us about yourself (or your fabulously queer alter ego)
            </p>
          </template>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- Left Side: Basic Identity -->
            <div class="flex flex-col gap-6">
              <h3 class="text-lg font-semibold text-primary-400">Personal Info</h3>

              <!-- Name -->
              <UFormField label="Full Name" name="name" required>
                <UInput v-model="formData.name" placeholder="Enter your name" size="lg" />
              </UFormField>

              <!-- Photo Upload -->
              <UFormField label="Your Photo" name="image">
                <UInput type="file" accept="image/*" size="lg" @change="onFileChange" />
                <template #help> Square photos work best for the ID card! </template>
              </UFormField>

              <!-- Pronouns -->
              <UFormField label="Pronouns" name="pronouns" required>
                <USelectMenu
                  v-model="formData.pronouns"
                  :items="pronounOptions"
                  by="value"
                  label-key="label"
                  create-item
                  placeholder="Select or type your pronouns"
                  searchable
                  size="lg"
                  @create="
                    (item) => {
                      pronounOptions.push({ label: item, value: item });
                      formData.pronouns = { label: item, value: item };
                    }
                  "
                />
              </UFormField>
            </div>

            <!-- Right Side: LGBT+ Identity -->
            <div class="flex flex-col gap-6">
              <h3 class="text-lg font-semibold text-primary-400">Certification Details</h3>

              <!-- Combined Identity Select -->
              <UFormField label="Primary Identity" name="identity" required>
                <USelectMenu
                  v-model="formData.identity"
                  :items="identityOptions"
                  by="value"
                  label-key="label"
                  create-item
                  placeholder="Select your primary identity"
                  searchable
                  size="lg"
                  @create="onIdentityCreate"
                />
                <template #help> Choose the identity you want to feature on your card! </template>
              </UFormField>
            </div>
          </div>
        </UCard>
      </div>

      <!-- ID Card Preview Section -->
      <div class="flex flex-col gap-4">
        <div class="sticky top-24">
          <h2 class="mb-4 text-2xl font-bold">Your Certification Card</h2>
          <p class="mb-6 text-sm text-dimmed">
            This is a live preview of your certification card. Fill out the form to see it update in
            real-time!
          </p>

          <!-- Front Card Preview -->
          <div
            class="relative overflow-hidden rounded-xl border-2 border-primary-500 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-1 shadow-2xl aspect-[3/2]"
          >
            <div class="rounded-lg bg-black p-6 h-full flex flex-col">
              <!-- Header -->
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-primary-400">
                    Official LGBT+ Certification
                  </h3>
                  <p class="text-2xl font-bold text-white">QueerKitâ„¢</p>
                </div>
                <div class="text-right">
                  <div class="text-4xl">ðŸ³ï¸â€ðŸŒˆ</div>
                </div>
              </div>

              <!-- Content Row: Photo & Info -->
              <div class="flex gap-6 items-start mb-4">
                <!-- Photo Placeholder -->
                <div
                  class="shrink-0 flex h-32 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 overflow-hidden"
                >
                  <img
                    v-if="formData.image"
                    :src="formData.image"
                    class="w-full h-full object-cover"
                  />
                  <UIcon v-else class="size-12 text-primary-400" name="lucide:user" />
                </div>

                <!-- Personal Information -->
                <div class="space-y-3 pt-1">
                  <div>
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-primary-400">
                      Name
                    </p>
                    <p class="text-lg font-bold text-white leading-tight">
                      {{ formData.name || "Your Name Here" }}
                    </p>
                  </div>

                  <div class="flex gap-8">
                    <div v-if="formData.pronouns">
                      <p
                        class="text-[10px] font-semibold uppercase tracking-wider text-primary-400"
                      >
                        Pronouns
                      </p>
                      <p class="text-sm text-white">
                        {{ getTagLabel(formData.pronouns) }}
                      </p>
                    </div>

                    <div v-if="formData.identity">
                      <p
                        class="text-[10px] font-semibold uppercase tracking-wider text-primary-400"
                      >
                        {{
                          (typeof formData.identity === "object" && formData.identity.category) ||
                          "Identity"
                        }}
                      </p>
                      <p class="text-md font-bold text-white leading-tight">
                        {{ getTagLabel(formData.identity) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div
                class="mt-auto border-t border-primary-500/30 pt-4 px-1 flex flex-col gap-sm text-xs"
              >
                <div>
                  <p class="font-semibold uppercase tracking-wider text-primary-400 text-[10px]">
                    Cert. No.
                  </p>
                  <p class="font-mono text-white">{{ generationId }}</p>
                </div>

                <!-- Issued / Expires Vertical Stack -->
                <div class="flex flex-col gap-sm">
                  <div class="flex gap-1 items-center">
                    <span class="font-semibold uppercase text-primary-400 text-[10px]"
                      >Issued:</span
                    >
                    <span class="text-white">{{ issueDate }}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <span class="font-semibold uppercase text-primary-400 text-[10px]"
                      >Expires:</span
                    >
                    <span class="text-white">{{ expiryDate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Back Side Preview -->
          <div
            class="relative overflow-hidden rounded-xl border-2 border-primary-500 p-1 shadow-2xl mt-4 aspect-[3/2]"
          >
            <div
              class="rounded-lg flex flex-col items-center justify-center p-6 text-center bg-cover bg-center h-full"
              :style="{ backgroundImage: `url(${getIdentityTheme.bgImage})` }"
            >
              <!-- White Logo Block (Non-rounded, replaces previous black block) -->
              <div class="aspect-[2/1] w-[60%] bg-white shadow-2xl"></div>
            </div>
          </div>

          <!-- Download Button -->
          <div class="mt-6">
            <UButton
              :disabled="!formData.name"
              block
              color="primary"
              label="Download Your Card"
              leading-icon="lucide:download"
              size="lg"
              @click="downloadCard"
            />
            <p class="mt-2 text-center text-xs text-dimmed">Fill out your name to download</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Fun Facts Section -->
    <div class="mt-16">
      <UCard>
        <template #header>
          <h2 class="text-2xl font-bold">Did You Know? ðŸŒˆ</h2>
        </template>
        <div class="space-y-4 text-dimmed">
          <p>
            â€¢ This certification is as official as a participation trophy, but infinitely more
            fabulous!
          </p>
          <p>
            â€¢ Your identity doesn't need validation from anyoneâ€”but if you want a pretty card,
            we've got you covered.
          </p>
          <p>
            â€¢ The only test required is: "Are you being your authentic self?" If yes, you pass!
            ðŸŽ‰
          </p>
          <p>
            â€¢ Side effects may include: increased confidence, finding your community, and an
            inexplicable urge to own more rainbow items.
          </p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
