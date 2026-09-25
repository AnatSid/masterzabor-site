import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "MasterZabor GSC Tools — доступ к Google Search Console",
  description:
    "Как внутренний инструмент MasterZabor GSC Tools использует доступ только для чтения к данным Google Search Console.",
  path: "/google-api-access",
});

export default function GoogleApiAccessPage() {
  return (
    <main className="bg-white py-14 text-slate-900 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-base leading-7 text-slate-700 sm:px-6">
        <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
          MasterZabor GSC Tools
        </h1>
        <p>
          MasterZabor GSC Tools — внутренний инструмент владельца masterzabor.by
          для просмотра данных Google Search Console. Эта публичная страница
          описывает инструмент; запуск и доступ к данным доступны только
          владельцу локально.
        </p>
        <p>
          Инструмент читает показатели Search Analytics, состояние отправленного
          sitemap и результаты URL Inspection для адресов из sitemap. Эти данные
          помогают проверять поисковую видимость и индексирование страниц сайта.
        </p>
        <p>
          Инструмент работает с доступом только для чтения. Он не проводит Live
          Test, не отправляет Request Indexing и не изменяет данные или настройки
          Google.
        </p>
        <p>
          Как используются полученные данные, описано в{" "}
          <Link className="text-[#1B5E20] underline" href="/google-api-privacy">
            Политике конфиденциальности
          </Link>
          . Условия внутреннего использования приведены в{" "}
          <Link className="text-[#1B5E20] underline" href="/google-api-terms">
            Правилах использования
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
