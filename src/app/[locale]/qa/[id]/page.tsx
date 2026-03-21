'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Answer {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
}

interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
  answers: Answer[];
}

export default function QuestionDetailPage() {
  const t = useTranslations('qa');
  const tc = useTranslations('common');
  const { locale, id } = useParams();
  const { data: session } = useSession();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    fetch(`/api/qa/${id}`).then(r => r.json()).then(setQuestion);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    const res = await fetch(`/api/qa/${id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: answer })
    });
    if (res.ok) {
      const a = await res.json();
      setQuestion(prev => prev ? { ...prev, answers: [...prev.answers, a] } : prev);
      setAnswer('');
    }
  };

  if (!question) return <p className="text-gray-400">{tc('loading')}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/${locale}/qa`} className="text-blue-600 text-sm hover:underline">
        &larr; {tc('back')}
      </Link>
      <div className="mt-4 bg-white p-6 rounded-xl border">
        <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
        <div className="flex text-xs text-gray-400 mb-4">
          <span>{question.user.name}</span>
          <span className="mx-2">&middot;</span>
          <span>{new Date(question.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-700">{question.content}</p>
      </div>
      <h3 className="text-lg font-semibold mt-8 mb-4">{question.answers.length} {t('answers')}</h3>
      <div className="space-y-4 mb-8">
        {question.answers.map(a => (
          <div key={a.id} className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">{a.user.name}</span>
              <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 text-sm">{a.content}</p>
          </div>
        ))}
      </div>
      {session ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder={t('answerPlaceholder')} rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            {t('submitAnswer')}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 text-sm">{t('loginToAnswer')}</p>
      )}
    </div>
  );
}
