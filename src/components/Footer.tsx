import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('home');
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p className="mb-2">🫘 KidneyKids - {t('subtitle')}</p>
        <p>&copy; {new Date().getFullYear()} KidneyKids. All rights reserved.</p>
        <p className="mt-2 text-xs text-gray-400">
          本站内容仅供参考，不构成医疗建议。如有健康问题请咨询专业医生。
        </p>
      </div>
    </footer>
  );
}
