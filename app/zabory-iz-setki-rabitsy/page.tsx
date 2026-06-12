import { ServicePage } from "@/components/templates/ServicePage";
import { getRequiredServiceBySlug } from "@/content/services";
import { generatePageMetadata } from "@/lib/seo";

const service = getRequiredServiceBySlug("zabory-iz-setki-rabitsy");

export const metadata = generatePageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: `/${service.slug}`,
});

export default function ZaboryIzSetkiRabitsyPage() {
  return <ServicePage service={service} />;
}
