import { connectToDatabase } from "@/lib/mongodb";
import { Faq } from "@/features/faq/models/faq.model";

export type PublicFaq = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

type FaqLean = {
  _id: { toString(): string };
  category?: string;
  question: string;
  answer: string;
};

export async function getPublicFaqs(): Promise<PublicFaq[]> {
  await connectToDatabase();

  const docs = (await Faq.find({ status: "Published" })
    .sort({ createdAt: -1 })
    .lean()
    .exec()) as unknown as FaqLean[];

  return docs.map((doc) => ({
    id: doc._id.toString(),
    category: doc.category || "Umum",
    question: doc.question,
    answer: doc.answer,
  }));
}