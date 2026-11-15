import { connectToDatabase } from "@/lib/mongodb";
import { findPublishedContentsByBranchSlug } from "../repositories/content.repository";
import type { BranchContent } from "../types";

export async function getPublicBranchContents(branchSlug: string): Promise<BranchContent[]> {
  try {
    await connectToDatabase();
    const items = await findPublishedContentsByBranchSlug(branchSlug);
    return JSON.parse(JSON.stringify(items)) as BranchContent[];
  } catch (error) {
    console.error("[getPublicBranchContents]", error);
    return [];
  }
}
