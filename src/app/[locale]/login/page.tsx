'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations('auth');
  const { locale } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    if (res?.error) {
      setError(t('loginError'));
    } else {
      router.push(`/${locale}`);
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold text-center mb-8">{t('loginTitle')}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('email')}</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('password')}</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {t('loginButton')}
        </button>
        <p className="text-center text-sm text-gray-500">
          {t('noAccount')} <Link href={`/${locale}/register`} className="text-blue-600 hover:underline">{t('goRegister')}</Link>
        </p>
      </form>
    </div>
  );
}
