import type { BranchConcept } from "@/features/branches/types";

export type BranchTheme = {
  concept: BranchConcept | "super-admin";
  label: string;
  eyebrow: string;
  description: string;
  pageClassName: string;
  backgroundClassName: string;
  glowClassName: string;
  gridClassName: string;
  iconClassName: string;
  badgeClassName: string;
  cardClassName: string;
  cardHoverClassName: string;
  accentClassName: string;
  mutedClassName: string;
  animation: "futuristic" | "heritage" | "cozy" | "management";
};

const themes: Record<BranchConcept | "super-admin", BranchTheme> = {
  "modern-futuristic": {
    concept: "modern-futuristic",
    label: "Modern Futuristic",
    eyebrow: "Kopilogi · Cabang 1",
    description:
      "Kelola pengalaman digital Kopilogi dengan karakter modern, futuristik, dan dinamis.",
    pageClassName: "bg-[#100E0C] text-[#F6F0E8]",
    backgroundClassName:
      "bg-[radial-gradient(circle_at_80%_10%,rgba(214,168,111,0.16),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(255,255,255,0.05),transparent_25%)]",
    glowClassName: "bg-[#D6A86F]/20 blur-3xl",
    gridClassName:
      "bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]",
    iconClassName: "border border-[#D6A86F]/30 bg-[#D6A86F]/10 text-[#E6BE8A]",
    badgeClassName: "border-[#D6A86F]/25 bg-[#D6A86F]/10 text-[#E6BE8A]",
    cardClassName: "border-white/10 bg-white/[0.045] backdrop-blur-xl",
    cardHoverClassName: "hover:border-[#D6A86F]/40 hover:bg-white/[0.07]",
    accentClassName: "text-[#E6BE8A]",
    mutedClassName: "text-white/55",
    animation: "futuristic",
  },

  "traditional-heritage": {
    concept: "traditional-heritage",
    label: "Traditional Heritage",
    eyebrow: "Kopilogi · Cabang 2",
    description:
      "Kelola pengalaman digital Kopilogi dengan karakter hangat yang terinspirasi dari nilai tradisi dan heritage.",
    pageClassName: "bg-[#F3EBDD] text-[#38281D]",
    backgroundClassName:
      "bg-[radial-gradient(circle_at_85%_10%,rgba(123,79,48,0.12),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(166,123,91,0.12),transparent_25%)]",
    glowClassName: "bg-[#9B6A45]/10 blur-3xl",
    gridClassName:
      "bg-[linear-gradient(rgba(91,61,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(91,61,42,0.035)_1px,transparent_1px)] bg-[size:56px_56px]",
    iconClassName: "border border-[#8B6042]/20 bg-[#8B6042]/10 text-[#795039]",
    badgeClassName: "border-[#8B6042]/20 bg-[#8B6042]/10 text-[#795039]",
    cardClassName: "border-[#6B4A35]/15 bg-[#FFFDF8]/75 backdrop-blur-xl",
    cardHoverClassName: "hover:border-[#8B6042]/35 hover:bg-[#FFFDF8]",
    accentClassName: "text-[#795039]",
    mutedClassName: "text-[#6F6258]",
    animation: "heritage",
  },

  "contemporary-cozy": {
    concept: "contemporary-cozy",
    label: "Contemporary Cozy",
    eyebrow: "Kopilogi · Cabang 3",
    description:
      "Kelola pengalaman digital Kopilogi dengan suasana kontemporer yang nyaman, hangat, dan approachable.",
    pageClassName: "bg-[#F7F3EC] text-[#29231E]",
    backgroundClassName:
      "bg-[radial-gradient(circle_at_85%_10%,rgba(181,128,76,0.12),transparent_30%),radial-gradient(circle_at_5%_85%,rgba(214,190,160,0.16),transparent_30%)]",
    glowClassName: "bg-[#B5804C]/10 blur-3xl",
    gridClassName:
      "bg-[linear-gradient(rgba(70,50,35,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(70,50,35,0.025)_1px,transparent_1px)] bg-[size:64px_64px]",
    iconClassName: "border border-[#B5804C]/20 bg-[#B5804C]/10 text-[#96643A]",
    badgeClassName: "border-[#B5804C]/20 bg-[#B5804C]/10 text-[#96643A]",
    cardClassName: "border-[#5C4634]/10 bg-white/65 backdrop-blur-xl",
    cardHoverClassName: "hover:border-[#B5804C]/30 hover:bg-white/90",
    accentClassName: "text-[#96643A]",
    mutedClassName: "text-[#766B61]",
    animation: "cozy",
  },

  "super-admin": {
    concept: "super-admin",
    label: "Super Admin",
    eyebrow: "Kopilogi · Management",
    description:
      "Kelola seluruh cabang, konten, menu, dan layanan digital Kopilogi dari satu pusat administrasi.",
    pageClassName: "bg-background text-foreground",
    backgroundClassName:
      "bg-[radial-gradient(circle_at_85%_10%,rgba(120,120,120,0.08),transparent_30%)]",
    glowClassName: "bg-foreground/5 blur-3xl",
    gridClassName:
      "bg-[linear-gradient(hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:56px_56px]",
    iconClassName: "border border-border bg-accent text-foreground",
    badgeClassName: "border-border bg-accent text-foreground",
    cardClassName: "border-border bg-card/80 backdrop-blur-xl",
    cardHoverClassName: "hover:bg-accent/50",
    accentClassName: "text-foreground",
    mutedClassName: "text-muted-foreground",
    animation: "management",
  },
};

export function getBranchTheme(concept: BranchConcept | null, isSuperAdmin: boolean) {
  if (isSuperAdmin) {
    return themes["super-admin"];
  }

  return themes[concept ?? "contemporary-cozy"];
}
