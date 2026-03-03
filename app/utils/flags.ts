export interface FlagDef {
  id: string;
  name: string;
  path: string;
  icon: string;
}

export const QUEER_FLAGS: FlagDef[] = [
  { id: "trans", name: "Transgender", path: "/images/flags/QUEERKIT_FLAGS_TRANS.svg", icon: "flags:QUEERKIT_FLAGS_TRANS" },
  { id: "bisexual", name: "Bisexual", path: "/images/flags/QUEERKIT_FLAGS_BISEXUAL.svg", icon: "flags:QUEERKIT_FLAGS_BISEXUAL" },
  { id: "pansexual", name: "Pansexual", path: "/images/flags/QUEERKIT_FLAGS_PANSEXUAL.svg", icon: "flags:QUEERKIT_FLAGS_PANSEXUAL" },
  { id: "lesbian", name: "Lesbian", path: "/images/flags/QUEERKIT_FLAGS_LESBIAN.svg", icon: "flags:QUEERKIT_FLAGS_LESBIAN" },
  { id: "asexual", name: "Asexual", path: "/images/flags/QUEERKIT_FLAGS_ASEXUAL.svg", icon: "flags:QUEERKIT_FLAGS_ASEXUAL" },
  { id: "aromantic", name: "Aromantic", path: "/images/flags/QUEERKIT_FLAGS_AROMANTIC.svg", icon: "flags:QUEERKIT_FLAGS_AROMANTIC" },
  { id: "genderfluid", name: "Gender fluid", path: "/images/flags/QUEERKIT_FLAGS_GENDER_FLUID.svg", icon: "flags:QUEERKIT_FLAGS_GENDER_FLUID" },
  { id: "agender", name: "Agender", path: "/images/flags/QUEERKIT_FLAGS_AGENDER.svg", icon: "flags:QUEERKIT_FLAGS_AGENDER" },
  { id: "gay", name: "Gay", path: "/images/flags/QUEERKIT_FLAGS_GAY.svg", icon: "flags:QUEERKIT_FLAGS_GAY" },
  { id: "intersex", name: "Intersex", path: "/images/flags/QUEERKIT_FLAGS_INTERSEX.svg", icon: "flags:QUEERKIT_FLAGS_INTERSEX" },
  { id: "demisexual", name: "Demisexual", path: "/images/flags/QUEERKIT_FLAGS_DEMISEXUAL.svg", icon: "flags:QUEERKIT_FLAGS_DEMISEXUAL" },
  { id: "abrosexual", name: "Abrosexual", path: "/images/flags/QUEERKIT_FLAGS_ABROSEX.svg", icon: "flags:QUEERKIT_FLAGS_ABROSEX" },
  { id: "androgynous", name: "Androgynous", path: "/images/flags/QUEERKIT_FLAGS_ANDROGYNOUS.svg", icon: "flags:QUEERKIT_FLAGS_ANDROGYNOUS" },
  { id: "nonbinary", name: "Non-binary", path: "/images/flags/QUEERKIT_FLAGS_NON_BINARY.svg", icon: "flags:QUEERKIT_FLAGS_NON_BINARY" },
  { id: "nonmono", name: "Non-monogamy", path: "/images/flags/QUEERKIT_FLAGS_NON_MONO.svg", icon: "flags:QUEERKIT_FLAGS_NON_MONO" },
  { id: "polyamory", name: "Polyamory", path: "/images/flags/QUEERKIT_FLAGS_POLYAMORY.svg", icon: "flags:QUEERKIT_FLAGS_POLYAMORY" },
  { id: "polysexual", name: "Polysexual", path: "/images/flags/QUEERKIT_FLAGS_POLYSEXUAL.svg", icon: "flags:QUEERKIT_FLAGS_POLYSEXUAL" },
  { id: "queer", name: "Queer", path: "/images/flags/QUEERKIT_FLAGS_QUEER.svg", icon: "flags:QUEERKIT_FLAGS_QUEER" }
];

export const getFlagPathByIdentity = (identityLabel?: string | null): string | null => {
  if (!identityLabel || identityLabel === "—") return null;
  const identity = identityLabel.toLowerCase();

  // Normalized mappings for the specified identities
  if (identity.includes("trans")) return QUEER_FLAGS.find(f => f.id === "trans")?.path || null;
  if (identity.includes("bisexual") || identity === "bi") return QUEER_FLAGS.find(f => f.id === "bisexual")?.path || null;
  if (identity.includes("pansexual") || identity === "pan") return QUEER_FLAGS.find(f => f.id === "pansexual")?.path || null;
  if (identity.includes("lesbian")) return QUEER_FLAGS.find(f => f.id === "lesbian")?.path || null;
  if (identity.includes("asexual") || identity === "ace") return QUEER_FLAGS.find(f => f.id === "asexual")?.path || null;
  if (identity.includes("aromantic") || identity === "aro") return QUEER_FLAGS.find(f => f.id === "aromantic")?.path || null;
  if (identity.includes("genderfluid")) return QUEER_FLAGS.find(f => f.id === "genderfluid")?.path || null;
  if (identity.includes("agender")) return QUEER_FLAGS.find(f => f.id === "agender")?.path || null;
  if (identity.includes("gay")) return QUEER_FLAGS.find(f => f.id === "gay")?.path || null;
  if (identity.includes("intersex")) return QUEER_FLAGS.find(f => f.id === "intersex")?.path || null;
  if (identity.includes("demisexual")) return QUEER_FLAGS.find(f => f.id === "demisexual")?.path || null;
  if (identity.includes("abrosexual")) return QUEER_FLAGS.find(f => f.id === "abrosexual")?.path || null;

  // Slugified fallback for remaining items
  const slug = identity
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .toUpperCase();
  return `/images/flags/QUEERKIT_FLAGS_${slug || "UNKNOWN"}.svg`;
};
