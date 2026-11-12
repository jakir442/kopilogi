
"use client";

import { Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deleteMenu } from "../../actions/menu.actions";

type MenuData = {
  _id: string;
  name: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: MenuData | null;
  branchId?: string;
  onSuccess: () => void;
};

export function MenuDeleteDialog({
  open,
  onOpenChange,
  menu,
  branchId,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open || !menu) return null;

  async function handleDelete() {
    if (!menu) {
      toast.error("Menu tidak ditemukan.");
      return;
    }

    setLoading(true);

    try {
      const result = await deleteMenu({
        id: menu._id,
        ...(branchId ? { branchId } : {}),
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Gagal menghapus menu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup dialog"
        onClick={() => !loading && onOpenChange(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border bg-background p-6 shadow-xl">
        <button
          type="button"
          disabled={loading}
          aria-label="Tutup dialog"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <X className="size-4" />
        </button>

        <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Trash2 className="size-5" />
        </div>

        <h2 className="text-lg font-semibold">Hapus Menu?</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Apakah kamu yakin ingin menghapus menu{" "}
          <span className="font-medium text-foreground">{menu.name}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Hapus Menu
          </button>
        </div>
      </div>
    </div>
  );
}
