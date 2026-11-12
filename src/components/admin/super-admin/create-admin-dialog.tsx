"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { createAdmin } from "@/features/users/actions/admin.actions";
import { BranchActivationDialog } from "./branch-activation-dialog";

type BranchOption = {
  id: string;
  name: string;
  slug: string;
  concept: "modern-futuristic" | "traditional-heritage" | "contemporary-cozy";
  isActive: boolean;
};

type CreateAdminDialogProps = {
  branches: BranchOption[];
  onSuccess?: () => void;
};

function formatConcept(concept: BranchOption["concept"]) {
  switch (concept) {
    case "modern-futuristic":
      return "Modern Futuristic";
    case "traditional-heritage":
      return "Traditional Heritage";
    case "contemporary-cozy":
      return "Contemporary Cozy";
    default:
      return concept;
  }
}

export function CreateAdminDialog({ branches, onSuccess }: CreateAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branchId, setBranchId] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [activationDialogOpen, setActivationDialogOpen] = useState(false);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setBranchId("");
    setShowPassword(false);
  }

  function handleOpen() {
    resetForm();
    setOpen(true);
  }

  function handleClose() {
    if (isPending) return;

    setOpen(false);
    resetForm();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedBranchData = branches.find((branch) => branch.id === branchId);

    if (!selectedBranchData) {
      toast.error("Cabang belum dipilih.");
      return;
    }

    if (!selectedBranchData.isActive) {
      setActivationDialogOpen(true);
      return;
    }

    startTransition(async () => {
      const result = await createAdmin({
        name,
        email,
        password,
        branchId,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type='button'
        onClick={handleOpen}
        className='inline-flex h-10 items-center gap-2 rounded-xl bg-[#171715] px-4 text-sm font-medium text-white transition hover:bg-[#2a2a27] active:scale-[0.98]'
      >
        <Plus className='size-4' />
        Tambah Admin
      </button>

      {open && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className='w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl'>
            {/* Header */}
            <div className='border-b border-neutral-200 px-6 py-5'>
              <div className='flex items-start gap-3'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100'>
                  <ShieldCheck className='size-5 text-neutral-800' />
                </div>

                <div className='min-w-0'>
                  <h2 className='text-lg font-semibold tracking-tight text-neutral-950'>
                    Tambah Administrator
                  </h2>

                  <p className='mt-1 text-sm leading-5 text-neutral-500'>
                    Buat akun administrator baru dan tentukan cabang yang dapat dikelola.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className='space-y-5 px-6 py-6'>
                {/* Name */}
                <div className='space-y-2'>
                  <label htmlFor='admin-name' className='text-sm font-medium text-neutral-900'>
                    Nama
                  </label>

                  <input
                    id='admin-name'
                    type='text'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Contoh: Andi Saputra'
                    autoComplete='name'
                    disabled={isPending}
                    required
                    className='h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50'
                  />
                </div>

                {/* Email */}
                <div className='space-y-2'>
                  <label htmlFor='admin-email' className='text-sm font-medium text-neutral-900'>
                    Email
                  </label>

                  <input
                    id='admin-email'
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='admin@kopilogi.com'
                    autoComplete='email'
                    disabled={isPending}
                    required
                    className='h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50'
                  />
                </div>

                {/* Password */}
                <div className='space-y-2'>
                  <label htmlFor='admin-password' className='text-sm font-medium text-neutral-900'>
                    Password
                  </label>

                  <div className='relative'>
                    <input
                      id='admin-password'
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder='Minimal 8 karakter'
                      autoComplete='new-password'
                      disabled={isPending}
                      required
                      minLength={8}
                      className='h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 pr-11 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50'
                    />

                    <button
                      type='button'
                      onClick={() => setShowPassword((value) => !value)}
                      disabled={isPending}
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      className='absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-neutral-400 transition hover:text-neutral-700 disabled:cursor-not-allowed'
                    >
                      {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                    </button>
                  </div>

                  <p className='text-xs text-neutral-400'>Password minimal 8 karakter.</p>
                </div>

                {/* Branch */}
                <div className='space-y-2'>
                  <label htmlFor='admin-branch' className='text-sm font-medium text-neutral-900'>
                    Cabang
                  </label>

                  <select
                    id='admin-branch'
                    value={branchId}
                    onChange={(event) => setBranchId(event.target.value)}
                    disabled={isPending}
                    required
                    className='h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50'
                  >
                    <option value=''>Pilih cabang</option>

                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                        {!branch.isActive ? " — Tidak aktif" : ""}
                      </option>
                    ))}
                  </select>

                  <p className='text-xs text-neutral-400'>
                    Administrator hanya dapat mengelola cabang yang dipilih.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className='flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4'>
                <button
                  type='button'
                  onClick={handleClose}
                  disabled={isPending}
                  className='h-10 rounded-xl px-4 text-sm font-medium text-neutral-600 transition hover:bg-neutral-200/70 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Batal
                </button>

                <button
                  type='submit'
                  disabled={isPending}
                  className='inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-xl bg-[#171715] px-4 text-sm font-medium text-white transition hover:bg-[#2a2a27] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {isPending ? (
                    <>
                      <Loader2 className='size-4 animate-spin' />
                      Membuat...
                    </>
                  ) : (
                    <>
                      <Plus className='size-4' />
                      Buat Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BranchActivationDialog
        open={activationDialogOpen}
        branchName={branches.find((branch) => branch.id === branchId)?.name ?? "Kopilogi Hallway"}
        onClose={() => setActivationDialogOpen(false)}
      />
    </>
  );
}
