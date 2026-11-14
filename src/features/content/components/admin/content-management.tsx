"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CalendarDays, Check, Clock3, ExternalLink, FileImage, Globe2, ImagePlus,
  LoaderCircle, Menu, Newspaper, Pencil, Plus, RefreshCw, Search, Sparkles,
  Trash2, Users, X,
} from "lucide-react";
import { toast } from "sonner";
import {
  createBranchContentAction,
  deleteBranchContentAction,
  getBranchContentsAction,
  updateBranchContentAction,
} from "@/features/content/actions/content.actions";
import { CONTENT_TYPE_LABELS, CONTENT_TYPES, type BranchContent, type ContentLayoutSize, type ContentStatus, type ContentType } from "@/features/content/types";

type Props = { branchId?: string; branchSlug: string; branchName: string; onToggleMobileNav?: () => void };
type FormState = {
  type: ContentType; title: string; description: string; image: string; mediaText: string;
  category: string; tagsText: string; layoutSize: ContentLayoutSize; featured: boolean;
  status: ContentStatus; publishedAt: string; expiresAt: string; startAt: string; endAt: string;
  location: string; communityName: string; collaborationType: string; ctaLabel: string;
  ctaUrl: string; platform: string; externalUrl: string; author: string; sortOrder: string;
};

const EMPTY_FORM: FormState = {
  type: "gallery", title: "", description: "", image: "", mediaText: "", category: "",
  tagsText: "", layoutSize: "auto", featured: false, status: "draft", publishedAt: "",
  expiresAt: "", startAt: "", endAt: "", location: "", communityName: "",
  collaborationType: "", ctaLabel: "", ctaUrl: "", platform: "", externalUrl: "",
  author: "", sortOrder: "0",
};

const TYPE_ICONS: Record<ContentType, typeof FileImage> = {
  gallery: FileImage, event: CalendarDays, promotion: Sparkles, community: Users,
  news: Newspaper, social: Globe2,
};
const TYPE_DESCRIPTIONS: Record<ContentType, string> = {
  gallery: "Foto suasana, interior, eksterior, dan produk Kopilogi.",
  event: "Agenda acara, kegiatan, poster, tanggal, dan lokasi.",
  promotion: "Banner iklan, diskon, penawaran, dan tombol ajakan.",
  community: "Kolaborasi komunitas, gathering, dan momen pelanggan.",
  news: "Pengumuman cabang, menu baru, dan informasi terbaru.",
  social: "Konten pilihan dan tautan dari media sosial Kopilogi.",
};

function dateToInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}
function toForm(item?: BranchContent): FormState {
  if (!item) return EMPTY_FORM;
  return {
    type: item.type, title: item.title, description: item.description ?? "", image: item.image ?? "",
    mediaText: (item.media ?? []).join("\n"), category: item.category ?? "", tagsText: (item.tags ?? []).join(", "),
    layoutSize: item.layoutSize ?? "auto", featured: Boolean(item.featured), status: item.status,
    publishedAt: dateToInput(item.publishedAt), expiresAt: dateToInput(item.expiresAt),
    startAt: dateToInput(item.startAt), endAt: dateToInput(item.endAt), location: item.location ?? "",
    communityName: item.communityName ?? "", collaborationType: item.collaborationType ?? "",
    ctaLabel: item.ctaLabel ?? "", ctaUrl: item.ctaUrl ?? "", platform: item.platform ?? "",
    externalUrl: item.externalUrl ?? "", author: item.author ?? "", sortOrder: String(item.sortOrder ?? 0),
  };
}
const inputClass = "mt-1.5 w-full rounded-xl border border-white/10 bg-[#101316] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10";
const labelClass = "text-xs font-medium text-[#AEB7BC]";

export function ContentManagement({ branchId, branchSlug, branchName, onToggleMobileNav }: Props) {
  const [items, setItems] = useState<BranchContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeType, setActiveType] = useState<ContentType | "all">("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editing, setEditing] = useState<BranchContent | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const branchNumber = branchSlug === "cabang-1" ? "01" : branchSlug === "cabang-2" ? "02" : branchSlug === "cabang-4" ? "04" : "—";

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await getBranchContentsAction(branchId);
    if (result.success) setItems(result.data ?? []);
    else toast.error(result.message);
    setLoading(false);
  }, [branchId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const counts = useMemo(() => ({
    total: items.length,
    published: items.filter((item) => item.status === "published").length,
    draft: items.filter((item) => item.status === "draft").length,
    scheduled: items.filter((item) => item.status === "published" && item.publishedAt && new Date(item.publishedAt) > new Date()).length,
  }), [items]);

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesType = activeType === "all" || item.type === activeType;
    const query = search.trim().toLocaleLowerCase("id-ID");
    const matchesSearch = !query || `${item.title} ${item.description} ${item.category} ${item.communityName}`.toLocaleLowerCase("id-ID").includes(query);
    return matchesType && matchesSearch;
  }), [items, activeType, search]);

  function openCreate(type: ContentType = "gallery") {
    setEditing(null); setForm({ ...EMPTY_FORM, type }); setImageFile(null); setMediaFiles([]); setImagePreview(""); setPreviewOpen(false); setModalOpen(true);
  }
  function openEdit(item: BranchContent) {
    setEditing(item); setForm(toForm(item)); setImageFile(null); setMediaFiles([]); setImagePreview(item.image ?? ""); setPreviewOpen(false); setModalOpen(true);
  }
  function closeModal() { if (saving) return; setModalOpen(false); setEditing(null); setImageFile(null); setMediaFiles([]); setPreviewOpen(false); }
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); }

  function handleImageChange(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Pilih file gambar yang valid."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Ukuran gambar maksimal 10 MB."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadFile(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error("Konfigurasi Cloudinary belum lengkap. Periksa .env.local.");
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);
    body.append("folder", `kopilogi/${branchSlug}/content`);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
    const result = await response.json() as { secure_url?: string; error?: { message?: string } };
    if (!response.ok || !result.secure_url) throw new Error(result.error?.message ?? "Upload gambar gagal.");
    return result.secure_url;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (!form.title.trim()) { toast.error("Judul konten wajib diisi."); return; }
    setSaving(true);
    try {
      const image = imageFile ? await uploadFile(imageFile) : form.image.trim();
      const uploadedMedia = mediaFiles.length ? await Promise.all(mediaFiles.map((file) => uploadFile(file))) : [];
      const toIsoDate = (value: string) => (value ? new Date(value).toISOString() : "");
      const payload = {
        ...form,
        image,
        media: [...form.mediaText.split("\n").map((url) => url.trim()).filter(Boolean), ...uploadedMedia],
        tags: form.tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
        sortOrder: Number(form.sortOrder) || 0,
        publishedAt: toIsoDate(form.publishedAt),
        expiresAt: toIsoDate(form.expiresAt),
        startAt: toIsoDate(form.startAt),
        endAt: toIsoDate(form.endAt),
        branchId,
      };
      const result = editing
        ? await updateBranchContentAction({ ...payload, id: editing._id })
        : await createBranchContentAction(payload);
      if (!result.success) { toast.error(result.message); return; }
      toast.success(result.message); setModalOpen(false); setEditing(null); setImageFile(null); setMediaFiles([]); setPreviewOpen(false); await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan konten.");
    } finally { setSaving(false); }
  }

  async function handleDelete(item: BranchContent) {
    if (!window.confirm(`Hapus konten “${item.title}”? Tindakan ini tidak dapat dibatalkan.`)) return;
    const result = await deleteBranchContentAction({ id: item._id, branchId });
    if (!result.success) { toast.error(result.message); return; }
    toast.success(result.message); setItems((current) => current.filter((entry) => entry._id !== item._id));
  }

  return (
    <div data-content-theme={branchSlug === "cabang-2" ? "heritage" : branchSlug === "cabang-4" ? "contemporary" : "futuristic"} className="min-h-screen bg-[#101112] text-[#E7E9EA]">
      <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between gap-3 border-b border-white/[0.08] bg-[#101112]/95 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-9">
        <div className="flex min-w-0 items-center gap-3">
          {onToggleMobileNav && <button type="button" onClick={onToggleMobileNav} aria-label="Buka navigasi" className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-[#B8BEC2] hover:bg-white/[0.05] lg:hidden"><Menu className="size-5" /></button>}
          <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8D969B]">Kopilogi / Sistem Manajemen / Konten Website</p>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl">Konten Website</h1>
          </div>
        </div>
        <button onClick={() => openCreate(activeType === "all" ? "gallery" : activeType)} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#D8F36A] px-3.5 text-xs font-semibold text-[#171A15] transition hover:bg-[#e5ff82] sm:px-4 sm:text-sm">
          <Plus className="size-4" /> <span className="hidden sm:inline">Tambah Konten</span><span className="sm:hidden">Tambah</span>
        </button>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#A4ADB2]"><span className="size-1.5 rounded-full bg-[#D8F36A]" /> Cabang {branchNumber} · {branchName}</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Kelola cerita cabang.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#929B9F]">Atur gallery, event, promosi, komunitas, berita, dan highlight media sosial yang tampil di website publik.</p>
          </div>
          <button onClick={() => void refresh()} disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-white/10 px-3.5 text-xs text-[#B7C0C4] transition hover:bg-white/[0.05] disabled:opacity-50 sm:self-auto"><RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh data</button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total konten", value: counts.total, icon: FileImage },
            { label: "Published", value: counts.published, icon: Check },
            { label: "Draft", value: counts.draft, icon: Pencil },
            { label: "Terjadwal", value: counts.scheduled, icon: Clock3 },
          ].map((stat) => <div key={stat.label} className="rounded-2xl border border-white/[0.08] bg-[#17191A] p-4 sm:p-5"><div className="flex items-center justify-between text-xs text-[#929B9F]"><span>{stat.label}</span><stat.icon className="size-4 text-[#C7D0D4]" /></div><p className="mt-3 text-2xl font-semibold tracking-tight">{stat.value}</p></div>)}
        </div>

        <div className="mt-7 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setActiveType("all")} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs transition ${activeType === "all" ? "border-[#D8F36A]/30 bg-[#D8F36A]/10 text-[#E6F6A9]" : "border-white/10 text-[#9BA4A8] hover:bg-white/[0.04]"}`}>Semua ({items.length})</button>
            {CONTENT_TYPES.map((type) => {
              const count = items.filter((item) => item.type === type).length;
              return <button key={type} onClick={() => setActiveType(type)} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs transition ${activeType === type ? "border-[#D8F36A]/30 bg-[#D8F36A]/10 text-[#E6F6A9]" : "border-white/10 text-[#9BA4A8] hover:bg-white/[0.04]"}`}>{CONTENT_TYPE_LABELS[type]} <span className="ml-1 opacity-60">{count}</span></button>;
            })}
          </div>
          <div className="relative w-full xl:max-w-xs"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/35" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul atau deskripsi..." className="h-10 w-full rounded-xl border border-white/10 bg-[#17191A] pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/20" /></div>
        </div>

        {loading ? <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((key) => <div key={key} className="h-64 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]" />)}</div> : filteredItems.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              const scheduled = item.status === "published" && item.publishedAt && new Date(item.publishedAt) > new Date();
              return <article key={item._id} className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#17191A] transition hover:-translate-y-0.5 hover:border-white/[0.15]">
                <div className="overflow-hidden bg-[#222629]">
                  {item.image ? <img src={item.image} alt={item.title} loading="lazy" className="block h-auto w-full object-contain" /> : <div className="flex min-h-40 items-center justify-center text-white/20"><Icon className="size-10" /></div>}
                  <div className="absolute left-3 top-3 flex gap-2"><span className="rounded-full border border-black/10 bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">{CONTENT_TYPE_LABELS[item.type]}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-medium backdrop-blur ${item.status === "published" ? "bg-emerald-400/90 text-[#092216]" : item.status === "draft" ? "bg-amber-300/90 text-[#2B2107]" : "bg-white/80 text-black"}`}>{scheduled ? "Terjadwal" : item.status === "published" ? "Published" : item.status === "draft" ? "Draft" : "Archived"}</span></div>
                  {item.featured && <span className="absolute bottom-3 left-3 rounded-full bg-[#D8F36A] px-2.5 py-1 text-[10px] font-semibold text-[#171A15]">Featured</span>}
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="line-clamp-1 font-semibold tracking-tight text-white">{item.title}</h3><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-[#929B9F]">{item.description || "Belum ada deskripsi."}</p></div><span className="shrink-0 rounded-lg border border-white/[0.08] px-2 py-1 text-[10px] uppercase text-[#9BA4A8]">{item.layoutSize}</span></div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3"><span className="text-[10px] text-[#778186]">Diperbarui {new Date(item.updatedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span><div className="flex gap-1.5"><button onClick={() => openEdit(item)} aria-label={`Edit ${item.title}`} className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 text-[#B9C2C6] transition hover:bg-white/10 hover:text-white"><Pencil className="size-3.5" /></button><button onClick={() => void handleDelete(item)} aria-label={`Hapus ${item.title}`} className="inline-flex size-8 items-center justify-center rounded-lg border border-rose-400/15 text-rose-300 transition hover:bg-rose-400/10"><Trash2 className="size-3.5" /></button>{item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noreferrer" aria-label="Buka tautan" className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 text-[#B9C2C6] hover:bg-white/10"><ExternalLink className="size-3.5" /></a>}</div></div>
                </div>
              </article>;
            })}
          </div>
        ) : <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-16 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#AEB7BC]"><FileImage className="size-5" /></div><h3 className="mt-4 font-semibold">Belum ada konten</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8F999E]">Mulai isi website {branchName} dengan gallery, event, promosi, dan cerita komunitas.</p><button onClick={() => openCreate(activeType === "all" ? "gallery" : activeType)} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#D8F36A] px-4 text-xs font-semibold text-[#171A15] hover:bg-[#e5ff82]"><Plus className="size-4" /> Tambah konten pertama</button></div>}
      </div>

      {modalOpen && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
        <form onSubmit={handleSubmit} className="flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#171A1C] shadow-2xl sm:max-h-[92dvh] sm:rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4 sm:px-6"><div><p className="text-[10px] uppercase tracking-[0.16em] text-[#929DA2]">Content Studio · {branchName}</p><h2 className="mt-1 text-lg font-semibold">{editing ? "Edit Konten" : "Tambah Konten Baru"}</h2></div><button type="button" onClick={closeModal} className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/65 hover:bg-white/10"><X className="size-4" /></button></div>
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            {previewOpen && <div className="overflow-hidden rounded-xl border border-[#D8F36A]/20 bg-[#222729]">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2"><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D8F36A]">Live preview · Public website</span><button type="button" onClick={() => setPreviewOpen(false)} className="text-[10px] text-white/50 hover:text-white">Tutup preview</button></div>
              <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
                <div className="overflow-hidden bg-[#343A3D]">{imagePreview ? <img src={imagePreview} alt="Preview konten" className="block h-auto w-full object-contain" /> : <div className="flex min-h-32 items-center justify-center text-white/25"><FileImage className="size-8" /></div>}</div>
                <div className="p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D8F36A]">{CONTENT_TYPE_LABELS[form.type]}</p><h3 className="mt-2 text-lg font-semibold text-white">{form.title || "Judul konten"}</h3><p className="mt-2 line-clamp-3 text-xs leading-5 text-white/60">{form.description || "Deskripsi konten akan muncul di sini."}</p>{form.ctaLabel && <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#D8F36A]">{form.ctaLabel}<ArrowUpRight className="size-3" /></span>}</div>
              </div>
            </div>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Jenis konten<select value={form.type} onChange={(e) => setField("type", e.target.value as ContentType)} className={inputClass}>{CONTENT_TYPES.map((type) => <option key={type} value={type}>{CONTENT_TYPE_LABELS[type]}</option>)}</select></label>
              <label className={labelClass}>Status publikasi<select value={form.status} onChange={(e) => setField("status", e.target.value as ContentStatus)} className={inputClass}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-xs leading-5 text-[#A2ADB2]">{TYPE_DESCRIPTIONS[form.type]} {form.type === "promotion" ? "Atur tanggal mulai dan berakhir agar banner tidak tampil di luar periode." : form.type === "event" ? "Isi waktu dan lokasi acara agar informasi event tampil lengkap." : "Konten yang berstatus Published akan ditampilkan di website setelah waktu publikasinya tercapai."}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>Judul konten *<input required maxLength={120} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Contoh: Coffee & Music Night" className={inputClass} /></label>
              <label className={`${labelClass} sm:col-span-2`}>Deskripsi<textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Ceritakan detail konten..." className={`${inputClass} resize-y`} /></label>
              <label className={labelClass}>Kategori<input value={form.category} onChange={(e) => setField("category", e.target.value)} placeholder="Contoh: Live Music" className={inputClass} /></label>
              <label className={labelClass}>Tags (pisahkan koma)<input value={form.tagsText} onChange={(e) => setField("tagsText", e.target.value)} placeholder="coffee, music, community" className={inputClass} /></label>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
              <div><span className={labelClass}>Cover image</span><label className="mt-1.5 flex min-h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-[#101316] text-center transition hover:border-[#D8F36A]/40">
                {imagePreview ? <img src={imagePreview} alt="Preview gambar" className="block max-h-64 w-full object-contain" /> : <><ImagePlus className="size-6 text-white/35" /><span className="mt-2 text-xs text-[#AEB7BC]">Pilih gambar dari perangkat</span><span className="mt-1 text-[10px] text-white/35">JPG, PNG, WEBP · Maks. 10 MB</span></>}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImageChange(e.target.files?.[0])} /></label>
                <input value={form.image} onChange={(e) => { setField("image", e.target.value); if (!imageFile) setImagePreview(/^https?:\/\//i.test(e.target.value) || e.target.value.startsWith("/") ? e.target.value : ""); }} placeholder="Atau tempel URL gambar https://..." className={inputClass} />
                {imageFile && <button type="button" onClick={() => { setImageFile(null); setImagePreview(form.image); }} className="mt-2 text-xs text-rose-300">Batalkan file yang dipilih</button>}
              </div>
              <div className="space-y-4">
                <label className={labelClass}>Ukuran card<select value={form.layoutSize} onChange={(e) => setField("layoutSize", e.target.value as ContentLayoutSize)} className={inputClass}><option value="auto">Auto — sistem menentukan</option><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option><option value="wide">Wide</option></select></label>
                <label className={labelClass}>Urutan tampil<input type="number" min="0" value={form.sortOrder} onChange={(e) => setField("sortOrder", e.target.value)} className={inputClass} /></label>
                <label className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#101316] p-3 text-xs text-[#C6CED2]"><input type="checkbox" checked={form.featured} onChange={(e) => setField("featured", e.target.checked)} className="size-4 accent-[#D8F36A]" /> Jadikan konten unggulan</label>
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Foto tambahan (opsional, bisa pilih beberapa)</label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#101316] px-4 py-3 text-xs text-[#AEB7BC] transition hover:border-[#D8F36A]/40">
                <ImagePlus className="size-4 shrink-0" />
                <span className="min-w-0 flex-1">{mediaFiles.length ? `${mediaFiles.length} foto siap diunggah` : "Pilih beberapa foto tambahan"}</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
                  const selected = Array.from(e.target.files ?? []);
                  const valid = selected.filter((file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024);
                  if (valid.length !== selected.length) toast.error("Sebagian file dilewati. Pastikan semua file berupa gambar maksimal 10 MB.");
                  setMediaFiles(valid.slice(0, 20));
                }} />
              </label>
              {mediaFiles.length > 0 && <div className="flex flex-wrap items-center gap-2 text-[10px] text-white/45"><span>{mediaFiles.map((file) => file.name).join(" · ")}</span><button type="button" onClick={() => setMediaFiles([])} className="shrink-0 text-rose-300">Hapus pilihan</button></div>}
              <label className={labelClass}>Atau URL media tambahan (satu URL per baris)<textarea rows={2} value={form.mediaText} onChange={(e) => setField("mediaText", e.target.value)} placeholder="https://..." className={`${inputClass} resize-y`} /></label>
            </div>

            {(form.type === "event" || form.type === "promotion") && <div className="rounded-xl border border-white/[0.08] p-4"><h3 className="text-sm font-semibold">Jadwal & lokasi</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className={labelClass}>{form.type === "event" ? "Mulai acara" : "Mulai tayang"}<input type="datetime-local" value={form.type === "event" ? form.startAt : form.publishedAt} onChange={(e) => setField(form.type === "event" ? "startAt" : "publishedAt", e.target.value)} className={inputClass} /></label><label className={labelClass}>{form.type === "event" ? "Selesai acara" : "Akhir promo"}<input type="datetime-local" value={form.type === "event" ? form.endAt : form.expiresAt} onChange={(e) => setField(form.type === "event" ? "endAt" : "expiresAt", e.target.value)} className={inputClass} /></label><label className={`${labelClass} sm:col-span-2`}>Lokasi<input value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="Contoh: Kopilogi Cikuray" className={inputClass} /></label></div></div>}
            {form.type === "community" && <div className="rounded-xl border border-white/[0.08] p-4"><h3 className="text-sm font-semibold">Informasi kolaborasi</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className={labelClass}>Nama komunitas<input value={form.communityName} onChange={(e) => setField("communityName", e.target.value)} placeholder="Nama komunitas" className={inputClass} /></label><label className={labelClass}>Jenis kolaborasi<input value={form.collaborationType} onChange={(e) => setField("collaborationType", e.target.value)} placeholder="Workshop, gathering, dll." className={inputClass} /></label></div></div>}
            {form.type === "social" && <div className="rounded-xl border border-white/[0.08] p-4"><h3 className="text-sm font-semibold">Media sosial</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className={labelClass}>Platform<select value={form.platform} onChange={(e) => setField("platform", e.target.value)} className={inputClass}><option value="">Pilih platform</option><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>Facebook</option><option>Lainnya</option></select></label><label className={labelClass}>URL postingan<input type="url" value={form.externalUrl} onChange={(e) => setField("externalUrl", e.target.value)} placeholder="https://..." className={inputClass} /></label></div></div>}
            {(form.type === "promotion" || form.type === "news" || form.type === "event") && <div className="grid gap-3 sm:grid-cols-2"><label className={labelClass}>Teks tombol CTA<input value={form.ctaLabel} onChange={(e) => setField("ctaLabel", e.target.value)} placeholder="Lihat detail" className={inputClass} /></label><label className={labelClass}>Link CTA<input type="text" value={form.ctaUrl} onChange={(e) => setField("ctaUrl", e.target.value)} placeholder="https://... atau /menu" className={inputClass} /></label></div>}
            <div className={`grid gap-3 sm:grid-cols-2 ${form.type === "promotion" ? "hidden" : ""}`}><label className={labelClass}>Mulai publikasi<input type="datetime-local" value={form.publishedAt} onChange={(e) => setField("publishedAt", e.target.value)} className={inputClass} /><span className="mt-1 block text-[10px] font-normal text-white/35">Kosongkan untuk langsung tampil jika status Published.</span></label><label className={labelClass}>Akhir publikasi<input type="datetime-local" value={form.expiresAt} onChange={(e) => setField("expiresAt", e.target.value)} className={inputClass} /><span className="mt-1 block text-[10px] font-normal text-white/35">Kosongkan jika tidak memiliki tanggal kedaluwarsa.</span></label></div>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-white/[0.08] bg-[#141719] px-4 py-4 sm:flex-row sm:justify-between sm:px-6"><button type="button" onClick={() => setPreviewOpen((open) => !open)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-medium text-[#B6C0C4] hover:bg-white/[0.05]"><ExternalLink className="size-3.5" />{previewOpen ? "Sembunyikan Preview" : "Preview"}</button><div className="flex flex-col-reverse gap-2 sm:flex-row"><button type="button" onClick={closeModal} disabled={saving} className="h-10 rounded-xl border border-white/10 px-4 text-xs font-medium text-[#B6C0C4] hover:bg-white/[0.05]">Batal</button><button type="submit" disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#D8F36A] px-5 text-xs font-semibold text-[#171A15] transition hover:bg-[#e5ff82] disabled:cursor-not-allowed disabled:opacity-60">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />}{saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : form.status === "published" ? "Terbitkan Konten" : "Simpan Konten"}</button></div></div>
        </form>
      </div>}
      <style jsx global>{`
        /* CMS theme overrides: only Cabang 2 and Cabang 4; Cabang 1 keeps its original dark theme. */
        [data-content-theme="heritage"] {
          --cms-page: #f4eee4;
          --cms-surface: #fbf8f2;
          --cms-surface-soft: #eee5d8;
          --cms-input: #fffdf9;
          --cms-text: #49372a;
          --cms-muted: #806b55;
          --cms-border: #d9cabb;
          --cms-accent: #49372a;
          --cms-accent-text: #fffaf2;
          background: var(--cms-page) !important;
          color: var(--cms-text) !important;
        }
        [data-content-theme="contemporary"] {
          --cms-page: #f3f4f2;
          --cms-surface: #ffffff;
          --cms-surface-soft: #e9ebe8;
          --cms-input: #ffffff;
          --cms-text: #171a18;
          --cms-muted: #626b65;
          --cms-border: #d9ddda;
          --cms-accent: #171a18;
          --cms-accent-text: #ffffff;
          background: var(--cms-page) !important;
          color: var(--cms-text) !important;
        }
        [data-content-theme="heritage"] [class*="bg-[#101112"],
        [data-content-theme="heritage"] [class*="bg-[#17191A"],
        [data-content-theme="heritage"] [class*="bg-[#171A1C"],
        [data-content-theme="heritage"] [class*="bg-[#141719"],
        [data-content-theme="heritage"] [class*="bg-[#101316"],
        [data-content-theme="heritage"] [class*="bg-[#222629"],
        [data-content-theme="heritage"] [class*="bg-[#222729"],
        [data-content-theme="heritage"] [class*="bg-white/[0.025"],
        [data-content-theme="heritage"] [class*="bg-white/[0.015"] {
          background-color: var(--cms-surface) !important;
        }
        [data-content-theme="contemporary"] [class*="bg-[#101112"],
        [data-content-theme="contemporary"] [class*="bg-[#17191A"],
        [data-content-theme="contemporary"] [class*="bg-[#171A1C"],
        [data-content-theme="contemporary"] [class*="bg-[#141719"],
        [data-content-theme="contemporary"] [class*="bg-[#101316"],
        [data-content-theme="contemporary"] [class*="bg-[#222629"],
        [data-content-theme="contemporary"] [class*="bg-[#222729"],
        [data-content-theme="contemporary"] [class*="bg-white/[0.025"],
        [data-content-theme="contemporary"] [class*="bg-white/[0.015"] {
          background-color: var(--cms-surface) !important;
        }
        [data-content-theme="heritage"] [class*="border-white"],
        [data-content-theme="contemporary"] [class*="border-white"] {
          border-color: var(--cms-border) !important;
        }
        [data-content-theme="heritage"] [class*="text-white"],
        [data-content-theme="heritage"] [class*="text-[#E7E9EA"],
        [data-content-theme="heritage"] [class*="text-[#B6C0C4"],
        [data-content-theme="heritage"] [class*="text-[#B7C0C4"],
        [data-content-theme="heritage"] [class*="text-[#B9C2C6"],
        [data-content-theme="heritage"] [class*="text-[#C6CED2"],
        [data-content-theme="contemporary"] [class*="text-white"],
        [data-content-theme="contemporary"] [class*="text-[#E7E9EA"],
        [data-content-theme="contemporary"] [class*="text-[#B6C0C4"],
        [data-content-theme="contemporary"] [class*="text-[#B7C0C4"],
        [data-content-theme="contemporary"] [class*="text-[#B9C2C6"],
        [data-content-theme="contemporary"] [class*="text-[#C6CED2"] {
          color: var(--cms-text) !important;
        }
        [data-content-theme="heritage"] [class*="text-[#929B9F"],
        [data-content-theme="heritage"] [class*="text-[#929DA2"],
        [data-content-theme="heritage"] [class*="text-[#AEB7BC"],
        [data-content-theme="heritage"] [class*="text-[#A2ADB2"],
        [data-content-theme="heritage"] [class*="text-[#9BA4A8"],
        [data-content-theme="heritage"] [class*="text-[#8F999E"],
        [data-content-theme="heritage"] [class*="text-[#778186"],
        [data-content-theme="contemporary"] [class*="text-[#929B9F"],
        [data-content-theme="contemporary"] [class*="text-[#929DA2"],
        [data-content-theme="contemporary"] [class*="text-[#AEB7BC"],
        [data-content-theme="contemporary"] [class*="text-[#A2ADB2"],
        [data-content-theme="contemporary"] [class*="text-[#9BA4A8"],
        [data-content-theme="contemporary"] [class*="text-[#8F999E"],
        [data-content-theme="contemporary"] [class*="text-[#778186"] {
          color: var(--cms-muted) !important;
        }
        [data-content-theme="heritage"] input:not([type="checkbox"]),
        [data-content-theme="heritage"] textarea,
        [data-content-theme="heritage"] select,
        [data-content-theme="contemporary"] input:not([type="checkbox"]),
        [data-content-theme="contemporary"] textarea,
        [data-content-theme="contemporary"] select {
          background-color: var(--cms-input) !important;
          color: var(--cms-text) !important;
          border-color: var(--cms-border) !important;
        }
        [data-content-theme="heritage"] input::placeholder,
        [data-content-theme="heritage"] textarea::placeholder,
        [data-content-theme="contemporary"] input::placeholder,
        [data-content-theme="contemporary"] textarea::placeholder {
          color: var(--cms-muted) !important;
          opacity: .7;
        }
        [data-content-theme="heritage"] [class*="bg-[#D8F36A"],
        [data-content-theme="heritage"] [class*="bg-[#e5ff82"] {
          background-color: #49372a !important;
          color: #fffaf2 !important;
        }
        [data-content-theme="contemporary"] [class*="bg-[#D8F36A"],
        [data-content-theme="contemporary"] [class*="bg-[#e5ff82"] {
          background-color: #b58a43 !important;
          color: #ffffff !important;
        }
        [data-content-theme="heritage"] [class*="text-[#D8F36A"],
        [data-content-theme="heritage"] [class*="text-[#E6F6A9"],
        [data-content-theme="heritage"] [class*="text-[#171A15"],
        [data-content-theme="contemporary"] [class*="text-[#D8F36A"],
        [data-content-theme="contemporary"] [class*="text-[#E6F6A9"],
        [data-content-theme="contemporary"] [class*="text-[#171A15"] {
          color: var(--cms-accent-text) !important;
        }
        [data-content-theme="heritage"] option,
        [data-content-theme="contemporary"] option {
          background: var(--cms-input);
          color: var(--cms-text);
        }
      `}</style>
    </div>
  );
}
