"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { createMenu, updateMenu } from "../../actions/menu.actions";
import type { MenuCategory } from "../../types";

type MenuData = {
  _id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  image: string | null;
  isAvailable: boolean;
  featured: boolean;
  priceVerified: boolean;
};

type MenuTheme = "modern-futuristic" | "traditional-heritage" | "contemporary-cozy";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: MenuData | null;
  branchId?: string;
  onSuccess: () => void;
  theme?: MenuTheme;
};

type MenuFormValues = {
  name: string;
  description: string;
  category: MenuCategory;
  price: string;
  image: string;
  isAvailable: boolean;
  featured: boolean;
  priceVerified: boolean;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

const categories: MenuCategory[] = ["Kopi", "Minuman", "Makanan"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const initialForm: MenuFormValues = {
  name: "",
  description: "",
  category: "Kopi",
  price: "",
  image: "",
  isAvailable: true,
  featured: false,
  priceVerified: false,
};

function getInitialForm(menu: MenuData | null): MenuFormValues {
  if (!menu) return { ...initialForm };

  return {
    name: menu.name,
    description: menu.description,
    category: menu.category,
    price: String(menu.price),
    image: menu.image ?? "",
    isAvailable: menu.isAvailable,
    featured: menu.featured,
    priceVerified: menu.priceVerified,
  };
}

export function MenuFormDialog(props: Props) {
  if (!props.open) return null;

  const formKey = props.menu?._id ?? "new-menu";

  return <MenuFormContent key={formKey} {...props} />;
}

function MenuFormContent({
  onOpenChange,
  menu,
  branchId,
  onSuccess,
  theme = "contemporary-cozy",
}: Props) {
  const [form, setForm] = useState<MenuFormValues>(() => getInitialForm(menu));
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(menu?.image ?? "");
  const [removeImage, setRemoveImage] = useState(false);

  const isEdit = Boolean(menu);
  const isModern = theme === "modern-futuristic";

  function updateField<K extends keyof MenuFormValues>(field: K, value: MenuFormValues[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Format gambar harus JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setImageFile(file);
    setRemoveImage(false);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };

    reader.onerror = () => {
      toast.error("Gagal menampilkan preview gambar.");
    };

    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(true);
    updateField("image", "");
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) {
      return removeImage ? "" : form.image.trim();
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Konfigurasi Cloudinary belum lengkap. Periksa file .env.local.");
      return null;
    }

    const uploadData = new FormData();
    uploadData.append("file", imageFile);
    uploadData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadData,
    });

    const result = (await response.json()) as CloudinaryUploadResponse;

    if (!response.ok || !result.secure_url) {
      throw new Error(result.error?.message ?? "Gagal mengunggah gambar ke Cloudinary.");
    }

    return result.secure_url;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const normalizedName = form.name.trim();
    const normalizedDescription = form.description.trim();

    if (!normalizedName || !normalizedDescription) {
      toast.error("Nama dan deskripsi menu wajib diisi.");
      return;
    }

    if (normalizedName.length > 100 || normalizedDescription.length > 1000) {
      toast.error("Nama atau deskripsi menu melebihi batas karakter.");
      return;
    }

    if (form.price.trim() === "") {
      toast.error("Harga menu wajib diisi.");
      return;
    }

    const price = Number(form.price);

    if (!Number.isSafeInteger(price) || price < 0) {
      toast.error("Harga harus berupa angka bulat yang valid.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      if (imageUrl === null) return;

      const input = {
        name: normalizedName,
        description: normalizedDescription,
        category: form.category,
        price,
        image: imageUrl,
        isAvailable: form.isAvailable,
        featured: form.featured,
        priceVerified: form.priceVerified,
        ...(branchId ? { branchId } : {}),
      };

      const result =
        isEdit && menu
          ? await updateMenu({
              ...input,
              id: menu._id,
            })
          : await createMenu(input);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Menu form submission error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : isEdit
            ? "Gagal memperbarui menu."
            : "Gagal menambahkan menu.",
      );
    } finally {
      setLoading(false);
    }
  }

  function closeDialog() {
    if (!loading) onOpenChange(false);
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='menu-form-title'
    >
      <button
        type='button'
        aria-label='Tutup dialog'
        onClick={closeDialog}
        disabled={loading}
        className={`fixed inset-0 disabled:cursor-not-allowed ${
          isModern ? "bg-[#020617]/75 backdrop-blur-sm" : "bg-black/50 backdrop-blur-sm"
        }`}
      />

      <div
        className={`relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl shadow-xl ${
          isModern
            ? "border border-cyan-300/15 bg-[#0b1220] text-slate-100 shadow-black/50"
            : "border bg-background"
        }`}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between px-5 py-4 ${
            isModern ? "border-b border-white/[0.08] bg-[#0b1220]" : "border-b bg-background"
          }`}
        >
          <div>
            <div className='flex items-center gap-2'>
              <h2 id='menu-form-title' className={`font-semibold ${isModern ? "text-white" : ""}`}>
                {isEdit ? "Edit Menu" : "Tambah Menu"}
              </h2>

              {isModern && (
                <span className='rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300'>
                  Menu
                </span>
              )}
            </div>

            <p
              className={`mt-0.5 text-sm ${isModern ? "text-slate-400" : "text-muted-foreground"}`}
            >
              {isEdit ? "Perbarui informasi menu." : "Tambahkan menu baru ke cabang ini."}
            </p>
          </div>

          <button
            type='button'
            disabled={loading}
            onClick={closeDialog}
            aria-label='Tutup dialog'
            className={`rounded-lg p-2 transition disabled:opacity-50 ${
              isModern
                ? "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <X className='size-4' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5 p-5'>
          <div className='space-y-2'>
            <label
              htmlFor='menu-name'
              className={`text-sm font-medium ${isModern ? "text-slate-200" : ""}`}
            >
              Nama Menu
            </label>

            <input
              id='menu-name'
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder='Contoh: Ice Coffee Logi'
              maxLength={100}
              required
              disabled={loading}
              className={`h-10 w-full rounded-lg px-3 text-sm outline-none transition disabled:opacity-60 ${
                isModern
                  ? "border border-white/[0.10] bg-[#111a29] text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                  : "border bg-background focus:ring-2 focus:ring-ring"
              }`}
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='menu-description'
              className={`text-sm font-medium ${isModern ? "text-slate-200" : ""}`}
            >
              Deskripsi
            </label>

            <textarea
              id='menu-description'
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder='Deskripsi singkat menu...'
              maxLength={1000}
              rows={4}
              required
              disabled={loading}
              className={`w-full resize-none rounded-lg px-3 py-2 text-sm outline-none transition disabled:opacity-60 ${
                isModern
                  ? "border border-white/[0.10] bg-[#111a29] text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                  : "border bg-background focus:ring-2 focus:ring-ring"
              }`}
            />
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <label
                htmlFor='menu-category'
                className={`text-sm font-medium ${isModern ? "text-slate-200" : ""}`}
              >
                Kategori
              </label>

              <select
                id='menu-category'
                value={form.category}
                onChange={(event) => updateField("category", event.target.value as MenuCategory)}
                disabled={loading}
                className={`h-10 w-full rounded-lg px-3 text-sm outline-none transition disabled:opacity-60 ${
                  isModern
                    ? "border border-white/[0.10] bg-[#111a29] text-slate-100 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                    : "border bg-background focus:ring-2 focus:ring-ring"
                }`}
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className={isModern ? "bg-[#111a29] text-slate-100" : ""}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='menu-price'
                className={`text-sm font-medium ${isModern ? "text-slate-200" : ""}`}
              >
                Harga (Rp)
              </label>

              <input
                id='menu-price'
                type='number'
                min={0}
                step={1}
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder='25000'
                required
                disabled={loading}
                className={`h-10 w-full rounded-lg px-3 text-sm outline-none transition disabled:opacity-60 ${
                  isModern
                    ? "border border-white/[0.10] bg-[#111a29] text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                    : "border bg-background focus:ring-2 focus:ring-ring"
                }`}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='menu-image'
              className={`text-sm font-medium ${isModern ? "text-slate-200" : ""}`}
            >
              Gambar Menu
            </label>

            {imagePreview ? (
              <div
                className={`relative overflow-hidden rounded-xl ${
                  isModern ? "border border-white/[0.10] bg-[#111a29]" : "border bg-muted"
                }`}
              >
                <img
                  src={imagePreview}
                  alt='Preview gambar menu'
                  className='h-52 w-full object-cover'
                />

                <button
                  type='button'
                  onClick={handleRemoveImage}
                  disabled={loading}
                  aria-label='Hapus gambar'
                  className={`absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-full border shadow-sm transition disabled:opacity-50 ${
                    isModern
                      ? "border-white/[0.12] bg-[#0b1220]/90 text-slate-200 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
                      : "bg-background/90 text-foreground hover:bg-background"
                  }`}
                >
                  <X className='size-4' />
                </button>

                <div
                  className={`border-t px-3 py-2 ${
                    isModern ? "border-white/[0.08] bg-[#0b1220]" : "bg-background"
                  }`}
                >
                  <p
                    className={`truncate text-xs ${
                      isModern ? "text-slate-400" : "text-muted-foreground"
                    }`}
                  >
                    {imageFile ? imageFile.name : "Gambar yang tersimpan saat ini"}
                  </p>
                </div>
              </div>
            ) : (
              <label
                htmlFor='menu-image'
                className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-6 text-center transition ${
                  isModern
                    ? "border-cyan-300/20 bg-[#111a29]/70 hover:border-cyan-300/35 hover:bg-cyan-300/[0.04]"
                    : "bg-muted/30 hover:bg-muted/60"
                }`}
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-xl border ${
                    isModern ? "border-cyan-300/15 bg-cyan-300/[0.06]" : "bg-background"
                  }`}
                >
                  <ImagePlus
                    className={`size-6 ${isModern ? "text-cyan-300" : "text-muted-foreground"}`}
                  />
                </span>

                <span>
                  <span className={`block text-sm font-medium ${isModern ? "text-slate-200" : ""}`}>
                    Pilih gambar menu
                  </span>

                  <span
                    className={`mt-1 block text-xs ${
                      isModern ? "text-slate-500" : "text-muted-foreground"
                    }`}
                  >
                    Klik untuk memilih gambar dari perangkatmu
                  </span>
                </span>
              </label>
            )}

            <input
              id='menu-image'
              type='file'
              accept='image/jpeg,image/png,image/webp'
              onChange={handleImageChange}
              disabled={loading}
              className={`block w-full cursor-pointer rounded-lg text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
                isModern
                  ? "border border-white/[0.10] bg-[#111a29] text-slate-400 file:mr-3 file:h-10 file:border-0 file:border-r file:border-white/[0.08] file:bg-white/[0.04] file:px-3 file:text-sm file:font-medium file:text-slate-300"
                  : "border bg-background file:mr-3 file:h-10 file:border-0 file:border-r file:bg-muted file:px-3 file:text-sm file:font-medium"
              }`}
            />

            <p className={`text-xs ${isModern ? "text-slate-500" : "text-muted-foreground"}`}>
              Format JPG, PNG, atau WebP. Maksimal 5 MB. Preview ditampilkan sebelum gambar diunggah
              saat menu disimpan.
            </p>

            {imageFile && (
              <p
                className={`text-xs font-medium ${
                  isModern ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                Gambar baru siap diunggah.
              </p>
            )}
          </div>

          <div
            className={`space-y-3 rounded-xl border p-4 ${
              isModern ? "border-white/[0.08] bg-[#111a29]/70" : ""
            }`}
          >
            <label className='flex cursor-pointer items-start gap-3'>
              <input
                type='checkbox'
                checked={form.isAvailable}
                onChange={(event) => updateField("isAvailable", event.target.checked)}
                disabled={loading}
                className={`mt-0.5 size-4 ${isModern ? "accent-cyan-400" : ""}`}
              />

              <span>
                <span className={`block text-sm font-medium ${isModern ? "text-slate-200" : ""}`}>
                  Menu tersedia
                </span>

                <span
                  className={`block text-xs ${
                    isModern ? "text-slate-500" : "text-muted-foreground"
                  }`}
                >
                  Tampilkan menu sebagai tersedia.
                </span>
              </span>
            </label>

            <label className='flex cursor-pointer items-start gap-3'>
              <input
                type='checkbox'
                checked={form.featured}
                onChange={(event) => updateField("featured", event.target.checked)}
                disabled={loading}
                className={`mt-0.5 size-4 ${isModern ? "accent-cyan-400" : ""}`}
              />

              <span>
                <span className={`block text-sm font-medium ${isModern ? "text-slate-200" : ""}`}>
                  Menu unggulan
                </span>

                <span
                  className={`block text-xs ${
                    isModern ? "text-slate-500" : "text-muted-foreground"
                  }`}
                >
                  Tandai sebagai menu yang direkomendasikan.
                </span>
              </span>
            </label>

            <label className='flex cursor-pointer items-start gap-3'>
              <input
                type='checkbox'
                checked={form.priceVerified}
                onChange={(event) => updateField("priceVerified", event.target.checked)}
                disabled={loading}
                className={`mt-0.5 size-4 ${isModern ? "accent-cyan-400" : ""}`}
              />

              <span>
                <span className={`block text-sm font-medium ${isModern ? "text-slate-200" : ""}`}>
                  Harga terverifikasi
                </span>

                <span
                  className={`block text-xs ${
                    isModern ? "text-slate-500" : "text-muted-foreground"
                  }`}
                >
                  Tandai jika harga sudah dikonfirmasi.
                </span>
              </span>
            </label>
          </div>

          <div
            className={`flex justify-end gap-2 border-t pt-4 ${
              isModern ? "border-white/[0.08]" : ""
            }`}
          >
            <button
              type='button'
              disabled={loading}
              onClick={closeDialog}
              className={`h-10 rounded-lg border px-4 text-sm font-medium transition disabled:opacity-50 ${
                isModern
                  ? "border-white/[0.10] bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  : "hover:bg-muted"
              }`}
            >
              Batal
            </button>

            <button
              type='submit'
              disabled={loading}
              className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isModern
                  ? "bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/10 hover:bg-cyan-200"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              {loading && <Loader2 className='size-4 animate-spin' />}

              {loading
                ? imageFile
                  ? "Mengunggah gambar..."
                  : "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
