import { getArticle, getArticles } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';

export function generateStaticParams() {
  const locales = ['zh', 'en'];
  const params: { locale: string; slug: string }[] = [];
  locales.forEach(locale => {
    getArticles(locale).forEach(a => {
      params.push({ locale, slug: a.slug });
    });
  });
  return params;
}

export default function ArticlePage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  const article = getArticle(locale, slug);
  if (!article) notFound();
  const t = useTranslations();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/${locale}/articles`} className="text-blue-600 text-sm hover:underline">
        &larr; {t('common.back')}
      </Link>
      <article className="mt-4">
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          {t(`articles.categories.${article.category}`)}
        </span>
        <h1 className="text-3xl font-bold mt-3 mb-2">{article.title}</h1>
        <p className="text-gray-400 text-sm mb-8">{article.date}</p>
        <div className="prose prose-blue max-w-none">
          {article.content.split('\n').map((p, i) =>
            p.trim() ? <p key={i}>{p}</p> : null
          )}
        </div>
      </article>
      <CommentSection articleId={slug} />
    </div>
  );
}
