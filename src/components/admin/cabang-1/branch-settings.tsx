"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Building2,
  MapPin,
  Phone,
  Clock3,
  Save,
  Settings2,
  Plus,
  Trash2,
  Handshake,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export type BranchPartnership = {
  name: string;
  url: string;
};

export type BranchSettingsResult = {
  success: boolean;
  message: string;
};

export type DailyOpeningHours = {
  isOpen: boolean;
  open: string;
  close: string;
};

export type WeeklyOpeningHours = {
  monday: DailyOpeningHours;
  tuesday: DailyOpeningHours;
  wednesday: DailyOpeningHours;
  thursday: DailyOpeningHours;
  friday: DailyOpeningHours;
  saturday: DailyOpeningHours;
  sunday: DailyOpeningHours;
};

export type BranchSettingsValues = {
  name: string;
  address: string;
  phone: string;
  googleMapsUrl: string;
  weeklyOpeningHours: WeeklyOpeningHours;
  partnerships: BranchPartnership[];
};

type BranchSettingsInitialData = {
  name: string;
  address: string;
  phone: string;
  googleMapsUrl: string;
  weeklyOpeningHours?: WeeklyOpeningHours;
  openingTime?: string | null;
  closingTime?: string | null;
  partnerships: BranchPartnership[];
};

type BranchSettingsProps = {
  initialData: BranchSettingsInitialData;
  onSave?: (
    values: BranchSettingsValues,
  ) => Promise<{ success: boolean; message: string }>;
  onToggleMobileNav?: () => void;
  mobileNavOpen?: boolean;
};

type Notice = {
  type: "success" | "error";
  message: string;
};

const DAYS: {
  key: keyof WeeklyOpeningHours;
  label: string;
}[] = [
  { key: "monday", label: "Senin" },
  { key: "tuesday", label: "Selasa" },
  { key: "wednesday", label: "Rabu" },
  { key: "thursday", label: "Kamis" },
  { key: "friday", label: "Jumat" },
  { key: "saturday", label: "Sabtu" },
  { key: "sunday", label: "Minggu" },
];

const createDefaultDay = (
  open = "08:00",
  close = "22:00",
): DailyOpeningHours => ({
  isOpen: true,
  open,
  close,
});

function createInitialSchedule(
  initialData: BranchSettingsInitialData,
): WeeklyOpeningHours {
  if (initialData.weeklyOpeningHours) {
    return initialData.weeklyOpeningHours;
  }

  const legacyDay = createDefaultDay(
    initialData.openingTime || "08:00",
    initialData.closingTime || "22:00",
  );

  return {
    monday: { ...legacyDay },
    tuesday: { ...legacyDay },
    wednesday: { ...legacyDay },
    thursday: { ...legacyDay },
    friday: { ...legacyDay },
    saturday: { ...legacyDay },
    sunday: { ...legacyDay },
  };
}

export function BranchSettings({
  initialData,
  onSave,
}: BranchSettingsProps) {
  const [form, setForm] = useState<BranchSettingsValues>(() => ({
    name: initialData.name,
    address: initialData.address,
    phone: initialData.phone || "",
    googleMapsUrl: initialData.googleMapsUrl || "",
    weeklyOpeningHours: createInitialSchedule(initialData),
    partnerships: initialData.partnerships || [],
  }));

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Notifikasi hilang otomatis setelah 4 detik
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleChange = (
    field: "phone" | "googleMapsUrl",
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleScheduleChange = (
    day: keyof WeeklyOpeningHours,
    field: keyof DailyOpeningHours,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      weeklyOpeningHours: {
        ...current.weeklyOpeningHours,
        [day]: {
          ...current.weeklyOpeningHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handlePartnershipChange = (
    index: number,
    field: keyof BranchPartnership,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      partnerships: current.partnerships.map((partner, i) =>
        i === index ? { ...partner, [field]: value } : partner,
      ),
    }));
  };

  const addPartnership = () => {
    setForm((current) => ({
      ...current,
      partnerships: [
        ...current.partnerships,
        { name: "", url: "" },
      ],
    }));
  };

  const removePartnership = (index: number) => {
    setForm((current) => ({
      ...current,
      partnerships: current.partnerships.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!onSave) {
      setNotice({
        type: "error",
        message: "Fitur penyimpanan belum dihubungkan.",
      });
      return;
    }

    setSaving(true);
    setNotice(null);

    // [DEBUG] data yang dikirim form ke onSave (muncul di Console browser)
    console.log(
      "[FORM] weeklyOpeningHours yang dikirim:",
      JSON.stringify(form.weeklyOpeningHours),
    );

    try {
      const result = await onSave(form);
      console.log("[FORM] hasil onSave:", result);
      setNotice({
        type: result.success ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("[FORM] onSave error:", error);
      setNotice({
        type: "error",
        message: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#101112] px-4 py-3 text-sm text-[#E7E9EA] outline-none transition placeholder:text-[#697176] focus:border-white/30";

  const readOnlyClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#92999D] outline-none cursor-not-allowed";

  return (
    <main className="min-h-screen bg-[#101112] px-4 py-7 text-[#E7E9EA] sm:px-6 lg:px-8">
      {/* NOTIFIKASI */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            notice.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-100"
              : "border-red-500/40 bg-red-950/90 text-red-100"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{notice.message}</span>
        </div>
      )}

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
          {/* INFORMASI CABANG */}
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
                  className={readOnlyClass}
                  value={form.name}
                  readOnly
                />
                <span className="mt-1 block text-xs text-[#697176]">
                  Nama cabang tidak dapat diubah melalui halaman ini.
                </span>
              </label>

              <label className="block text-sm text-[#C8CDCF]">
                Alamat Cabang
                <textarea
                  className={readOnlyClass}
                  value={form.address}
                  readOnly
                  rows={3}
                />
                <span className="mt-1 block text-xs text-[#697176]">
                  Alamat cabang tidak dapat diubah melalui halaman ini.
                </span>
              </label>

              <label className="block text-sm text-[#C8CDCF]">
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Nomor Telepon
                </span>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  placeholder="Contoh: 081234567890"
                  maxLength={30}
                />
              </label>
            </div>
          </section>

          {/* LOKASI CABANG */}
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

          {/* JAM OPERASIONAL */}
          <section className="rounded-2xl border border-white/10 bg-[#191B1C] p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Clock3 className="h-5 w-5 text-[#D5DADD]" />
              </div>
              <div>
                <h2 className="font-semibold">Jam Operasional</h2>
                <p className="mt-1 text-xs text-[#92999D]">
                  Atur jadwal buka dan tutup untuk setiap hari.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {DAYS.map((day) => {
                const schedule = form.weeklyOpeningHours[day.key];

                return (
                  <div
                    key={day.key}
                    className="rounded-xl border border-white/10 bg-[#101112] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-medium text-[#E7E9EA]">
                        {day.label}
                      </span>

                      <label className="flex cursor-pointer items-center gap-2 text-sm text-[#C8CDCF]">
                        <input
                          type="checkbox"
                          checked={schedule.isOpen}
                          onChange={(e) =>
                            handleScheduleChange(
                              day.key,
                              "isOpen",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 accent-white"
                        />
                        Buka
                      </label>
                    </div>

                    {schedule.isOpen ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <label className="block text-xs text-[#92999D]">
                          Jam Buka
                          <input
                            className={inputClass}
                            type="time"
                            value={schedule.open}
                            required
                            onChange={(e) =>
                              handleScheduleChange(
                                day.key,
                                "open",
                                e.target.value,
                              )
                            }
                          />
                        </label>

                        <label className="block text-xs text-[#92999D]">
                          Jam Tutup
                          <input
                            className={inputClass}
                            type="time"
                            value={schedule.close}
                            required
                            onChange={(e) =>
                              handleScheduleChange(
                                day.key,
                                "close",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[#92999D]">
                        Tutup sepanjang hari
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs leading-5 text-[#697176]">
              Jadwal ini akan digunakan untuk menentukan status buka atau
              tutup cabang berdasarkan hari dan waktu saat ini.
            </p>
          </section>

          {/* MEDIA KERJA SAMA */}
          <section className="rounded-2xl border border-white/10 bg-[#191B1C] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Handshake className="h-5 w-5 text-[#D5DADD]" />
                </div>
                <div>
                  <h2 className="font-semibold">Media Kerja Sama</h2>
                  <p className="mt-1 text-xs text-[#92999D]">
                    Kelola platform partner seperti Gojek dan Grab.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addPartnership}
                disabled={form.partnerships.length >= 10}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-[#E7E9EA] transition hover:bg-white/10 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Tambah
              </button>
            </div>

            <div className="space-y-4">
              {form.partnerships.length === 0 && (
                <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-[#697176]">
                  Belum ada media kerja sama. Klik Tambah untuk menambahkan
                  partner.
                </p>
              )}

              {form.partnerships.map((partner, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-[#101112] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#C8CDCF]">
                      Partner {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => removePartnership(index)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400 transition hover:bg-red-400/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>

                  <label className="block text-sm text-[#C8CDCF]">
                    Nama Media
                    <input
                      className={inputClass}
                      value={partner.name}
                      onChange={(e) =>
                        handlePartnershipChange(
                          index,
                          "name",
                          e.target.value,
                        )
                      }
                      placeholder="Contoh: Gojek"
                      maxLength={60}
                      required
                    />
                  </label>

                  <label className="mt-4 block text-sm text-[#C8CDCF]">
                    URL Media
                    <input
                      className={inputClass}
                      type="url"
                      value={partner.url}
                      onChange={(e) =>
                        handlePartnershipChange(
                          index,
                          "url",
                          e.target.value,
                        )
                      }
                      placeholder="https://..."
                      maxLength={500}
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* TOMBOL SIMPAN */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#92999D]">
              Perubahan akan disimpan setelah tombol diklik.
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
        </form>
      </div>
    </main>
  );
}