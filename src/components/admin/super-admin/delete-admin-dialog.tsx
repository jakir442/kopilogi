"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { deleteAdmin } from "@/features/users/actions/admin.actions";

type DeleteAdminDialogProps = {
  adminId: string;
  adminName: string;
};

export function DeleteAdminDialog({ adminId, adminName }: DeleteAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleClose() {
    if (pending) return;

    setOpen(false);
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAdmin({
        id: adminId,
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
        onClick={() => setOpen(true)}
        disabled={pending}
        aria-label={`Hapus ${adminName}`}
        title='Hapus administrator'
        className='inline-flex size-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <Trash2 className='size-4' />
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
            aria-labelledby={`delete-admin-title-${adminId}`}
            className='w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl'
          >
            {/* Header */}
            <div className='flex items-start justify-between px-6 pt-6'>
              <div className='flex size-11 items-center justify-center rounded-xl bg-red-50'>
                <AlertTriangle className='size-5 text-red-600' />
              </div>

              <button
                type='button'
                onClick={handleClose}
                disabled={pending}
                aria-label='Tutup dialog'
                className='flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50'
              >
                <X className='size-4' />
              </button>
            </div>

            {/* Content */}
            <div className='px-6 py-5'>
              <h2
                id={`delete-admin-title-${adminId}`}
                className='text-lg font-semibold tracking-tight text-neutral-950'
              >
                Hapus Administrator?
              </h2>

              <p className='mt-2 text-sm leading-6 text-neutral-500'>
                Anda akan menghapus akun administrator{" "}
                <span className='font-semibold text-neutral-800'>{adminName}</span>.
              </p>

              <div className='mt-4 rounded-xl border border-red-100 bg-red-50/70 px-4 py-3'>
                <p className='text-xs leading-5 text-red-700'>
                  Administrator yang dihapus tidak dapat login kembali ke sistem. Tindakan ini tidak
                  dapat dibatalkan.
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
                type='button'
                onClick={handleDelete}
                disabled={pending}
                className='inline-flex h-10 min-w-24 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {pending ? (
                  <>
                    <Loader2 className='size-4 animate-spin' />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className='size-4' />
                    Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
