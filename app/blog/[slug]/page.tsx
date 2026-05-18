import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { blogPosts, getBlogPostBySlug } from "@/content/blog-posts";
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generatePageMetadata,
} from "@/lib/seo";

type BlogRouteParams = {
  slug: string;
};

type BlogRouteProps = {
  params: Promise<BlogRouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogRouteProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return generatePageMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}/`,
    image: post.image,
  });
}

export default async function BlogPostPage({ params }: BlogRouteProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  const articleJsonLd = generateArticleJsonLd({
    title: post.title,
    description: post.metaDescription,
    date: post.date,
    url: `/blog/${post.slug}/`,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Главная", url: "/" },
    { name: "Блог", url: "/blog/" },
    { name: post.title, url: `/blog/${post.slug}/` },
  ]);

  return (
    <main className="bg-white py-12 text-slate-900 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replaceAll("<", "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replaceAll("<", "\\u003c"),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <li>
              <Link className="hover:text-[#1B5E20]" href="/">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link className="hover:text-[#1B5E20]" href="/blog/">
                Блог
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-700">{post.title}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="min-w-0">
            <header>
              <p className="text-sm text-slate-500">
                {new Date(post.date).toLocaleDateString("ru-RU")}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-slate-600">{post.excerpt}</p>
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
            </header>

            <Image
              alt={post.title}
              className="mt-8 h-auto w-full rounded-2xl border border-slate-200 object-cover"
              height={630}
              priority
              src={post.image}
              width={1200}
            />

            <section
              className="prose prose-slate mt-8 max-w-none prose-headings:text-slate-900 prose-a:text-[#1B5E20]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-[#F5F5F5] p-6">
              <h2 className="text-xl font-bold text-slate-950">
                Бесплатный расчёт стоимости
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Назовите длину забора и материал — рассчитаем стоимость по
                телефону и подберём лучший вариант под ваш бюджет.
              </p>
              <a
                className="mt-5 inline-flex w-full justify-center rounded-xl bg-[#F59E0B] px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
                href="#blog-lead-form"
              >
                Получить расчёт
              </a>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-950">Другие статьи</h2>
              <ul className="mt-4 space-y-4">
                {relatedPosts.map((item) => (
                  <li key={item.slug}>
                    <Link
                      className="font-medium text-slate-800 transition hover:text-[#1B5E20]"
                      href={`/blog/${item.slug}/`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </section>

      <section className="mt-16 bg-[#1B5E20] py-14" id="blog-lead-form">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="text-white">
            <p className="font-semibold uppercase tracking-wide text-amber-300">
              Бесплатный расчёт
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Получите расчёт по телефону за 5 минут
            </h2>
            <p className="mt-5 text-green-50">
              Оставьте номер, и мы перезвоним в течение рабочего дня, чтобы
              рассчитать стоимость забора под ваш участок.
            </p>
          </div>
          <LeadForm source={`blog-post-${post.slug}`} />
        </div>
      </section>
    </main>
  );
}
