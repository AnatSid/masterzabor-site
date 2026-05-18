import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/content/blog-posts";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Блог о заборах в Беларуси: советы и цены 2026",
  description:
    "Полезные статьи от МастерЗабор: сравнение материалов, актуальные цены на заборы в Беларуси и практические рекомендации перед установкой.",
  path: "/blog/",
});

const posts = [...blogPosts].sort((a, b) =>
  b.date.localeCompare(a.date, "ru"),
);

export default function BlogPage() {
  return (
    <main className="bg-white py-14 text-slate-900 sm:py-16">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <li>
              <Link className="hover:text-[#1B5E20]" href="/">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-700">Блог</li>
          </ol>
        </nav>

        <header className="mt-5 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Блог о заборах в Беларуси
          </h1>
          <p className="mt-4 text-slate-600">
            Публикуем практические материалы по выбору забора, расчёту бюджета и
            подготовке участка к монтажу.
          </p>
        </header>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              key={post.slug}
            >
              <Link href={`/blog/${post.slug}/`}>
                <Image
                  alt={post.title}
                  className="h-52 w-full object-cover"
                  height={420}
                  src={post.image}
                  width={720}
                />
              </Link>
              <div className="flex grow flex-col p-6">
                <p className="text-sm text-slate-500">
                  {new Date(post.date).toLocaleDateString("ru-RU")}
                </p>
                <h2 className="mt-3 text-xl font-bold leading-tight">
                  <Link
                    className="transition hover:text-[#1B5E20]"
                    href={`/blog/${post.slug}/`}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 grow text-slate-600">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      key={tag}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <Link
                  className="mt-5 inline-flex font-semibold text-[#1B5E20] hover:text-green-800"
                  href={`/blog/${post.slug}/`}
                >
                  Читать статью →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
