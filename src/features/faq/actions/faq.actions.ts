"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { z } from "zod";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Faq, FaqCategory } from "@/features/faq/models/faq.model";

export type FaqStatus = "Draft" | "Published";

export type FaqAdminItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: FaqStatus;
};

export type FaqInput = Omit<FaqAdminItem, "id">;

export type FaqAdminData = {
  faqs: FaqAdminItem[];
  categories: string[];
};

export type FaqActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

type FaqLean = {
  _id: { toString(): string };
  question: string;
  answer: string;
  category: string;
  status?: FaqStatus;
};

const faqInputSchema = z.object({
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(3000),
  category: z.string().trim().min(1).max(60),
  status: z.enum(["Draft", "Published"]),
});

const categoryNameSchema = z.string().trim().min(1).max(60);

async function isSuperAdmin() {
  const session = await auth();
  return session?.user?.role === "super_admin";
}

function forbidden() {
  return {
    success: false,
    message: "Hanya super admin yang dapat mengubah FAQ.",
  };
}

function toItem(doc: FaqLean): FaqAdminItem {
  return {
    id: doc._id.toString(),
    question: doc.question,
    answer: doc.answer,
    category: doc.category,
    status: doc.status ?? "Draft",
  };
}

export async function getAdminFaqData(): Promise<FaqAdminData> {
  if (!(await isSuperAdmin())) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const faqDocs = (await Faq.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec()) as unknown as FaqLean[];

  const categoryDocs = (await FaqCategory.find()
    .sort({ createdAt: 1 })
    .lean()
    .exec()) as unknown as { name: string }[];

  return {
    faqs: faqDocs.map(toItem),
    categories: categoryDocs.map((doc) => doc.name),
  };
}

export async function createFaq(
  input: FaqInput,
): Promise<FaqActionResult<FaqAdminItem>> {
  try {
    if (!(await isSuperAdmin())) return forbidden();

    const parsed = faqInputSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: "Lengkapi kategori, pertanyaan, dan jawaban terlebih dahulu.",
      };
    }

    await connectToDatabase();

    const created = await Faq.create(parsed.data);

    revalidatePath("/faq");

    return {
      success: true,
      message: "FAQ berhasil ditambahkan.",
      data: toItem(created.toObject() as FaqLean),
    };
  } catch (error: unknown) {
    console.error("createFaq error:", error);
    return { success: false, message: "Gagal menyimpan FAQ. Silakan coba lagi." };
  }
}

export async function updateFaq(
  id: string,
  input: FaqInput,
): Promise<FaqActionResult<FaqAdminItem>> {
  try {
    if (!(await isSuperAdmin())) return forbidden();

    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: "ID FAQ tidak valid." };
    }

    const parsed = faqInputSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: "Lengkapi kategori, pertanyaan, dan jawaban terlebih dahulu.",
      };
    }

    await connectToDatabase();

    const updated = (await Faq.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true },
    )
      .lean()
      .exec()) as unknown as FaqLean | null;

    if (!updated) {
      return { success: false, message: "FAQ tidak ditemukan." };
    }

    revalidatePath("/faq");

    return {
      success: true,
      message: "Perubahan FAQ berhasil disimpan.",
      data: toItem(updated),
    };
  } catch (error: unknown) {
    console.error("updateFaq error:", error);
    return { success: false, message: "Gagal menyimpan FAQ. Silakan coba lagi." };
  }
}

export async function deleteFaq(id: string): Promise<FaqActionResult> {
  try {
    if (!(await isSuperAdmin())) return forbidden();

    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: "ID FAQ tidak valid." };
    }

    await connectToDatabase();
    await Faq.findByIdAndDelete(id);

    revalidatePath("/faq");

    return { success: true, message: "FAQ berhasil dihapus." };
  } catch (error: unknown) {
    console.error("deleteFaq error:", error);
    return { success: false, message: "Gagal menghapus FAQ. Silakan coba lagi." };
  }
}

export async function addFaqCategory(
  name: string,
): Promise<FaqActionResult<string>> {
  try {
    if (!(await isSuperAdmin())) return forbidden();

    const parsed = categoryNameSchema.safeParse(name);

    if (!parsed.success) {
      return { success: false, message: "Nama kategori tidak valid." };
    }

    await connectToDatabase();

    const existing = await FaqCategory.findOne({ name: parsed.data })
      .collation({ locale: "id", strength: 2 })
      .lean()
      .exec();

    if (existing) {
      return { success: false, message: "Kategori tersebut sudah tersedia." };
    }

    await FaqCategory.create({ name: parsed.data });

    revalidatePath("/faq");

    return {
      success: true,
      message: "Kategori berhasil ditambahkan.",
      data: parsed.data,
    };
  } catch (error: unknown) {
    console.error("addFaqCategory error:", error);
    return { success: false, message: "Gagal menambah kategori. Silakan coba lagi." };
  }
}

export async function deleteFaqCategory(name: string): Promise<FaqActionResult> {
  try {
    if (!(await isSuperAdmin())) return forbidden();

    await connectToDatabase();

    const used = await Faq.exists({ category: name });

    if (used) {
      return {
        success: false,
        message: "Kategori masih digunakan oleh FAQ. Ubah kategori FAQ terlebih dahulu.",
      };
    }

    await FaqCategory.deleteOne({ name });

    return { success: true, message: "Kategori berhasil dihapus." };
  } catch (error: unknown) {
    console.error("deleteFaqCategory error:", error);
    return { success: false, message: "Gagal menghapus kategori. Silakan coba lagi." };
  }
}