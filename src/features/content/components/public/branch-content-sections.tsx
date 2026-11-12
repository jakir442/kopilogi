import { ArrowUpRight, CalendarDays, Camera, Clock3, MapPin, Users } from "lucide-react";
import type { BranchContent, ContentType } from "@/features/content/types";

type Props = { contents: BranchContent[]; branchName: string; branchSlug: string };

const sectionCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  "cabang-1": {
    eyebrow: "KOPILOGI JOURNAL",
    title: "Stories from Cikuray.",
    description: "Lihat suasana, agenda, dan cerita terbaru dari Kopilogi Cikuray.",
  },
  "cabang-2": {
    eyebrow: "CERITA WAROENG",
    title: "Hangat dalam setiap cerita.",
    description: "Momen, kegiatan, dan kabar terbaru dari Waroeng Kopilogi.",
  },
  "cabang-4": {
    eyebrow: "THE TASIK EXPERIENCE",
    title: "A little more to discover.",
    description: "Jelajahi suasana, aktivitas, dan penawaran terbaru Kopilogi Tasik.",
  },
};

const sectionTypes: { type: ContentType; title: string; description: string }[] = [
  { type: "gallery", title: "Gallery", description: "Potongan suasana dan cerita dari cabang kami." },
  { type: "event", title: "Events & activities", description: "Temukan agenda dan kegiatan yang akan datang." },
  { type: "promotion", title: "Promotions", description: "Penawaran spesial yang sedang berlangsung." },
  { type: "community", title: "Community & moments", description: "Cerita kolaborasi, pertemuan, dan momen bersama." },
  { type: "news", title: "News & updates", description: "Kabar terbaru, menu baru, dan informasi cabang." },
  { type: "social", title: "Social highlights", description: "Lihat cerita pilihan dari kanal media sosial kami." },
];

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function ContentCard({
  item,
  branchName,
  palette,
}: {
  item: BranchContent;
  branchName: string;
  palette: { card: string; image: string; eyebrow: string; title: string; body: string; meta: string; link: string; badge: string };
}) {
  const date = formatDate(item.startAt ?? item.publishedAt);
  const isWide = item.layoutSize === "wide";
  const sizeClass =
    item.layoutSize === "wide" ? "md:col-span-2 lg:col-span-12" :
    item.layoutSize === "large" || item.featured ? "md:col-span-2 lg:col-span-6" :
    item.layoutSize === "small" ? "md:col-span-1 lg:col-span-3" :
    item.layoutSize === "medium" ? "md:col-span-1 lg:col-span-4" :
    item.type === "promotion" || item.type === "event" ? "md:col-span-2 lg:col-span-6" :
    "md:col-span-1 lg:col-span-4";

  return (
    <article className={`group flex min-w-0 flex-col overflow-hidden border ${palette.card} ${sizeClass} ${isWide ? "lg:flex-row" : ""}`}>
      <div className={`relative w-full overflow-hidden ${palette.image} ${isWide ? "lg:w-1/2 lg:flex-none" : ""}`}>
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" className="block h-auto w-full object-contain" />
        ) : (
          <div className="flex min-h-40 items-center justify-center opacity-35"><Camera className="size-9" /></div>
        )}
        {item.category && <span className={`absolute left-4 top-4 border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur ${palette.badge}`}>{item.category}</span>}
      </div>

      <div className={`flex min-w-0 flex-1 flex-col p-5 sm:p-6 ${isWide ? "lg:justify-center lg:p-9" : ""}`}>
        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${palette.eyebrow}`}>
          {item.type === "event" && <CalendarDays className="size-3.5" />}
          {item.type === "community" && <Users className="size-3.5" />}
          <span>{item.type === "community" ? item.communityName || "Community" : item.type === "event" ? "Kopilogi Event" : item.type === "promotion" ? "Special Offer" : item.type === "news" ? "Kopilogi Journal" : item.type === "social" ? item.platform || "Social Media" : "Gallery"}</span>
          {date && <span className={`inline-flex items-center gap-1 ${palette.meta}`}><Clock3 className="size-3" />{date}</span>}
        </div>

        <h3 className={`mt-3 text-xl font-semibold leading-tight tracking-[-0.035em] sm:text-2xl ${palette.title}`}>{item.title}</h3>
        {item.description && <p className={`mt-3 text-sm leading-6 ${palette.body}`}>{item.description}</p>}

        {item.type === "gallery" && item.media?.length > 0 && (
          <div className="mt-4 grid grid-cols-3 items-start gap-2">
            {item.media.slice(0, 3).map((src, index) => (
              <div key={`${item._id}-media-${index}`} className={`overflow-hidden ${palette.image}`}>
                <img src={src} alt={`${item.title} ${index + 1}`} loading="lazy" className="block h-auto w-full object-contain" />
              </div>
            ))}
          </div>
        )}

        {(item.location || item.collaborationType) && (
          <p className={`mt-3 flex flex-wrap items-center gap-2 text-xs ${palette.meta}`}>
            {item.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{item.location}</span>}
            {item.collaborationType && <span>· {item.collaborationType}</span>}
          </p>
        )}

        <div className="mt-auto pt-5">
          {item.ctaUrl && item.ctaLabel ? (
            <a href={item.ctaUrl} target={item.ctaUrl.startsWith("http") ? "_blank" : undefined} rel={item.ctaUrl.startsWith("http") ? "noreferrer" : undefined} className={`inline-flex items-center gap-2 text-xs font-semibold transition hover:gap-3 ${palette.link}`}>
              {item.ctaLabel}<ArrowUpRight className="size-3.5" />
            </a>
          ) : item.externalUrl ? (
            <a href={item.externalUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 text-xs font-semibold transition hover:gap-3 ${palette.link}`}>
              Lihat postingan<ArrowUpRight className="size-3.5" />
            </a>
          ) : (
            <span className={`text-[10px] uppercase tracking-[0.14em] ${palette.meta}`}>{branchName}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function BranchContentSections({ contents, branchName, branchSlug }: Props) {
  if (!contents.length) return null;

  const isHeritage = branchSlug === "cabang-2";
  const isTasik = branchSlug === "cabang-4";
  const copy = sectionCopy[branchSlug] ?? sectionCopy["cabang-1"];

  const palette = isHeritage
    ? {
        section: "bg-[#F3EBDD] text-[#38281D]",
        divider: "border-[#765239]/25",
        eyebrow: "text-[#8A684B]",
        heading: "font-serif text-[#49372A]",
        description: "text-[#76634F]",
        count: "text-[#9A8065]",
        card: "border-[#765239]/20 bg-[#FBF8F1]",
        image: "bg-[#E7DCCB]",
        cardEyebrow: "text-[#7B6048]",
        title: "font-serif text-[#49372A]",
        body: "text-[#76634F]",
        meta: "text-[#927B64]",
        link: "text-[#765239]",
        badge: "border-[#765239]/30 bg-[#F3EBDD]/90 text-[#49372A]",
      }
    : isTasik
      ? {
          section: "bg-[#F4F3EF] text-[#2C302E]",
          divider: "border-[#C0C4C6]",
          eyebrow: "text-[#A87524]",
          heading: "text-[#2C302E]",
          description: "text-[#626965]",
          count: "text-[#929894]",
          card: "border-[#C0C4C6] bg-white/80",
          image: "bg-[#E8E8E3]",
          cardEyebrow: "text-[#A87524]",
          title: "text-[#2C302E]",
          body: "text-[#626965]",
          meta: "text-[#858B87]",
          link: "text-[#A87524]",
          badge: "border-[#2C302E]/15 bg-white/85 text-[#2C302E]",
        }
      : {
          section: "bg-[#1D1F20] text-[#E7E9EA]",
          divider: "border-[#666D71]/35",
          eyebrow: "text-[#B8C0C4]",
          heading: "text-[#E7E9EA]",
          description: "text-white/55",
          count: "text-white/35",
          card: "border-white/10 bg-[#24282A]",
          image: "bg-[#343A3D]",
          cardEyebrow: "text-[#D8F36A]/80",
          title: "text-white",
          body: "text-white/60",
          meta: "text-white/45",
          link: "text-[#D8F36A]",
          badge: "border-white/25 bg-black/35 text-white",
        };

  const visibleSections = sectionTypes
    .map((section) => ({
      ...section,
      items: contents.filter((item) => item.type === section.type),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className={palette.section}>
      {visibleSections.map((section, index) => (
        <section key={section.type} id={`content-${section.type}`} className={`border-t px-4 py-14 sm:px-8 sm:py-20 lg:px-12 ${palette.divider}`}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-9 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${palette.eyebrow}`}>{copy.eyebrow}</p>
                <h2 className={`mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl lg:text-5xl ${palette.heading}`}>{section.title === "Gallery" ? copy.title : section.title}</h2>
                <p className={`mt-3 max-w-xl text-sm leading-6 ${palette.description}`}>{section.description}</p>
              </div>
              <span className={`font-mono text-xs ${palette.count}`}>0{index + 1} / 0{visibleSections.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
              {section.items.map((item) => <ContentCard key={item._id} item={item} branchName={branchName} palette={palette} />)}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
