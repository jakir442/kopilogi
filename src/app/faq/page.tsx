import { getPublicFaqs } from "@/features/faq/queries/public-faq.queries";
import { FaqPageView } from "@/features/faq/components/faq-page-view";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const faqs = await getPublicFaqs();
  return <FaqPageView faqs={faqs} />;
}