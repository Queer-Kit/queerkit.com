<script lang="ts" setup>
// Metadata
useSeoMeta({
  title: "LGBT+ Certification - QueerKit",
  description: "Get your official (totally legitimate) LGBT+ Certification Card!",
});

// Form state
const formData = reactive({
  name: "",
  pronouns: "",
  genderIdentity: "",
  sexualOrientation: "",
  romanticOrientation: "",
  relationshipOrientation: "",
  image: null as string | null,
});

// Helper for display preview
const getTagLabel = (val: any) => {
  if (!val) return "—";
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
async function downloadCard() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set standard ID card dimensions (e.g., 1011x638 for high quality)
  canvas.width = 1011;
  canvas.height = 638;

  // 1. Draw Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#ec4899"); // Pink-500
  gradient.addColorStop(0.5, "#a855f7"); // Purple-500
  gradient.addColorStop(1, "#3b82f6"); // Blue-500
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add a dark inner card area
  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  const margin = 20;
  ctx.beginPath();
  ctx.roundRect(margin, margin, canvas.width - (margin * 2), canvas.height - (margin * 2), 20);
  ctx.fill();

  // 2. Draw Header
  ctx.fillStyle = "#fb7185"; // primary-400
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("OFFICIAL LGBT+ CERTIFICATION", 60, 70);
  
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px sans-serif";
  ctx.fillText("QueerKit™", 60, 120);

  ctx.font = "40px sans-serif";
  ctx.fillText("🏳️‍🌈", canvas.width - 100, 80);

  // 3. Draw User Image
  if (formData.image) {
    const img = new Image();
    img.src = formData.image;
    await new Promise((resolve) => (img.onload = resolve));
    
    // Draw image with rounded corners
    const imgX = 60, imgY = 160, imgSize = 200;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgSize, imgSize, 20);
    ctx.clip();
    
    // Maintain aspect ratio (center crop)
    const ratio = Math.max(imgSize / img.width, imgSize / img.height);
    const newWidth = img.width * ratio;
    const newHeight = img.height * ratio;
    ctx.drawImage(img, imgX + (imgSize - newWidth) / 2, imgY + (imgSize - newHeight) / 2, newWidth, newHeight);
    ctx.restore();
    
    // Image border
    ctx.strokeStyle = "rgba(251, 113, 133, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(imgX, imgY, imgSize, imgSize);
  } else {
    // Placeholder if no image
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(60, 160, 200, 200, 20);
    ctx.fill();
    ctx.fillStyle = "#fb7185";
    ctx.font = "bold 100px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("?", 160, 300);
    ctx.textAlign = "left";
  }

  // 4. Draw Text Properties
  const textX = 300;
  let currentY = 190;
  const drawField = (label: string, value: any, size: number = 24) => {
    const displayValue = getTagLabel(value);
    ctx.fillStyle = "#fb7185";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(label.toUpperCase(), textX, currentY);
    currentY += 30;
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillText(displayValue || "—", textX, currentY);
    currentY += 50;
  };

  drawField("Name", formData.name, 32);
  
  const originalY = currentY;
  drawField("Pronouns", formData.pronouns);
  currentY = originalY;
  const newTextX = textX + 300;
  // Draw Gender next to Pronouns
  ctx.fillStyle = "#fb7185";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("GENDER", newTextX, currentY);
  currentY += 30;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText(getTagLabel(formData.genderIdentity) || "—", newTextX, currentY);
  currentY += 50;

  drawField("Sexual Orientation", formData.sexualOrientation);
  
  if (formData.romanticOrientation) {
    drawField("Romantic Orientation", formData.romanticOrientation);
  }
  
  if (formData.relationshipOrientation) {
    drawField("Relationship Style", formData.relationshipOrientation);
  }

  // 5. Draw Footer
  ctx.strokeStyle = "rgba(251, 113, 133, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 520);
  ctx.lineTo(canvas.width - 60, 520);
  ctx.stroke();

  currentY = 560;
  ctx.fillStyle = "#fb7185";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("CERT. NO.", 60, currentY);
  ctx.fillText("ISSUED", 300, currentY);
  ctx.fillText("EXPIRES", 540, currentY);

  currentY += 25;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px monospace";
  ctx.fillText(certificationNumber.value, 60, currentY);
  ctx.font = "bold 16px sans-serif";
  ctx.fillText(issueDate.value, 300, currentY);
  ctx.fillText(expiryDate, 540, currentY);

  // Watermark
  ctx.fillStyle = "rgba(251, 113, 133, 0.4)";
  ctx.font = "italic 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Valid in all 🌈 spaces • Powered by Pride™", canvas.width / 2, 610);

  // 6. Download
  const link = document.createElement("a");
  link.download = `queerkit-cert-${formData.name.toLowerCase().replace(/\s+/g, "-") || "card"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
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


// Generate a random certification number
const certificationNumber = computed(() => {
  if (!formData.name) return "XXXX-XXXX-XXXX";
  const hash = formData.name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const num1 = (hash % 9000) + 1000;
  const num2 = ((hash * 7) % 9000) + 1000;
  const num3 = ((hash * 13) % 9000) + 1000;
  return `${num1}-${num2}-${num3}`;
});

// Generate issue date (today)
const issueDate = computed(() => {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Generate expiry date (never expires!)
const expiryDate = "Never (You're stuck with us! 🌈)";
</script>

<template>
  <UContainer class="py-12">
    <!-- Header Section -->
    <div class="mb-12 text-center">
      <h1 class="mb-4 text-4xl font-bold md:text-5xl">
        Official LGBT+ Certification
      </h1>
      <p class="mx-auto max-w-2xl text-lg text-dimmed">
        Welcome to the <em>totally official, absolutely legitimate, 100%
          legally binding</em> LGBT+ Certification Process™! Fill out the form
        below to receive your personalized certification card. No tests
        required—just vibes and authenticity! 🏳️‍🌈✨
      </p>
      <p class="mt-4 text-sm italic text-dimmed">
        (Disclaimer: This is for fun and community celebration. Your identity is
        valid regardless of any "certification"!)
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
              <h3 class="text-lg font-semibold text-primary-400">Basic Identity</h3>
              
              <!-- Name -->
              <UFormField label="Full Name" name="name" required>
                <UInput
                  v-model="formData.name"
                  placeholder="Enter your name"
                  size="lg"
                />
              </UFormField>

              <!-- Photo Upload -->
              <UFormField label="Your Photo" name="image">
                <UInput
                  type="file"
                  accept="image/*"
                  size="lg"
                  @change="onFileChange"
                />
                <template #help>
                  Square photos work best for the ID card!
                </template>
              </UFormField>

              <!-- Pronouns -->
              <UFormField label="Pronouns" name="pronouns" required>
                <USelectMenu
                  v-model="formData.pronouns"
                  :items="pronounOptions"
                  value-key="value"
                  label-key="label"
                  create-item
                  placeholder="Select or type your pronouns"
                  searchable
                  size="lg"
                  @create="(item) => {
                    pronounOptions.push({ label: item, value: item });
                    formData.pronouns = item;
                  }"
                />
              </UFormField>

              <!-- Gender Identity -->
              <UFormField label="Gender Identity" name="genderIdentity" required>
                <USelectMenu
                  v-model="formData.genderIdentity"
                  :items="genderIdentityOptions"
                  value-key="value"
                  label-key="label"
                  create-item
                  placeholder="Select or type your gender identity"
                  searchable
                  size="lg"
                  @create="(item) => {
                    genderIdentityOptions.push({ label: item, value: item });
                    formData.genderIdentity = item;
                  }"
                />
              </UFormField>
            </div>

            <!-- Right Side: Orientations -->
            <div class="flex flex-col gap-6">
              <h3 class="text-lg font-semibold text-primary-400">Orientations</h3>

              <!-- Sexual Orientation -->
              <UFormField
                label="Sexual Orientation"
                name="sexualOrientation"
                required
              >
                <USelectMenu
                  v-model="formData.sexualOrientation"
                  :items="sexualOrientationOptions"
                  value-key="value"
                  label-key="label"
                  create-item
                  placeholder="Select or type your sexual orientation"
                  searchable
                  size="lg"
                  @create="(item) => {
                    sexualOrientationOptions.push({ label: item, value: item });
                    formData.sexualOrientation = item;
                  }"
                />
              </UFormField>

              <!-- Romantic Orientation -->
              <UFormField
                label="Romantic Orientation"
                name="romanticOrientation"
              >
                <USelectMenu
                  v-model="formData.romanticOrientation"
                  :items="romanticOrientationOptions"
                  value-key="value"
                  label-key="label"
                  create-item
                  placeholder="Select or type your romantic orientation"
                  searchable
                  size="lg"
                  @create="(item) => {
                    romanticOrientationOptions.push({ label: item, value: item });
                    formData.romanticOrientation = item;
                  }"
                />
              </UFormField>

              <!-- Relationship Orientation -->
              <UFormField
                label="Relationship Orientation"
                name="relationshipOrientation"
              >
                <USelectMenu
                  v-model="formData.relationshipOrientation"
                  :items="relationshipOrientationOptions"
                  value-key="value"
                  label-key="label"
                  create-item
                  placeholder="Select or type your relationship orientation"
                  searchable
                  size="lg"
                  @create="(item) => {
                    relationshipOrientationOptions.push({ label: item, value: item });
                    formData.relationshipOrientation = item;
                  }"
                />
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
            This is a live preview of your certification card. Fill out the form
            to see it update in real-time!
          </p>

          <!-- ID Card -->
          <div
            class="relative overflow-hidden rounded-xl border-2 border-primary-500 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-1 shadow-2xl"
          >
            <div class="rounded-lg bg-black p-6">
              <!-- Header -->
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-primary-400">
                    Official LGBT+ Certification
                  </h3>
                  <p class="text-2xl font-bold text-white">QueerKit™</p>
                </div>
                <div class="text-right">
                  <div class="text-4xl">🏳️‍🌈</div>
                </div>
              </div>

              <!-- Photo Placeholder -->
              <div
                class="mb-6 flex h-32 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 overflow-hidden"
              >
                <img v-if="formData.image" :src="formData.image" class="w-full h-full object-cover" />
                <UIcon
                  v-else
                  class="size-16 text-primary-400"
                  name="lucide:user"
                />
              </div>

              <!-- Personal Information -->
              <div class="mb-6 space-y-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wider text-primary-400">
                    Name
                  </p>
                  <p class="text-lg font-bold text-white">
                    {{ formData.name || "Your Name Here" }}
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-primary-400">
                      Pronouns
                    </p>
                    <p class="text-sm text-white">
                      {{ getTagLabel(formData.pronouns) || "—" }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-primary-400">
                      Gender
                    </p>
                    <p class="text-sm text-white">
                      {{ getTagLabel(formData.genderIdentity) || "—" }}
                    </p>
                  </div>
                </div>

                <div>
                  <p class="text-xs font-semibold uppercase tracking-wider text-primary-400">
                    Sexual Orientation
                  </p>
                  <p class="text-sm text-white">
                    {{ getTagLabel(formData.sexualOrientation) || "—" }}
                  </p>
                </div>

                <div v-if="formData.romanticOrientation">
                  <p class="text-xs font-semibold uppercase tracking-wider text-primary-400">
                    Romantic Orientation
                  </p>
                  <p class="text-sm text-white">
                    {{ getTagLabel(formData.romanticOrientation) }}
                  </p>
                </div>

                <div v-if="formData.relationshipOrientation">
                  <p class="text-xs font-semibold uppercase tracking-wider text-primary-400">
                    Relationship Style
                  </p>
                  <p class="text-sm text-white">
                    {{ getTagLabel(formData.relationshipOrientation) }}
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-primary-500/30 pt-4">
                <div class="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p class="font-semibold uppercase tracking-wider text-primary-400">
                      Cert. No.
                    </p>
                    <p class="font-mono text-white">{{ certificationNumber }}</p>
                  </div>
                  <div>
                    <p class="font-semibold uppercase tracking-wider text-primary-400">
                      Issued
                    </p>
                    <p class="text-white">{{ issueDate }}</p>
                  </div>
                </div>
                <div class="mt-3">
                  <p class="font-semibold uppercase tracking-wider text-primary-400 text-xs">
                    Expires
                  </p>
                  <p class="text-white text-xs">{{ expiryDate }}</p>
                </div>
              </div>

              <!-- Watermark -->
              <div class="mt-4 text-center">
                <p class="text-xs italic text-primary-400/60">
                  Valid in all 🌈 spaces • Powered by Pride™
                </p>
              </div>
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
            <p class="mt-2 text-center text-xs text-dimmed">
              Fill out your name to download
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Fun Facts Section -->
    <div class="mt-16">
      <UCard>
        <template #header>
          <h2 class="text-2xl font-bold">Did You Know? 🌈</h2>
        </template>
        <div class="space-y-4 text-dimmed">
          <p>
            • This certification is as official as a participation trophy, but
            infinitely more fabulous!
          </p>
          <p>
            • Your identity doesn't need validation from anyone—but if you want
            a pretty card, we've got you covered.
          </p>
          <p>
            • The only test required is: "Are you being your authentic self?"
            If yes, you pass! 🎉
          </p>
          <p>
            • Side effects may include: increased confidence, finding your
            community, and an inexplicable urge to own more rainbow items.
          </p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
