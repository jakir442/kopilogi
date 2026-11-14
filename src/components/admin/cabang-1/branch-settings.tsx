
"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import {
  Building2,
  MapPin,
  Phone,
  Clock3,
  Save,
  Settings2,
} from "lucide-react";

export type BranchSettingsValues = {
  name: string;
  address: string;
  phone: string;
  googleMapsUrl: string;
  openingHours: string;
};

type BranchSettingsProps = {
  initialData: BranchSettingsValues;
  onSave?: (
    values: BranchSettingsValues
  ) => Promise<{ success: boolean; message: string }>;
};

export function BranchSettings({
  initialData,
  onSave,
}: BranchSettingsProps) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    field: keyof BranchSettingsValues,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!onSave) {
      setMessage("Fitur penyimpanan belum dihubungkan.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const result = await onSave(form);
      setMessage(result.message);

      if (result.success) {
        setForm({ ...form });
      }
    } catch {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#101112] px-4 py-3 text-sm text-[#E7E9EA] outline-none transition placeholder:text-[#697176] focus:border-white/30";

  return (
    <main className="min-h-screen bg-[#101112] px-4 py-7 text-[#E7E9EA] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#92999D]">
            <Settings2 className="h-4 w-4" />
            Cabang 01 / Pengaturan
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Pengaturan Cabang
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A0A6AA]">
            Kelola informasi dan detail operasional cabang Kopilogi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-[#191B1C] p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Building2 className="h-5 w-5 text-[#D5DADD]" />
              </div>
              <div>
                <h2 className="font-semibold">Informasi Cabang</h2>
                <p className="mt-1 text-xs text-[#92999D]">
                  Identitas utama cabang Kopilogi.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <label className="block text-sm text-[#C8CDCF]">
                Nama Cabang
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nama cabang"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </label>

              <label className="block text-sm text-[#C8CDCF]">
                Alamat Cabang
                <textarea
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Masukkan alamat lengkap cabang"
                  rows={3}
                  required
                  maxLength={500}
                />
              </label>

              <label className="block text-sm text-[#C8CDCF]">
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Nomor Telepon
                </span>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Contoh: 081234567890"
                  maxLength={30}
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#191B1C] p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <MapPin className="h-5 w-5 text-[#D5DADD]" />
              </div>
              <div>
                <h2 className="font-semibold">Lokasi Cabang</h2>
                <p className="mt-1 text-xs text-[#92999D]">
                  Tautan lokasi cabang pada Google Maps.
                </p>
              </div>
            </div>

            <label className="block text-sm text-[#C8CDCF]">
              URL Google Maps
              <input
                className={inputClass}
                type="url"
                value={form.googleMapsUrl}
                onChange={(e) =>
                  handleChange("googleMapsUrl", e.target.value)
                }
                placeholder="https://maps.google.com/..."
              />
            </label>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#191B1C] p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Clock3 className="h-5 w-5 text-[#D5DADD]" />
              </div>
              <div>
                <h2 className="font-semibold">Jam Operasional</h2>
                <p className="mt-1 text-xs text-[#92999D]">
                  Atur informasi jam buka cabang.
                </p>
              </div>
            </div>

            <label className="block text-sm text-[#C8CDCF]">
              Jam Operasional
              <input
                className={inputClass}
                value={form.openingHours}
                onChange={(e) =>
                  handleChange("openingHours", e.target.value)
                }
                placeholder="Contoh: Setiap hari, 08.00–22.00 WIB"
                maxLength={200}
              />
            </label>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#92999D]">
              Perubahan akan diterapkan setelah fitur penyimpanan dihubungkan.
            </p>

            <button
              type="submit"
              disabled={saving || !onSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#D9DEE1] px-5 py-3 text-sm font-semibold text-[#17191A] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>

          {message && (
            <p role="status" className="text-sm text-[#C8CDCF]">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
