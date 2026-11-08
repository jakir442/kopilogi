"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  Check,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

import {
  deleteMenuReviewReplyAction,
  getCustomerReviewsAction,
  removeMenuReviewAction,
  saveMenuReviewReplyAction,
  updateMenuReviewStatusAction,
} from "@/features/customers/actions/menu-review.actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ReviewStatus = "pending" | "approved" | "rejected";
type ReviewReplyRole = "admin" | "super_admin";
type FilterOption = "all" | ReviewStatus;
type BranchTheme = "modern" | "heritage" | "classic" | "cozy";

type CustomerManagementProps = {
  branchId?: string;
  branchSlug: string;
  branchName?: string;
};

type CustomerReview = {
  _id?: string;
  id?: string;
  customerName?: string;
  name?: string;
  menuName?: string;
  menuSlug?: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  createdAt?: string | Date;
  adminReply?: {
    message: string;
    repliedByName?: string;
    repliedByRole?: ReviewReplyRole;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  } | null;
};

type ReviewSummary = {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  averageRating: number;
};

type ThemeConfig = {
  page: string;
  text: string;
  heading: string;
  muted: string;
  soft: string;
  border: string;
  divider: string;
  panel: string;
  innerPanel: string;
  input: string;
  button: string;
  filterActive: string;
  filterInactive: string;
  filterCountActive: string;
  filterCountInactive: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  emptyIcon: string;
  dropdown: string;
  comment: string;
  avatar: string;
  menuBadge: string;
  eyebrow: string;
  skeleton: string;
  skeletonPanel: string;
  cardHover: string;
  starFilled: string;
  starEmpty: string;
  ratingText: string;
  status: Record<ReviewStatus, string>;
  action: string;
  dangerAction: string;
  approveButton: string;
  rejectButton: string;
  deleteButton: string;
  summary: {
    primary: { icon: string; glow: string };
    amber: { icon: string; glow: string };
    green: { icon: string; glow: string };
    red: { icon: string; glow: string };
  };
};

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "Semua ulasan" },
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

const EMPTY_SUMMARY: ReviewSummary = {
  totalReviews: 0,
  pendingReviews: 0,
  approvedReviews: 0,
  rejectedReviews: 0,
  averageRating: 0,
};

const THEMES: Record<BranchTheme, ThemeConfig> = {
  modern: {
    page: "bg-transparent",
    text: "text-white",
    heading: "text-white",
    muted: "text-white/55",
    soft: "text-white/40",
    border: "border-white/[0.08]",
    divider: "border-white/[0.07]",
    panel: "border-white/[0.08] bg-[#15191d]",
    innerPanel: "border-white/[0.06] bg-[#101316]",
    input:
      "border-white/10 bg-[#0e1114] text-white placeholder:text-white/30 focus-visible:border-cyan-400/40 focus-visible:ring-cyan-400/15",
    button: "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white",
    filterActive: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    filterInactive:
      "border-white/[0.08] bg-white/[0.02] text-white/55 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/85",
    filterCountActive: "bg-cyan-400/15 text-cyan-200",
    filterCountInactive: "bg-white/[0.06] text-white/45",
    accentBorder: "border-cyan-400/15",
    accentBg: "bg-cyan-400/[0.08]",
    accentText: "text-cyan-200",
    emptyIcon: "border-white/[0.08] bg-white/[0.03] text-white/35",
    dropdown: "border-white/10 bg-[#1a1f24] shadow-2xl",
    comment: "border-white/[0.06] bg-white/[0.02]",
    avatar: "border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-200",
    menuBadge: "border-white/[0.07] bg-white/[0.03] text-white/55",
    eyebrow: "border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300",
    skeleton: "bg-white/[0.07]",
    skeletonPanel: "border-white/[0.07] bg-[#14181c]",
    cardHover: "hover:border-white/[0.12]",
    starFilled: "fill-amber-400 text-amber-400",
    starEmpty: "fill-transparent text-white/15",
    ratingText: "text-white/85",
    status: {
      pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
      approved: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      rejected: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    },
    action: "text-white/75 hover:bg-white/[0.06] hover:text-white",
    dangerAction: "text-rose-300 hover:bg-rose-400/10",
    approveButton: "bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20",
    rejectButton:
      "border-amber-400/15 bg-amber-400/[0.04] text-amber-200 hover:bg-amber-400/10 hover:text-amber-100",
    deleteButton:
      "border-rose-400/15 bg-rose-400/[0.04] text-rose-300 hover:bg-rose-400/10 hover:text-rose-200",
    summary: {
      primary: {
        icon: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
        glow: "from-cyan-400/[0.09]",
      },
      amber: {
        icon: "border-amber-400/20 bg-amber-400/10 text-amber-300",
        glow: "from-amber-400/[0.08]",
      },
      green: {
        icon: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        glow: "from-emerald-400/[0.08]",
      },
      red: {
        icon: "border-rose-400/20 bg-rose-400/10 text-rose-300",
        glow: "from-rose-400/[0.08]",
      },
    },
  },

  heritage: {
    page: "bg-[#e9dfd1]",
    text: "text-[#49392c]",
    heading: "text-[#49392c]",
    muted: "text-[#786655]",
    soft: "text-[#887565]",
    border: "border-[#8c7762]/20",
    divider: "border-[#8c7762]/20",
    panel: "border-[#8c7762]/20 bg-[#f2e9dc]",
    innerPanel: "border-[#8c7762]/15 bg-[#ede2d4]",
    input:
      "border-[#8c7762]/20 bg-[#e7dacb] text-[#49392c] placeholder:text-[#887565] focus-visible:border-[#a9783f]/45 focus-visible:ring-[#a9783f]/15",
    button:
      "border-[#8c7762]/20 bg-[#eee3d5] text-[#5d4a39] hover:bg-[#e5d8c9] hover:text-[#49392c]",
    filterActive: "border-[#a9783f]/35 bg-[#a9783f]/10 text-[#80582e]",
    filterInactive:
      "border-[#8c7762]/20 bg-[#f0e6d9] text-[#786655] hover:border-[#8c7762]/35 hover:bg-[#e8dccf] hover:text-[#49392c]",
    filterCountActive: "bg-[#a9783f]/15 text-[#80582e]",
    filterCountInactive: "bg-[#8c7762]/10 text-[#887565]",
    accentBorder: "border-[#a9783f]/25",
    accentBg: "bg-[#a9783f]/10",
    accentText: "text-[#80582e]",
    emptyIcon: "border-[#8c7762]/20 bg-[#f0e5d8] text-[#887565]",
    dropdown: "border-[#8c7762]/20 bg-[#f2e8dc] shadow-[0_18px_40px_rgba(76,55,37,0.16)]",
    comment: "border-[#8c7762]/15 bg-[#e9ded0]",
    avatar: "border-[#a9783f]/25 bg-[#a9783f]/10 text-[#80582e]",
    menuBadge: "border-[#8c7762]/18 bg-[#e7dbcc] text-[#786655]",
    eyebrow: "border-[#a9783f]/25 bg-[#a9783f]/10 text-[#80582e]",
    skeleton: "bg-[#8c7762]/10",
    skeletonPanel: "border-[#8c7762]/15 bg-[#f2e9dc]",
    cardHover: "hover:border-[#8c7762]/30",
    starFilled: "fill-[#a9783f] text-[#a9783f]",
    starEmpty: "fill-transparent text-[#7d6c5b]/25",
    ratingText: "text-[#5d4a39]",
    status: {
      pending: "border-[#b88945]/35 bg-[#b88945]/10 text-[#9a6b32]",
      approved: "border-[#6f8062]/35 bg-[#6f8062]/10 text-[#637657]",
      rejected: "border-[#9a5c4a]/30 bg-[#9a5c4a]/10 text-[#925441]",
    },
    action: "text-[#5f4d3d] hover:bg-[#8c7762]/10 hover:text-[#3f3024]",
    dangerAction: "text-[#925441] hover:bg-[#9a5c4a]/10",
    approveButton: "bg-[#6f8062]/10 text-[#617555] hover:bg-[#6f8062]/20",
    rejectButton:
      "border-[#b88945]/20 bg-[#b88945]/5 text-[#8b6234] hover:bg-[#b88945]/10 hover:text-[#80582e]",
    deleteButton:
      "border-[#9a5c4a]/20 bg-[#9a5c4a]/5 text-[#925441] hover:bg-[#9a5c4a]/10 hover:text-[#814a3a]",
    summary: {
      primary: {
        icon: "border-[#a9783f]/25 bg-[#a9783f]/10 text-[#8b6234]",
        glow: "from-[#a9783f]/[0.08]",
      },
      amber: {
        icon: "border-[#b88945]/25 bg-[#b88945]/10 text-[#966a35]",
        glow: "from-[#b88945]/[0.07]",
      },
      green: {
        icon: "border-[#6f8062]/25 bg-[#6f8062]/10 text-[#617555]",
        glow: "from-[#6f8062]/[0.07]",
      },
      red: {
        icon: "border-[#9a5c4a]/25 bg-[#9a5c4a]/10 text-[#8c5040]",
        glow: "from-[#9a5c4a]/[0.07]",
      },
    },
  },

  classic: {
    page: "bg-transparent",
    text: "text-[#f2eee8]",
    heading: "text-[#f2eee8]",
    muted: "text-[#b9b0a4]",
    soft: "text-[#938b81]",
    border: "border-[#c2a878]/20",
    divider: "border-[#c2a878]/15",
    panel: "border-[#c2a878]/20 bg-[#29251f]",
    innerPanel: "border-[#c2a878]/10 bg-[#211e19]",
    input:
      "border-[#c2a878]/20 bg-[#211e19] text-[#f2eee8] placeholder:text-[#938b81] focus-visible:border-[#c2a878]/45 focus-visible:ring-[#c2a878]/15",
    button: "border-[#c2a878]/20 bg-[#302b23] text-[#e5d8bf] hover:bg-[#3a3328] hover:text-white",
    filterActive: "border-[#c2a878]/35 bg-[#c2a878]/10 text-[#e5d8bf]",
    filterInactive:
      "border-[#c2a878]/15 bg-[#29251f] text-[#b9b0a4] hover:border-[#c2a878]/30 hover:bg-[#302b23] hover:text-white",
    filterCountActive: "bg-[#c2a878]/15 text-[#e5d8bf]",
    filterCountInactive: "bg-white/[0.05] text-[#938b81]",
    accentBorder: "border-[#c2a878]/20",
    accentBg: "bg-[#c2a878]/10",
    accentText: "text-[#e5d8bf]",
    emptyIcon: "border-[#c2a878]/20 bg-[#302b23] text-[#938b81]",
    dropdown: "border-[#c2a878]/20 bg-[#29251f] shadow-2xl",
    comment: "border-[#c2a878]/10 bg-[#211e19]",
    avatar: "border-[#c2a878]/25 bg-[#c2a878]/10 text-[#e5d8bf]",
    menuBadge: "border-[#c2a878]/15 bg-[#302b23] text-[#b9b0a4]",
    eyebrow: "border-[#c2a878]/25 bg-[#c2a878]/10 text-[#e5d8bf]",
    skeleton: "bg-white/[0.07]",
    skeletonPanel: "border-[#c2a878]/15 bg-[#29251f]",
    cardHover: "hover:border-[#c2a878]/30",
    starFilled: "fill-[#c2a878] text-[#c2a878]",
    starEmpty: "fill-transparent text-white/15",
    ratingText: "text-[#e5d8bf]",
    status: {
      pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
      approved: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      rejected: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    },
    action: "text-[#e5d8bf] hover:bg-[#c2a878]/10 hover:text-white",
    dangerAction: "text-rose-300 hover:bg-rose-400/10",
    approveButton: "bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20",
    rejectButton:
      "border-amber-400/15 bg-amber-400/[0.04] text-amber-200 hover:bg-amber-400/10 hover:text-amber-100",
    deleteButton:
      "border-rose-400/15 bg-rose-400/[0.04] text-rose-300 hover:bg-rose-400/10 hover:text-rose-200",
    summary: {
      primary: {
        icon: "border-[#c2a878]/25 bg-[#c2a878]/10 text-[#e5d8bf]",
        glow: "from-[#c2a878]/[0.08]",
      },
      amber: {
        icon: "border-amber-400/20 bg-amber-400/10 text-amber-300",
        glow: "from-amber-400/[0.07]",
      },
      green: {
        icon: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        glow: "from-emerald-400/[0.07]",
      },
      red: {
        icon: "border-rose-400/20 bg-rose-400/10 text-rose-300",
        glow: "from-rose-400/[0.07]",
      },
    },
  },

  cozy: {
    page: "bg-[#f3f0e8]",
    text: "text-[#34433b]",
    heading: "text-[#34433b]",
    muted: "text-[#69776d]",
    soft: "text-[#829087]",
    border: "border-[#879889]/25",
    divider: "border-[#879889]/25",
    panel: "border-[#d7dfd4] bg-[#faf9f4]",
    innerPanel: "border-[#dce3d8] bg-[#f0f2e9]",
    input:
      "border-[#cbd7ca] bg-[#f5f5ee] text-[#34433b] placeholder:text-[#94a095] focus-visible:border-[#8ca18b]/70 focus-visible:ring-[#8ca18b]/20",
    button: "border-[#cbd7ca] bg-[#f7f7f0] text-[#4b6051] hover:bg-[#e9eee5] hover:text-[#34433b]",
    filterActive: "border-[#819783]/45 bg-[#819783]/15 text-[#46614d]",
    filterInactive:
      "border-[#d7dfd4] bg-[#f7f7f1] text-[#748276] hover:border-[#a8b9a7] hover:bg-[#eef2e9] hover:text-[#34433b]",
    filterCountActive: "bg-[#819783]/20 text-[#46614d]",
    filterCountInactive: "bg-[#e6ebe2] text-[#849184]",
    accentBorder: "border-[#819783]/30",
    accentBg: "bg-[#819783]/10",
    accentText: "text-[#46614d]",
    emptyIcon: "border-[#d7dfd4] bg-[#edf0e7] text-[#829087]",
    dropdown: "border-[#d7dfd4] bg-[#faf9f4] shadow-[0_18px_40px_rgba(52,67,59,0.12)]",
    comment: "border-[#dce3d8] bg-[#f5f5ee]",
    avatar: "border-[#819783]/30 bg-[#819783]/15 text-[#46614d]",
    menuBadge: "border-[#d7dfd4] bg-[#edf0e7] text-[#657568]",
    eyebrow: "border-[#819783]/30 bg-[#819783]/10 text-[#46614d]",
    skeleton: "bg-[#dce3d8]",
    skeletonPanel: "border-[#d7dfd4] bg-[#faf9f4]",
    cardHover: "hover:border-[#a8b9a7]",
    starFilled: "fill-[#c58a55] text-[#c58a55]",
    starEmpty: "fill-transparent text-[#a9b4a7]/50",
    ratingText: "text-[#4b6051]",
    status: {
      pending: "border-[#c58a55]/35 bg-[#c58a55]/10 text-[#a16c3e]",
      approved: "border-[#819783]/40 bg-[#819783]/15 text-[#4c6c53]",
      rejected: "border-[#c77f70]/35 bg-[#c77f70]/10 text-[#a35e50]",
    },
    action: "text-[#4b6051] hover:bg-[#819783]/10 hover:text-[#34433b]",
    dangerAction: "text-[#a35e50] hover:bg-[#c77f70]/10",
    approveButton: "bg-[#819783]/15 text-[#4c6c53] hover:bg-[#819783]/25",
    rejectButton:
      "border-[#c58a55]/25 bg-[#c58a55]/5 text-[#a16c3e] hover:bg-[#c58a55]/10 hover:text-[#87562f]",
    deleteButton:
      "border-[#c77f70]/25 bg-[#c77f70]/5 text-[#a35e50] hover:bg-[#c77f70]/10 hover:text-[#87483d]",
    summary: {
      primary: {
        icon: "border-[#819783]/30 bg-[#819783]/15 text-[#4c6c53]",
        glow: "from-[#819783]/[0.12]",
      },
      amber: {
        icon: "border-[#c58a55]/30 bg-[#c58a55]/10 text-[#a16c3e]",
        glow: "from-[#c58a55]/[0.09]",
      },
      green: {
        icon: "border-[#819783]/30 bg-[#819783]/15 text-[#4c6c53]",
        glow: "from-[#819783]/[0.10]",
      },
      red: {
        icon: "border-[#c77f70]/30 bg-[#c77f70]/10 text-[#a35e50]",
        glow: "from-[#c77f70]/[0.08]",
      },
    },
  },
};

function getBranchTheme(branchSlug: string): BranchTheme {
  switch (branchSlug) {
    case "cabang-1":
      return "modern";
    case "cabang-2":
      return "heritage";
    case "cabang-3":
      return "classic";
    case "cabang-4":
      return "cozy";
    default:
      return "modern";
  }
}

function getReviewId(review: CustomerReview) {
  return String(review._id ?? review.id ?? "");
}

function getCustomerName(review: CustomerReview) {
  return review.customerName?.trim() || review.name?.trim() || "Pelanggan";
}

function formatReviewDate(value?: string | Date) {
  if (!value) return "Tanggal tidak tersedia";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "P"
  );
}

function getReplyAuthorName(review: CustomerReview) {
  return review.adminReply?.repliedByName?.trim() || "Admin Kopilogi";
}

function getReplyRoleLabel(role?: ReviewReplyRole) {
  if (role === "super_admin") {
    return "Super Admin · Owner";
  }

  if (role === "admin") {
    return "Admin · Karyawan";
  }

  return "Admin Kopilogi";
}

function StatusBadge({ status, theme }: { status: ReviewStatus; theme: ThemeConfig }) {
  const config = {
    pending: { label: "Menunggu", icon: Clock3 },
    approved: { label: "Disetujui", icon: CheckCircle2 },
    rejected: { label: "Ditolak", icon: XCircle },
  }[status];

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
        theme.status[status],
      )}
    >
      <Icon className="size-3.5" />
      {config.label}
    </Badge>
  );
}

function RatingStars({
  rating,
  size = "sm",
  theme,
}: {
  rating: number;
  size?: "sm" | "md";
  theme: ThemeConfig;
}) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating || 0)));

  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${safeRating} dari 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "shrink-0",
            size === "md" ? "size-4 sm:size-[18px]" : "size-3.5 sm:size-4",
            index < safeRating ? theme.starFilled : theme.starEmpty,
          )}
        />
      ))}

      <span className={cn("ml-1 text-sm font-semibold tabular-nums", theme.ratingText)}>
        {safeRating}/5
      </span>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  accent,
  theme,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof MessageSquareText;
  accent: "primary" | "amber" | "green" | "red";
  theme: ThemeConfig;
}) {
  const accentTheme = theme.summary[accent];

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 sm:p-6",
        theme.panel,
        accentTheme.glow,
        "shadow-[0_8px_25px_rgba(0,0,0,0.05)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("text-sm font-medium leading-6 sm:text-base", theme.muted)}>{label}</p>

          <p
            className={cn("mt-3 text-3xl font-semibold tracking-tight sm:text-4xl", theme.heading)}
          >
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border sm:size-12",
            accentTheme.icon,
          )}
        >
          <Icon className="size-5 sm:size-[22px]" />
        </div>
      </div>

      <p className={cn("mt-4 text-sm leading-6 sm:text-[15px]", theme.soft)}>{description}</p>
    </div>
  );
}

function ReviewSkeleton({ theme }: { theme: ThemeConfig }) {
  return (
    <div className={cn("animate-pulse rounded-2xl border p-5 sm:p-6", theme.skeletonPanel)}>
      <div className="flex items-start gap-4">
        <div className={cn("size-12 shrink-0 rounded-full", theme.skeleton)} />

        <div className="flex-1 space-y-3">
          <div className={cn("h-4 w-36 rounded", theme.skeleton)} />
          <div className={cn("h-3 w-24 rounded", theme.skeleton)} />
          <div className={cn("h-4 w-full rounded", theme.skeleton)} />
          <div className={cn("h-4 w-3/4 rounded", theme.skeleton)} />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "default",
  theme,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
  theme: ThemeConfig;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "danger" ? theme.dangerAction : theme.action,
      )}
    >
      {children}
    </button>
  );
}

export function CustomerManagement({
  branchId,
  branchSlug,
  branchName = "Cabang Kopilogi",
}: CustomerManagementProps) {
  const themeName = getBranchTheme(branchSlug);
  const theme = THEMES[themeName];

  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(Boolean(branchId));
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const reloadReviews = useCallback(async () => {
    if (!branchId) {
      setReviews([]);
      setSummary(EMPTY_SUMMARY);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const result = await getCustomerReviewsAction({
        branchId,
        branchSlug,
      });

      if (!result?.success) {
        toast.error(result?.message || "Gagal memuat ulasan pelanggan.");
        return;
      }

      const payload = result.data;

      setReviews((payload?.reviews ?? []) as CustomerReview[]);

      setSummary({
        totalReviews: payload?.summary?.total ?? 0,
        pendingReviews: payload?.summary?.pending ?? 0,
        approvedReviews: payload?.summary?.approved ?? 0,
        rejectedReviews: payload?.summary?.rejected ?? 0,
        averageRating: payload?.summary?.averageRating ?? 0,
      });
    } catch {
      toast.error("Terjadi kesalahan saat memuat ulasan.");
    } finally {
      setIsLoading(false);
    }
  }, [branchId, branchSlug]);

  useEffect(() => {
    let active = true;

    async function loadInitialReviews() {
      if (!branchId) {
        setReviews([]);
        setSummary(EMPTY_SUMMARY);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const result = await getCustomerReviewsAction({
          branchId,
          branchSlug,
        });

        if (!active) return;

        if (!result?.success) {
          toast.error(result?.message || "Gagal memuat ulasan pelanggan.");
          return;
        }

        const payload = result.data;

        setReviews((payload?.reviews ?? []) as CustomerReview[]);

        setSummary({
          totalReviews: payload?.summary?.total ?? 0,
          pendingReviews: payload?.summary?.pending ?? 0,
          approvedReviews: payload?.summary?.approved ?? 0,
          rejectedReviews: payload?.summary?.rejected ?? 0,
          averageRating: payload?.summary?.averageRating ?? 0,
        });
      } catch {
        if (active) {
          toast.error("Terjadi kesalahan saat memuat ulasan.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialReviews();

    return () => {
      active = false;
    };
  }, [branchId, branchSlug]);

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesStatus = activeFilter === "all" || review.status === activeFilter;

      const matchesSearch =
        !query ||
        getCustomerName(review).toLowerCase().includes(query) ||
        (review.menuName ?? "").toLowerCase().includes(query) ||
        (review.comment ?? "").toLowerCase().includes(query) ||
        (review.adminReply?.message ?? "").toLowerCase().includes(query) ||
        (review.adminReply?.repliedByName ?? "").toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [reviews, activeFilter, searchQuery]);

  const filterCounts = useMemo(
    () => ({
      all: reviews.length,
      pending: reviews.filter((review) => review.status === "pending").length,
      approved: reviews.filter((review) => review.status === "approved").length,
      rejected: reviews.filter((review) => review.status === "rejected").length,
    }),
    [reviews],
  );

  const handleStatusChange = (review: CustomerReview, status: Exclude<ReviewStatus, "pending">) => {
    if (!branchId) {
      toast.error("ID cabang tidak tersedia.");
      return;
    }

    const reviewId = getReviewId(review);

    if (!reviewId) {
      toast.error("ID ulasan tidak ditemukan.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateMenuReviewStatusAction({
          reviewId,
          status,
          branchId,
          branchSlug,
        });

        if (!result?.success) {
          toast.error(result?.message || "Status ulasan gagal diperbarui.");
          return;
        }

        toast.success(
          status === "approved" ? "Ulasan berhasil disetujui." : "Ulasan berhasil ditolak.",
        );

        setOpenMenuId(null);
        await reloadReviews();
      } catch {
        toast.error("Terjadi kesalahan saat memperbarui ulasan.");
      }
    });
  };

  const handleDelete = (review: CustomerReview) => {
    if (!branchId) {
      toast.error("ID cabang tidak tersedia.");
      return;
    }

    const reviewId = getReviewId(review);

    if (!reviewId) {
      toast.error("ID ulasan tidak ditemukan.");
      return;
    }

    const confirmed = window.confirm(
      `Hapus ulasan dari ${getCustomerName(review)}? Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        const result = await removeMenuReviewAction({
          reviewId,
          branchId,
          branchSlug,
        });

        if (!result?.success) {
          toast.error(result?.message || "Ulasan gagal dihapus.");
          return;
        }

        toast.success("Ulasan berhasil dihapus.");
        setOpenMenuId(null);

        if (replyingReviewId === reviewId) {
          setReplyingReviewId(null);
          setReplyMessage("");
        }

        await reloadReviews();
      } catch {
        toast.error("Terjadi kesalahan saat menghapus ulasan.");
      }
    });
  };

  const handleOpenReply = (review: CustomerReview) => {
    const reviewId = getReviewId(review);

    if (!reviewId) {
      toast.error("ID ulasan tidak ditemukan.");
      return;
    }

    if (review.status !== "approved") {
      toast.error("Hanya ulasan yang sudah disetujui yang dapat dibalas.");
      return;
    }

    setReplyingReviewId(reviewId);
    setReplyMessage(review.adminReply?.message ?? "");
  };

  const handleCancelReply = () => {
    setReplyingReviewId(null);
    setReplyMessage("");
  };

  const handleSaveReply = (review: CustomerReview) => {
    if (!branchId) {
      toast.error("ID cabang tidak tersedia.");
      return;
    }

    const reviewId = getReviewId(review);

    if (!reviewId) {
      toast.error("ID ulasan tidak ditemukan.");
      return;
    }

    const trimmedMessage = replyMessage.trim();

    if (!trimmedMessage) {
      toast.error("Balasan tidak boleh kosong.");
      return;
    }

    if (trimmedMessage.length > 1000) {
      toast.error("Balasan maksimal 1000 karakter.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await saveMenuReviewReplyAction({
          reviewId,
          branchId,
          branchSlug,
          message: trimmedMessage,
        });

        if (!result?.success) {
          toast.error(result?.message || "Balasan gagal disimpan.");
          return;
        }

        toast.success(
          review.adminReply ? "Balasan berhasil diperbarui." : "Balasan berhasil dikirim.",
        );

        setReplyingReviewId(null);
        setReplyMessage("");
        await reloadReviews();
      } catch {
        toast.error("Terjadi kesalahan saat menyimpan balasan.");
      }
    });
  };

  const handleDeleteReply = (review: CustomerReview) => {
    if (!branchId) {
      toast.error("ID cabang tidak tersedia.");
      return;
    }

    const reviewId = getReviewId(review);

    if (!reviewId) {
      toast.error("ID ulasan tidak ditemukan.");
      return;
    }

    const confirmed = window.confirm(
      "Hapus balasan admin ini? Tindakan ini tidak dapat dibatalkan.",
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        const result = await deleteMenuReviewReplyAction({
          reviewId,
          branchId,
          branchSlug,
        });

        if (!result?.success) {
          toast.error(result?.message || "Balasan gagal dihapus.");
          return;
        }

        toast.success("Balasan berhasil dihapus.");

        if (replyingReviewId === reviewId) {
          setReplyingReviewId(null);
          setReplyMessage("");
        }

        await reloadReviews();
      } catch {
        toast.error("Terjadi kesalahan saat menghapus balasan.");
      }
    });
  };

  return (
    <section
      className={cn(
        "w-full min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9 xl:px-10 xl:py-10",
        theme.page,
        theme.text,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-7 sm:gap-8 lg:gap-9">
        <header
          className={cn(
            "flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-center sm:justify-between sm:pb-8",
            theme.divider,
          )}
        >
          <div className="min-w-0">
            <div
              className={cn(
                "mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.15em] sm:text-sm",
                theme.eyebrow,
              )}
            >
              <MessageSquareText className="size-4" />
              Customer feedback
            </div>

            <h1
              className={cn(
                "text-2xl font-semibold tracking-tight sm:text-3xl lg:text-[34px]",
                theme.heading,
              )}
            >
              Ulasan Pelanggan
            </h1>

            <p className={cn("mt-3 max-w-2xl text-sm leading-7 sm:text-base", theme.muted)}>
              Kelola, moderasi, dan tanggapi ulasan menu dari pelanggan{" "}
              <span className={cn("font-medium", theme.heading)}>{branchName}</span>. Ulasan yang
              disetujui dapat ditampilkan kepada pengunjung website.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => void reloadReviews()}
            disabled={isLoading || isPending}
            className={cn(
              "h-11 shrink-0 gap-2 self-start rounded-xl px-4 text-sm sm:self-center",
              theme.button,
            )}
          >
            <RefreshCw className={cn("size-4", (isLoading || isPending) && "animate-spin")} />
            Segarkan data
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          <SummaryCard
            label="Total ulasan"
            value={summary.totalReviews}
            description="Seluruh ulasan yang tercatat"
            icon={MessageSquareText}
            accent="primary"
            theme={theme}
          />

          <SummaryCard
            label="Menunggu moderasi"
            value={summary.pendingReviews}
            description="Perlu ditinjau oleh admin"
            icon={Clock3}
            accent="amber"
            theme={theme}
          />

          <SummaryCard
            label="Rating rata-rata"
            value={`${summary.averageRating.toFixed(1)}/5`}
            description={`${summary.approvedReviews} ulasan disetujui`}
            icon={Star}
            accent="green"
            theme={theme}
          />

          <SummaryCard
            label="Ulasan ditolak"
            value={summary.rejectedReviews}
            description="Ulasan yang tidak dipublikasikan"
            icon={XCircle}
            accent="red"
            theme={theme}
          />
        </div>

        <div
          className={cn(
            "overflow-visible rounded-2xl border p-4 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-6 lg:p-7",
            theme.panel,
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-5 border-b pb-6 lg:flex-row lg:items-center lg:justify-between",
              theme.divider,
            )}
          >
            <div>
              <h2 className={cn("text-lg font-semibold sm:text-xl", theme.heading)}>
                Daftar ulasan
              </h2>

              <p className={cn("mt-2 text-sm leading-6 sm:text-[15px]", theme.soft)}>
                Cari ulasan, atur status publikasi, dan balas pelanggan.
              </p>
            </div>

            <div className="relative w-full lg:max-w-[360px]">
              <Search
                className={cn(
                  "pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2",
                  theme.soft,
                )}
              />

              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari pelanggan, menu, atau komentar..."
                className={cn("h-12 rounded-xl pl-11 pr-4 text-sm sm:text-[15px]", theme.input)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 py-5 sm:py-6">
            {FILTER_OPTIONS.map((option) => {
              const selected = activeFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveFilter(option.value)}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors sm:px-4 sm:text-[15px]",
                    selected ? theme.filterActive : theme.filterInactive,
                  )}
                >
                  {option.label}

                  <span
                    className={cn(
                      "min-w-6 rounded-md px-1.5 py-0.5 text-center text-xs tabular-nums",
                      selected ? theme.filterCountActive : theme.filterCountInactive,
                    )}
                  >
                    {filterCounts[option.value]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <>
                <ReviewSkeleton theme={theme} />
                <ReviewSkeleton theme={theme} />
                <ReviewSkeleton theme={theme} />
              </>
            ) : filteredReviews.length === 0 ? (
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-14 text-center sm:py-16",
                  theme.innerPanel,
                  theme.border,
                )}
              >
                <div
                  className={cn(
                    "mb-5 flex size-14 items-center justify-center rounded-2xl border",
                    theme.emptyIcon,
                  )}
                >
                  <MessageSquareText className="size-6" />
                </div>

                <h3 className={cn("text-base font-semibold sm:text-lg", theme.heading)}>
                  {searchQuery || activeFilter !== "all"
                    ? "Ulasan tidak ditemukan"
                    : "Belum ada ulasan pelanggan"}
                </h3>

                <p className={cn("mt-2 max-w-md text-sm leading-7 sm:text-[15px]", theme.soft)}>
                  {searchQuery || activeFilter !== "all"
                    ? "Coba ubah kata kunci pencarian atau pilih filter yang berbeda."
                    : "Ulasan pelanggan akan muncul di sini setelah pelanggan mengirimkan penilaian menu."}
                </p>

                {(searchQuery || activeFilter !== "all") && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                    className={cn("mt-5 h-10 rounded-xl px-4 text-sm", theme.button)}
                  >
                    Reset filter
                  </Button>
                )}
              </div>
            ) : (
              filteredReviews.map((review) => {
                const reviewId = getReviewId(review);
                const customerName = getCustomerName(review);
                const menuName = review.menuName || "Menu Kopilogi";
                const isMenuOpen = openMenuId === reviewId;
                const isReplying = replyingReviewId === reviewId;
                const hasReply = Boolean(review.adminReply?.message?.trim());

                return (
                  <article
                    key={reviewId}
                    className={cn(
                      "relative rounded-2xl border p-4 transition-colors sm:p-6 lg:p-7",
                      theme.innerPanel,
                      theme.border,
                      theme.cardHover,
                    )}
                  >
                    <div className="flex items-start gap-3.5 sm:gap-5">
                      <div
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold sm:size-12 sm:text-base",
                          theme.avatar,
                        )}
                      >
                        {getInitials(customerName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3
                              className={cn(
                                "break-words text-base font-semibold sm:text-lg",
                                theme.heading,
                              )}
                            >
                              {customerName}
                            </h3>

                            <p
                              className={cn("mt-1.5 text-sm leading-6 sm:text-[15px]", theme.soft)}
                            >
                              {formatReviewDate(review.createdAt)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={review.status} theme={theme} />

                            <div className="relative">
                              <button
                                type="button"
                                aria-label="Buka tindakan ulasan"
                                aria-expanded={isMenuOpen}
                                onClick={() => setOpenMenuId(isMenuOpen ? null : reviewId)}
                                className={cn(
                                  "flex size-10 items-center justify-center rounded-xl border transition-colors",
                                  theme.button,
                                )}
                              >
                                <MoreHorizontal className="size-5" />
                              </button>

                              {isMenuOpen && (
                                <>
                                  <button
                                    type="button"
                                    aria-label="Tutup menu tindakan"
                                    onClick={() => setOpenMenuId(null)}
                                    className="fixed inset-0 z-40 cursor-default"
                                  />

                                  <div
                                    className={cn(
                                      "absolute right-0 top-12 z-50 w-56 rounded-2xl border p-2",
                                      theme.dropdown,
                                    )}
                                  >
                                    {review.status !== "approved" && (
                                      <ActionButton
                                        disabled={isPending}
                                        theme={theme}
                                        onClick={() => handleStatusChange(review, "approved")}
                                      >
                                        <Check
                                          className={cn(
                                            "size-4",
                                            theme.status.approved.split(" ").at(-1),
                                          )}
                                        />
                                        Setujui ulasan
                                      </ActionButton>
                                    )}

                                    {review.status !== "rejected" && (
                                      <ActionButton
                                        disabled={isPending}
                                        theme={theme}
                                        onClick={() => handleStatusChange(review, "rejected")}
                                      >
                                        <X
                                          className={cn(
                                            "size-4",
                                            theme.status.rejected.split(" ").at(-1),
                                          )}
                                        />
                                        Tolak ulasan
                                      </ActionButton>
                                    )}

                                    {review.status === "approved" && (
                                      <ActionButton
                                        disabled={isPending}
                                        theme={theme}
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          handleOpenReply(review);
                                        }}
                                      >
                                        <MessageSquareText className="size-4" />
                                        {hasReply ? "Edit balasan" : "Balas pelanggan"}
                                      </ActionButton>
                                    )}

                                    <div className={cn("my-1 border-t", theme.divider)} />

                                    <ActionButton
                                      disabled={isPending}
                                      theme={theme}
                                      variant="danger"
                                      onClick={() => handleDelete(review)}
                                    >
                                      <Trash2 className="size-4" />
                                      Hapus ulasan
                                    </ActionButton>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <RatingStars rating={review.rating} size="md" theme={theme} />

                          <span
                            className={cn(
                              "rounded-lg border px-2.5 py-1.5 text-xs font-medium sm:text-sm",
                              theme.menuBadge,
                            )}
                          >
                            {menuName}
                          </span>
                        </div>

                        <div className={cn("mt-5 rounded-xl border p-4 sm:p-5", theme.comment)}>
                          <p
                            className={cn(
                              "whitespace-pre-wrap break-words text-sm leading-7 sm:text-[15px] sm:leading-7",
                              theme.text,
                            )}
                          >
                            {review.comment?.trim() || "Pelanggan tidak menambahkan komentar."}
                          </p>
                        </div>

                        {/* Balasan admin */}
                        {hasReply && !isReplying && (
                          <div
                            className={cn(
                              "mt-4 rounded-xl border p-4 sm:p-5",
                              theme.accentBorder,
                              theme.accentBg,
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                                  theme.avatar,
                                )}
                              >
                                <ShieldCheck className="size-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className={cn("text-sm font-semibold", theme.heading)}>
                                        {getReplyAuthorName(review)}
                                      </span>

                                      <span
                                        className={cn(
                                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                                          theme.menuBadge,
                                        )}
                                      >
                                        {getReplyRoleLabel(review.adminReply?.repliedByRole)}
                                      </span>
                                    </div>

                                    <p className={cn("mt-1 text-xs", theme.soft)}>
                                      Balasan admin ·{" "}
                                      {formatReviewDate(review.adminReply?.createdAt)}
                                      {review.adminReply?.updatedAt &&
                                      review.adminReply.createdAt !== review.adminReply.updatedAt
                                        ? " · Diedit"
                                        : ""}
                                    </p>
                                  </div>

                                  <div className="flex shrink-0 items-center gap-1">
                                    <button
                                      type="button"
                                      disabled={isPending}
                                      onClick={() => handleOpenReply(review)}
                                      className={cn(
                                        "flex size-9 items-center justify-center rounded-lg transition-colors",
                                        theme.action,
                                      )}
                                      aria-label="Edit balasan"
                                      title="Edit balasan"
                                    >
                                      <Pencil className="size-4" />
                                    </button>

                                    <button
                                      type="button"
                                      disabled={isPending}
                                      onClick={() => handleDeleteReply(review)}
                                      className={cn(
                                        "flex size-9 items-center justify-center rounded-lg transition-colors",
                                        theme.dangerAction,
                                      )}
                                      aria-label="Hapus balasan"
                                      title="Hapus balasan"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                </div>

                                <p
                                  className={cn(
                                    "mt-3 whitespace-pre-wrap break-words text-sm leading-7 sm:text-[15px]",
                                    theme.text,
                                  )}
                                >
                                  {review.adminReply?.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Form balasan */}
                        {isReplying && (
                          <div
                            className={cn(
                              "mt-4 rounded-xl border p-4 sm:p-5",
                              theme.accentBorder,
                              theme.accentBg,
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "flex size-9 items-center justify-center rounded-lg border",
                                  theme.avatar,
                                )}
                              >
                                <UserRound className="size-4" />
                              </div>

                              <div>
                                <p className={cn("text-sm font-semibold", theme.heading)}>
                                  {hasReply ? "Edit balasan" : "Balas pelanggan"}
                                </p>

                                <p className={cn("mt-0.5 text-xs", theme.soft)}>
                                  Balasan akan menggunakan identitas akun yang sedang login.
                                </p>
                              </div>
                            </div>

                            <textarea
                              value={replyMessage}
                              onChange={(event) =>
                                setReplyMessage(event.target.value.slice(0, 1000))
                              }
                              maxLength={1000}
                              rows={4}
                              placeholder="Tulis balasan yang sopan dan membantu..."
                              disabled={isPending}
                              className={cn(
                                "mt-4 w-full resize-y rounded-xl border px-4 py-3 text-sm leading-7 outline-none transition-colors",
                                "focus:ring-2",
                                theme.input,
                              )}
                            />

                            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <p
                                className={cn(
                                  "text-xs tabular-nums",
                                  replyMessage.length >= 950 ? "text-amber-500" : theme.soft,
                                )}
                              >
                                {replyMessage.length}/1000 karakter
                              </p>

                              <div className="flex flex-wrap items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isPending}
                                  onClick={handleCancelReply}
                                  className={cn("h-10 rounded-xl px-4 text-sm", theme.button)}
                                >
                                  Batal
                                </Button>

                                <Button
                                  type="button"
                                  disabled={isPending || !replyMessage.trim()}
                                  onClick={() => handleSaveReply(review)}
                                  className={cn(
                                    "h-10 gap-2 rounded-xl px-4 text-sm",
                                    theme.approveButton,
                                  )}
                                >
                                  <Send className="size-4" />
                                  {hasReply ? "Simpan perubahan" : "Kirim balasan"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action utama */}
                        <div className="mt-5 flex flex-wrap gap-2.5">
                          {review.status !== "approved" && (
                            <Button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleStatusChange(review, "approved")}
                              className={cn(
                                "h-10 gap-2 rounded-xl px-3.5 text-sm font-medium",
                                theme.approveButton,
                              )}
                            >
                              <CheckCircle2 className="size-4" />
                              Setujui
                            </Button>
                          )}

                          {review.status !== "rejected" && (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="outline"
                              onClick={() => handleStatusChange(review, "rejected")}
                              className={cn(
                                "h-10 gap-2 rounded-xl px-3.5 text-sm font-medium",
                                theme.rejectButton,
                              )}
                            >
                              <XCircle className="size-4" />
                              Tolak
                            </Button>
                          )}

                          {review.status === "approved" && (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="outline"
                              onClick={() => handleOpenReply(review)}
                              className={cn(
                                "h-10 gap-2 rounded-xl px-3.5 text-sm font-medium",
                                theme.button,
                              )}
                            >
                              <MessageSquareText className="size-4" />
                              {hasReply ? "Edit balasan" : "Balas pelanggan"}
                            </Button>
                          )}

                          <Button
                            type="button"
                            disabled={isPending}
                            variant="outline"
                            onClick={() => handleDelete(review)}
                            className={cn(
                              "h-10 gap-2 rounded-xl px-3.5 text-sm font-medium",
                              theme.deleteButton,
                            )}
                          >
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {!isLoading && filteredReviews.length > 0 && (
            <div
              className={cn(
                "mt-6 flex flex-col gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between",
                theme.divider,
              )}
            >
              <p className={cn("text-sm leading-6 sm:text-[15px]", theme.soft)}>
                Menampilkan{" "}
                <span className={cn("font-semibold", theme.heading)}>{filteredReviews.length}</span>{" "}
                dari <span className={cn("font-semibold", theme.heading)}>{reviews.length}</span>{" "}
                ulasan
              </p>

              <p className={cn("text-sm", theme.soft)}>{branchName} · Moderasi ulasan</p>
            </div>
          )}
        </div>

        <p className={cn("pb-2 text-center text-xs leading-6 sm:text-sm", theme.soft)}>
          Kopilogi Admin · {branchName}
        </p>
      </div>
    </section>
  );
}
