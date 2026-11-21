
import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { Branch } from "../models/branch.model";

export async function getBranchBySlug(slug: string) {
  await connectToDatabase();

  const branch = await Branch.findOne({ slug })
    .select(
      "_id name slug concept address phone googleMapsUrl openingHours weeklyOpeningHours image isActive",
    )
    .lean();

  if (!branch) {
    return null;
  }

  const weekly = branch.weeklyOpeningHours;

  const dayNames: Record<string, string> = {
    monday: "Senin",
    tuesday: "Selasa",
    wednesday: "Rabu",
    thursday: "Kamis",
    friday: "Jumat",
    saturday: "Sabtu",
    sunday: "Minggu",
  };

  const weeklyText = weekly
    ? Object.entries(dayNames)
        .map(([key, label]) => {
          const day = weekly[key as keyof typeof weekly];

          if (!day) return null;

          return day.isOpen
            ? `${label}: ${day.open}–${day.close}`
            : `${label}: Tutup`;
        })
        .filter(Boolean)
        .join(" | ")
    : "";

  return {
    id: String(branch._id),
    name: branch.name,
    slug: branch.slug,
    concept: branch.concept,
    address: branch.address,
    phone: branch.phone ?? null,
    googleMapsUrl: branch.googleMapsUrl ?? null,
    openingHours: weeklyText || branch.openingHours || null,
    image: branch.image ?? null,
    isActive: branch.isActive,
  };
}
