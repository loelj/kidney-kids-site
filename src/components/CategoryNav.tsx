import { useTranslations } from 'next-intl';
import Link from 'next/link';

const categories = [
  'nephrotic-syndrome',
  'iga-nephropathy',
  'purpura-nephritis',
  'lupus-nephritis',
  'uti',
  'daily-care'
] as const;

const categoryIcons: Record<string, string> = {
  'nephrotic-syndrome': '🫘',
  'iga-nephropathy': '🔬',
  'purpura-nephritis': '💜',
  'lupus-nephritis': '🦋',
  'uti': '💧',
  'daily-care': '🏥'
};

export default function CategoryNav({ locale }: { locale: string }) {
  const t = useTranslations('articles');
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/${locale}/articles?category=${cat}`}
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <span className="text-3xl mb-2">{categoryIcons[cat]}</span>
          <span className="text-sm text-gray-700 text-center">{t(`categories.${cat}`)}</span>
        </Link>
      ))}
    </div>
  );
}
