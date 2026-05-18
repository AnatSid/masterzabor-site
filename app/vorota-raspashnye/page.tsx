import { ServicePage } from "@/components/templates/ServicePage";
import { getRequiredServiceBySlug } from "@/content/services";
import { generatePageMetadata } from "@/lib/seo";

const service = getRequiredServiceBySlug("vorota-raspashnye");

export const metadata = generatePageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: `/${service.slug}/`,
});

export default function VorotaRaspashnyePage() {
  return <ServicePage service={service} />;
}
