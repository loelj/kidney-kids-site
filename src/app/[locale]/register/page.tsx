'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const { locale } = useParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError(t('passwordMismatch'));
      return;
    }
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) {
      router.push(`/${locale}/login`);
    } else {
      const data = await res.json();
      setError(data.error || t('registerError'));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold text-center mb-8">{t('registerTitle')}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('name')}</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
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
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('confirmPassword')}</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {t('registerButton')}
        </button>
        <p className="text-center text-sm text-gray-500">
          {t('hasAccount')} <Link href={`/${locale}/login`} className="text-blue-600 hover:underline">{t('goLogin')}</Link>
        </p>
      </form>
    </div>
  );
}
