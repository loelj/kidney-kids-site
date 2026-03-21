import { getArticles } from '@/lib/articles';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ArticlesPage({
  params: { locale },
  searchParams
}: {
  params: { locale: string };
  searchParams: { category?: string; q?: string };
}) {
  const t = useTranslations('articles');
  let articles = getArticles(locale);

  if (searchParams.category) {
    articles = articles.filter(a => a.category === searchParams.category);
  }
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );
  }

  const categories = ['all', 'nephrotic-syndrome', 'iga-nephropathy', 'purpura-nephritis', 'lupus-nephritis', 'uti', 'daily-care'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
      <form className="mb-6">
        <input name="q" defaultValue={searchParams.q} placeholder={t('search')}
          className="w-full md:w-96 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </form>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <Link key={cat}
            href={`/${locale}/articles${cat === 'all' ? '' : `?category=${cat}`}`}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              (cat === 'all' && !searchParams.category) || searchParams.category === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 hover:border-blue-400'
            }`}>
            {t(`categories.${cat}`)}
          </Link>
        ))}
      </div>
      {articles.length === 0 ? (
        <p className="text-gray-400">{t('noResults')}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <Link key={article.slug} href={`/${locale}/articles/${article.slug}`}
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {t(`categories.${article.category}`)}
              </span>
              <h2 className="text-lg font-semibold mt-3 mb-2">{article.title}</h2>
              <p className="text-gray-500 text-sm line-clamp-2">{article.description}</p>
              <p className="text-xs text-gray-400 mt-3">{article.date}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
