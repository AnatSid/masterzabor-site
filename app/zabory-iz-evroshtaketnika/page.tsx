import { ServicePage } from "@/components/templates/ServicePage";
import { getRequiredServiceBySlug } from "@/content/services";
import { generatePageMetadata } from "@/lib/seo";

const service = getRequiredServiceBySlug("zabory-iz-evroshtaketnika");

export const metadata = generatePageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: `/${service.slug}`,
  keywords: service.keywords,
});

export default function ZaboryIzEvroshtaketnikaPage() {
  return <ServicePage service={service} />;
}
