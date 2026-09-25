import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Правила использования MasterZabor GSC Tools",
  description:
    "Условия внутреннего использования MasterZabor GSC Tools и его доступа только для чтения к Google Search Console.",
  path: "/google-api-terms",
});

export default function GoogleApiTermsPage() {
  return (
    <main className="bg-white py-14 text-slate-900 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-base leading-7 text-slate-700 sm:px-6">
        <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
          Правила использования MasterZabor GSC Tools
        </h1>
        <p>
          MasterZabor GSC Tools предназначен для внутреннего использования
          владельцем masterzabor.by. Публичная страница с описанием инструмента
          не предоставляет посетителям сайта доступ к Google Search Console или
          к локальным снимкам.
        </p>
        <p>
          Инструмент читает данные Search Analytics, состояние sitemap и
          результаты URL Inspection через отдельное разрешение Google Search
          Console только для чтения. Он не изменяет данные Google и не отправляет
          Request Indexing.
        </p>
        <p>
          Для работы требуется Google-аккаунт с доступом к соответствующей
          Search Console property. Владелец управляет разрешением OAuth,
          локальными настройками и сохранёнными снимками.
        </p>
        <p>
          Сведения об использовании и хранении данных Google приведены в{" "}
          <Link className="text-[#1B5E20] underline" href="/google-api-privacy">
            Политике конфиденциальности
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
