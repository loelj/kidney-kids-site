'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
  _count: { answers: number };
}

export default function QAPage() {
  const t = useTranslations('qa');
  const { locale } = useParams();
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/qa').then(r => r.json()).then(setQuestions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const res = await fetch('/api/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    if (res.ok) {
      const q = await res.json();
      setQuestions([{ ...q, _count: { answers: 0 } }, ...questions]);
      setTitle('');
      setContent('');
      setShowForm(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {session ? (
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            {t('askQuestion')}
          </button>
        ) : (
          <p className="text-gray-500 text-sm">{t('loginToAsk')}</p>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border mb-6 space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('questionTitle')}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('questionContent')}
            rows={4} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            {t('submit')}
          </button>
        </form>
      )}
      <div className="space-y-4">
        {questions.map(q => (
          <Link key={q.id} href={`/${locale}/qa/${q.id}`}
            className="block bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">{q.title}</h2>
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{q.content}</p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{q.user.name}</span>
              <span>{q._count.answers} {t('answers')} &middot; {new Date(q.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
