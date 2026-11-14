"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRef } from "react";

type MenuReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  adminReply?: {
    message: string;
    repliedByName?: string | null;
    repliedByRole?: "admin" | "super_admin" | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

type MenuReviewListProps = {
  reviews?: MenuReview[];
};

export function MenuReviewList({ reviews = [] }: MenuReviewListProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const totalReviews = reviews.length;

  const totalRating = reviews.reduce((total, review) => total + review.rating, 0);

  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  const roundedAverageRating = Math.round(averageRating);

  const ratingCounts = {
    5: reviews.filter((review) => review.rating === 5).length,
    4: reviews.filter((review) => review.rating === 4).length,
    3: reviews.filter((review) => review.rating === 3).length,
    2: reviews.filter((review) => review.rating === 2).length,
    1: reviews.filter((review) => review.rating === 1).length,
  };

  const ratingPercentage = (rating: number) => {
    if (totalReviews === 0) {
      return 0;
    }

    return (ratingCounts[rating as keyof typeof ratingCounts] / totalReviews) * 100;
  };

  function scroll(direction: "left" | "right") {
    if (!sliderRef.current) {
      return;
    }

    sliderRef.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  }

  if (!reviews.length) {
    return (
      <section className="rounded-3xl border border-[var(--detail-border)] p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--detail-accent)]">
          Ulasan pelanggan
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Belum ada ulasan</h2>

        <p className="mt-2 text-sm leading-6 text-[var(--detail-muted)]">
          Jadilah yang pertama membagikan pengalamanmu menikmati menu ini.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--detail-accent)]">
            Ulasan pelanggan
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Apa kata pelanggan?
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--detail-muted)]">
            Penilaian berdasarkan pengalaman pelanggan yang telah menikmati menu ini.
          </p>
        </div>

        {reviews.length > 1 && (
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Ulasan sebelumnya"
              className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--detail-border)] transition hover:border-[var(--detail-accent)] hover:text-[var(--detail-accent)]"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Ulasan berikutnya"
              className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--detail-border)] transition hover:border-[var(--detail-accent)] hover:text-[var(--detail-accent)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Rating Summary */}
      <div className="mt-6 grid gap-6 rounded-3xl border border-[var(--detail-border)] p-5 sm:p-7 lg:grid-cols-[220px_1fr] lg:items-center">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center text-center lg:border-r lg:border-[var(--detail-border)] lg:pr-7">
          <p className="text-5xl font-semibold tracking-tight">
            {averageRating.toLocaleString("id-ID", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </p>

          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;

              return (
                <Star
                  key={value}
                  className={`size-5 ${
                    value <= roundedAverageRating
                      ? "fill-[var(--detail-accent)] text-[var(--detail-accent)]"
                      : "text-[var(--detail-muted)]/30"
                  }`}
                />
              );
            })}
          </div>

          <p className="mt-2 text-sm text-[var(--detail-muted)]">
            Berdasarkan {totalReviews} {totalReviews === 1 ? "pelanggan" : "pelanggan"}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating as keyof typeof ratingCounts];

            const percentage = ratingPercentage(rating);

            return (
              <div key={rating} className="flex items-center gap-3 text-sm">
                <div className="flex w-10 shrink-0 items-center gap-1">
                  <span>{rating}</span>
                  <Star className="size-3.5 fill-current" />
                </div>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--detail-muted)]/15">
                  <div
                    className="h-full rounded-full bg-[var(--detail-accent)] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-8 shrink-0 text-right text-xs text-[var(--detail-muted)]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Slider */}
      <div
        ref={sliderRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review) => (
          <article
            key={review.id}
            className="min-w-[85%] snap-start rounded-3xl border border-[var(--detail-border)] p-5 sm:min-w-[360px] sm:p-6 lg:min-w-[420px]"
          >
            {/* Rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;

                return (
                  <Star
                    key={value}
                    className={`size-4 ${
                      value <= review.rating
                        ? "fill-[var(--detail-accent)] text-[var(--detail-accent)]"
                        : "text-[var(--detail-muted)]/30"
                    }`}
                  />
                );
              })}
            </div>

            {/* Comment */}
            <p className="mt-5 text-base leading-7">
              {review.comment || "Pelanggan tidak menambahkan komentar."}
            </p>

            {/* Admin Reply */}
            {review.adminReply?.message?.trim() && (
              <div className="mt-5 rounded-2xl border border-[var(--detail-border)] bg-[var(--detail-muted)]/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--detail-accent)]/10 text-[var(--detail-accent)]">
                    <span className="text-sm font-bold">K</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold">Balasan dari Kopilogi</p>

                      <span className="text-[var(--detail-muted)]">·</span>

                      <p className="text-xs text-[var(--detail-muted)]">
                        {review.adminReply.repliedByRole === "super_admin"
                          ? "Super Admin · Owner"
                          : review.adminReply.repliedByRole === "admin"
                            ? "Admin · Karyawan"
                            : review.adminReply.repliedByName || "Admin Kopilogi"}
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[var(--detail-muted)]">
                      {review.adminReply.message}
                    </p>

                    <p className="mt-2 text-[11px] text-[var(--detail-muted)]">
                      Dibalas{" "}
                      {new Date(review.adminReply.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {review.adminReply.updatedAt !== review.adminReply.createdAt && (
                        <span> · Diperbarui</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer */}
            <div className="mt-6 border-t border-[var(--detail-border)] pt-4">
              <p className="text-sm font-semibold">{review.customerName}</p>

              <p className="mt-1 text-xs text-[var(--detail-muted)]">Pelanggan</p>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile Navigation */}
      {reviews.length > 1 && (
        <div className="mt-2 flex justify-end gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Ulasan sebelumnya"
            className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--detail-border)] transition hover:border-[var(--detail-accent)]"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Ulasan berikutnya"
            className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--detail-border)] transition hover:border-[var(--detail-accent)]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
