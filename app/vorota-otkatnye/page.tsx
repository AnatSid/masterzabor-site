import { ServicePage } from "@/components/templates/ServicePage";
import { getRequiredServiceBySlug } from "@/content/services";
import { generatePageMetadata } from "@/lib/seo";

const service = getRequiredServiceBySlug("vorota-otkatnye");

export const metadata = generatePageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: `/${service.slug}`,
});

export default function VorotaOtkatnyePage() {
  return <ServicePage service={service} />;
}
