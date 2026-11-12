"use client";

import { AlertTriangle, X } from "lucide-react";

type BranchActivationDialogProps = {
  open: boolean;
  branchName: string;
  onClose: () => void;
};

export function BranchActivationDialog({ open, branchName, onClose }: BranchActivationDialogProps) {
  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='branch-activation-title'
        className='w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl'
      >
        <div className='flex items-start justify-between px-6 pt-6'>
          <div className='flex size-12 items-center justify-center rounded-xl bg-amber-50'>
            <AlertTriangle className='size-6 text-amber-600' />
          </div>

          <button
            type='button'
            onClick={onClose}
            aria-label='Tutup dialog'
            className='flex size-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700'
          >
            <X className='size-5' />
          </button>
        </div>

        <div className='px-6 py-6'>
          <h2
            id='branch-activation-title'
            className='text-xl font-semibold tracking-tight text-neutral-950'
          >
            Aktivasi Cabang Diperlukan
          </h2>

          <p className='mt-3 text-[15px] leading-7 text-neutral-600'>
            Cabang <span className='font-semibold text-neutral-900'>{branchName}</span> saat ini
            belum aktif.
          </p>

          <div className='mt-5 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-4'>
            <p className='text-sm leading-6 text-amber-800'>
              Cabang ini harus diaktivasi terlebih dahulu oleh developer yang berwenang sebelum
              dapat digunakan untuk administrator.
            </p>
          </div>

          <div className='mt-5 flex items-center gap-2.5 text-sm text-neutral-500'>
            <span className='size-2 rounded-full bg-amber-500' />
            <span>
              Status cabang: <span className='font-medium text-amber-700'>Belum aktif</span>
            </span>
          </div>
        </div>

        <div className='flex items-center justify-end border-t border-neutral-200 bg-neutral-50 px-6 py-4'>
          <button
            type='button'
            onClick={onClose}
            className='h-10 rounded-xl bg-[#171715] px-5 text-sm font-medium text-white transition hover:bg-[#2a2a27] active:scale-[0.98]'
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
