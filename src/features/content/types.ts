export const CONTENT_TYPES = [
  "gallery",
  "event",
  "promotion",
  "community",
  "news",
  "social",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];
export type ContentStatus = "draft" | "published" | "archived";
export type ContentLayoutSize = "auto" | "small" | "medium" | "large" | "wide";

export type BranchContent = {
  _id: string;
  branchId: string;
  type: ContentType;
  title: string;
  slug: string;
  description: string;
  image: string;
  media: string[];
  category: string;
  tags: string[];
  layoutSize: ContentLayoutSize;
  featured: boolean;
  status: ContentStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  startAt: string | null;
  endAt: string | null;
  location: string;
  communityName: string;
  collaborationType: string;
  ctaLabel: string;
  ctaUrl: string;
  platform: string;
  externalUrl: string;
  author: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type BranchContentInput = Omit<
  BranchContent,
  "_id" | "branchId" | "slug" | "createdAt" | "updatedAt"
> & { branchId?: string };

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  gallery: "Gallery",
  event: "Event & Activities",
  promotion: "Advertisement & Promotion",
  community: "Community & Moments",
  news: "News & Updates",
  social: "Social Media Highlights",
};
