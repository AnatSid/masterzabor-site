import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Политика конфиденциальности MasterZabor GSC Tools",
  description:
    "Какие данные Google Search Console читает MasterZabor GSC Tools, зачем они нужны, где хранятся и как отозвать доступ.",
  path: "/google-api-privacy",
});

export default function GoogleApiPrivacyPage() {
  return (
    <main className="bg-white py-14 text-slate-900 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-base leading-7 text-slate-700 sm:px-6">
        <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
          Политика конфиденциальности MasterZabor GSC Tools
        </h1>
        <p>
          Эта политика описывает работу MasterZabor GSC Tools с данными Google
          Search Console. Она относится к внутреннему GSC-инструменту, а не
          описывает все способы обработки данных посетителей сайта masterzabor.by.
        </p>
        <h2 className="text-xl font-semibold text-slate-950">Какие данные читаем</h2>
        <p>
          С разрешения владельца инструмент получает список доступных Search
          Console properties и уровень доступа, состояние отправленного sitemap,
          показатели Search Analytics по страницам и запросам, а также результаты
          URL Inspection. Последние могут включать статус индексирования, дату
          обхода, выбранный Google canonical и ссылающиеся URL, если Google их
          предоставил.
        </p>
        <h2 className="text-xl font-semibold text-slate-950">Зачем они нужны</h2>
        <p>
          Эти сведения используются для диагностики поисковой видимости и
          индексирования masterzabor.by. Инструмент не запрашивает право изменять
          данные Search Console, не отправляет URL на индексацию и не использует
          данные для рекламы.
        </p>
        <h2 className="text-xl font-semibold text-slate-950">Хранение и передача</h2>
        <p>
          OAuth client ID, client secret и refresh token хранятся в локальном
          файле <code>.env.gsc.local</code>. Созданные по команде владельца
          JSON-снимки хранятся локально в <code>.tmp/seo/</code>; они могут
          содержать поисковые запросы и URL. Инструмент не удаляет снимки
          автоматически: владелец управляет локальными файлами сам. Access token
          не записывается в снимок и не выводится командой.
        </p>
        <p>
          Инструмент не продаёт данные Google Search Console и не пересылает
          снимки сторонним сервисам автоматически. Если владелец решит вручную
          передать снимок для анализа, это отдельное от работы инструмента
          действие.
        </p>
        <h2 className="text-xl font-semibold text-slate-950">Как отозвать доступ</h2>
        <p>
          Владелец может прекратить дальнейший доступ, удалив разрешение
          MasterZabor GSC Tools в{" "}
          <a
            className="text-[#1B5E20] underline"
            href="https://myaccount.google.com/connections"
          >
            настройках подключённых приложений Google
          </a>
          . Отзыв разрешения не удаляет уже сохранённые локальные снимки; их
          нужно удалить отдельно. Подробнее об отзыве доступа — в{" "}
          <a
            className="text-[#1B5E20] underline"
            href="https://support.google.com/accounts/answer/13533235?hl=ru"
          >
            справке Google
          </a>
          .
        </p>
        <p>
          <Link className="text-[#1B5E20] underline" href="/google-api-access">
            О MasterZabor GSC Tools
          </Link>
        </p>
      </div>
    </main>
  );
}
