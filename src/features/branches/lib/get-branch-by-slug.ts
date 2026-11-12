import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { Branch } from "../models/branch.model";

export async function getBranchBySlug(slug: string) {
  await connectToDatabase();

  const branch = await Branch.findOne({ slug })
    .select("_id name slug concept address phone googleMapsUrl openingHours image isActive")
    .lean();

  if (!branch) {
    return null;
  }

  return {
    id: String(branch._id),
    name: branch.name,
    slug: branch.slug,
    concept: branch.concept,
    address: branch.address,
    phone: branch.phone ?? null,
    googleMapsUrl: branch.googleMapsUrl ?? null,
    openingHours: branch.openingHours ?? null,
    image: branch.image ?? null,
    isActive: branch.isActive,
  };
}
