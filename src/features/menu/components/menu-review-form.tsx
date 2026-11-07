"use client";

import { createMenuReviewAction } from "@/features/customers/actions/menu-review.actions";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type MenuReviewFormProps = {
  menuId: string;
  branchId: string;
  branchSlug: string;
  menuSlug: string;
};

export function MenuReviewForm({ menuId, branchId, branchSlug, menuSlug }: MenuReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeRating = hoverRating || rating;

  async function handleSubmit() {
    if (!rating) {
      toast.error("Pilih rating terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createMenuReviewAction({
        menuId,
        branchId,
        branchSlug,
        menuSlug,
        rating,
        comment: comment.trim(),
      });

      if (!result.success) {
        toast.error("Ulasan gagal dikirim.", {
          description: result.message,
        });
        return;
      }

      toast.success("Ulasan berhasil dikirim.", {
        description: result.message,
      });

      setRating(0);
      setHoverRating(0);
      setComment("");
    } catch (error) {
      console.error("[MenuReviewForm]", error);

      toast.error("Ulasan gagal dikirim.", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--detail-border)] p-5 sm:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--detail-accent)]">
          Bagikan pengalamanmu
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Beri rating untuk menu ini
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--detail-muted)]">
          Pilih jumlah bintang dan ceritakan pengalamanmu menikmati menu ini.
        </p>
      </div>

      <div className="mt-6">
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverRating(0)}
          role="radiogroup"
          aria-label="Rating menu"
        >
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const isActive = value <= activeRating;

            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-label={`${value} dari 5 bintang`}
                aria-checked={rating === value}
                onMouseEnter={() => setHoverRating(value)}
                onFocus={() => setHoverRating(value)}
                onBlur={() => setHoverRating(0)}
                onClick={() => setRating(value)}
                disabled={isSubmitting}
                className="rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--detail-accent)] disabled:cursor-not-allowed"
              >
                <Star
                  className={`size-9 transition-colors ${
                    isActive
                      ? "fill-[var(--detail-accent)] text-[var(--detail-accent)]"
                      : "text-[var(--detail-muted)]/40"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-sm font-medium text-[var(--detail-muted)]">
          {rating > 0 ? `${rating} dari 5 bintang` : "Pilih rating"}
        </p>
      </div>

      <div className="mt-6">
        <label htmlFor="menu-review-comment" className="text-sm font-medium">
          Komentar
        </label>

        <textarea
          id="menu-review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={500}
          rows={4}
          disabled={isSubmitting}
          placeholder="Ceritakan pengalamanmu dengan menu ini..."
          className="mt-2 w-full resize-none rounded-2xl border border-[var(--detail-border)] bg-transparent px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[var(--detail-muted)]/70 focus:border-[var(--detail-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="mt-1 flex justify-end">
          <span className="text-xs text-[var(--detail-muted)]">{comment.length}/500</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!rating || isSubmitting}
        onClick={handleSubmit}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--detail-accent)] px-6 py-3 text-sm font-semibold text-[var(--detail-bg)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? "Mengirim..." : "Kirim ulasan"}
      </button>
    </div>
  );
}
