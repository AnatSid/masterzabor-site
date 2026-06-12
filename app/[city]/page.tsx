import { notFound } from "next/navigation";
import { CityPage } from "@/components/templates/CityPage";
import { cities, getCityBySlug } from "@/content/cities";
import { generatePageMetadata } from "@/lib/seo";

type CityRouteParams = {
  city: string;
};

type CityRouteProps = {
  params: Promise<CityRouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: CityRouteProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  return {
    ...generatePageMetadata({
      title: `Заборы в ${city.namePrepositional} — купить и установить | МастерЗабор`,
      description: `Установка заборов в ${city.namePrepositional} и ${city.oblastGenitive}. Профнастил, штакетник, сетка-рабица. Цены от 30 BYN/м.п. Гарантия 20 лет.`,
      path: `/${city.slug}`,
    }),
    other: {
      "geo.region": "BY",
      "geo.placename": `${city.name}, Беларусь`,
      "geo.position": `${city.coords.lat};${city.coords.lng}`,
      ICBM: `${city.coords.lat}, ${city.coords.lng}`,
    },
  };
}

export default async function CityRoutePage({ params }: CityRouteProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  return <CityPage city={city} />;
}
