import { getArticles } from '@/lib/articles';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CategoryNav from '@/components/CategoryNav';

export default function HomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = useTranslations('home');
  const articles = getArticles(locale).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 bg-gradient-to-b from-blue-50 to-transparent rounded-2xl mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">{t('subtitle')}</p>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">{t('categories')}</h2>
        <CategoryNav locale={locale} />
      </section>

      {/* Featured Articles */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t('featuredArticles')}</h2>
          <Link href={`/${locale}/articles`} className="text-blue-600 text-sm hover:underline">
            {t('viewAll')} &rarr;
          </Link>
        </div>
        {articles.length === 0 ? (
          <p className="text-gray-400 text-sm">暂无文章</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link key={article.slug} href={`/${locale}/articles/${article.slug}`}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{article.description}</p>
                <p className="text-xs text-gray-400 mt-3">{article.date}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Latest Q&A */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t('latestQA')}</h2>
          <Link href={`/${locale}/qa`} className="text-blue-600 text-sm hover:underline">
            {t('viewAll')} &rarr;
          </Link>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <p className="text-gray-400 text-sm text-center py-4">
            {locale === 'zh' ? '欢迎来到问答社区，点击上方链接开始提问' : 'Welcome to Q&A, click the link above to start asking'}
          </p>
        </div>
      </section>

      {/* About */}
      <section className="bg-blue-50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-4">{t('about')}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t('aboutText')}</p>
      </section>
    </div>
  );
}
