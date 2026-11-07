"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function MenuReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const displayedRating = hoverRating || rating;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">
          Bagaimana menurutmu?
        </h3>

        <p className="mt-1 text-sm leading-6 text-neutral-500">
          Berikan penilaian untuk menu ini.
        </p>
      </div>

      <div className="mt-5">
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverRating(0)}
          role="radiogroup"
          aria-label="Rating menu"
        >
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const active = value <= displayedRating;

            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} dari 5 bintang`}
                onMouseEnter={() => setHoverRating(value)}
                onClick={() => setRating(value)}
                className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Star
                  className={`size-8 transition-colors ${
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-sm font-medium text-neutral-600">
          {rating > 0 ? `${rating} dari 5` : "Pilih rating"}
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="menu-review-comment"
          className="text-sm font-medium text-neutral-800"
        >
          Komentar
        </label>

        <textarea
          id="menu-review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Ceritakan pengalamanmu dengan menu ini..."
          rows={4}
          maxLength={500}
          className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
        />

        <div className="mt-1 flex justify-end">
          <span className="text-xs text-neutral-400">
            {comment.length}/500
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={rating === 0}
        className="mt-5 w-full rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Kirim ulasan
      </button>
    </div>
  );
}