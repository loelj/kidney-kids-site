'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';

export default function Header() {
  const t = useTranslations('nav');
  const { locale } = useParams();
  const pathname = usePathname();
  const { data: session } = useSession();

  const switchLocale = locale === 'zh' ? 'en' : 'zh';
  const switchPath = pathname.replace(`/${locale}`, `/${switchLocale}`);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-bold text-blue-600">
          🫘 KidneyKids
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/${locale}`} className="text-gray-600 hover:text-blue-600 transition-colors">
            {t('home')}
          </Link>
          <Link href={`/${locale}/articles`} className="text-gray-600 hover:text-blue-600 transition-colors">
            {t('articles')}
          </Link>
          <Link href={`/${locale}/qa`} className="text-gray-600 hover:text-blue-600 transition-colors">
            {t('qa')}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href={switchPath} className="text-sm text-gray-500 hover:text-blue-600 border rounded px-2 py-1">
            {switchLocale === 'zh' ? '中文' : 'EN'}
          </Link>
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{session.user?.name}</span>
              <button onClick={() => signOut()} className="text-sm text-red-500 hover:text-red-700">
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link href={`/${locale}/login`} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
