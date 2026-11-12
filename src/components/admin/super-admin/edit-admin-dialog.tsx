"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { updateAdmin } from "@/features/users/actions/admin.actions";
import { BranchActivationDialog } from "./branch-activation-dialog";

type BranchOption = {
  id: string;
  name: string;
  slug: string;
  concept: "modern-futuristic" | "traditional-heritage" | "contemporary-cozy";
  isActive: boolean;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  branch: {
    id: string;
    name: string;
  } | null;
};

type EditAdminDialogProps = {
  admin: AdminUser;
  branches: BranchOption[];
};

export function EditAdminDialog({ admin, branches }: EditAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branchId, setBranchId] = useState("");
  const [activationDialogOpen, setActivationDialogOpen] = useState(false);

  function handleOpen() {
    setName(admin.name);
    setEmail(admin.email);
    setBranchId(admin.branch?.id ?? "");
    setOpen(true);
  }

  function handleClose() {
    if (pending) return;

    setOpen(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedBranchData = branches.find((branch) => branch.id === branchId);

    if (!selectedBranchData) {
      toast.error("Silakan pilih cabang yang valid.");
      return;
    }

    if (!selectedBranchData.isActive) {
      setActivationDialogOpen(true);
      return;
    }

    startTransition(async () => {
      const result = await updateAdmin({
        id: admin.id,
        name,
        email,
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
        aria-label={`Edit ${admin.name}`}
        title='Edit administrator'
        className='inline-flex size-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900'
      >
        <Pencil className='size-4' />
      </button>

      {open && (
        <div
          className='fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby={`edit-admin-title-${admin.id}`}
            className='w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl'
          >
            {/* Header */}
            <div className='flex items-start justify-between border-b border-neutral-200 px-6 py-5'>
              <div>
                <h2
                  id={`edit-admin-title-${admin.id}`}
                  className='text-lg font-semibold tracking-tight text-neutral-950'
                >
                  Edit Administrator
                </h2>

                <p className='mt-1 text-sm leading-5 text-neutral-500'>
                  Perbarui identitas dan akses cabang administrator.
                </p>
              </div>

              <button
                type='button'
                onClick={handleClose}
                disabled={pending}
                aria-label='Tutup dialog'
                className='flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <X className='size-4' />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className='space-y-5 px-6 py-6'>
                {/* Name */}
                <div className='space-y-2'>
                  <label
                    htmlFor={`edit-name-${admin.id}`}
                    className='text-sm font-medium text-neutral-900'
                  >
                    Nama
                  </label>

                  <input
                    id={`edit-name-${admin.id}`}
                    type='text'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    maxLength={100}
                    required
                    disabled={pending}
                    className='h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50'
                  />
                </div>

                {/* Email */}
                <div className='space-y-2'>
                  <label
                    htmlFor={`edit-email-${admin.id}`}
                    className='text-sm font-medium text-neutral-900'
                  >
                    Email
                  </label>

                  <input
                    id={`edit-email-${admin.id}`}
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={pending}
                    className='h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50'
                  />
                </div>

                {/* Branch */}
                <div className='space-y-2'>
                  <label
                    htmlFor={`edit-branch-${admin.id}`}
                    className='text-sm font-medium text-neutral-900'
                  >
                    Cabang
                  </label>

                  <select
                    id={`edit-branch-${admin.id}`}
                    value={branchId}
                    onChange={(event) => setBranchId(event.target.value)}
                    required
                    disabled={pending}
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

                  <p className='text-xs leading-5 text-neutral-400'>
                    Mengubah cabang akan mengubah cakupan akses administrator.
                  </p>
                </div>

                {/* Password info */}
                <div className='rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3'>
                  <p className='text-xs leading-5 text-neutral-500'>
                    Password tidak diubah dari menu edit. Gunakan fitur reset password jika
                    administrator membutuhkan password baru.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className='flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4'>
                <button
                  type='button'
                  onClick={handleClose}
                  disabled={pending}
                  className='h-10 rounded-xl px-4 text-sm font-medium text-neutral-600 transition hover:bg-neutral-200/70 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Batal
                </button>

                <button
                  type='submit'
                  disabled={pending}
                  className='inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-xl bg-[#171715] px-4 text-sm font-medium text-white transition hover:bg-[#2a2a27] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {pending ? (
                    <>
                      <Loader2 className='size-4 animate-spin' />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Pencil className='size-4' />
                      Simpan
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
