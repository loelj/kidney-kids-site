'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const t = useTranslations('comment');
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`/api/comments?articleId=${articleId}`)
      .then(r => r.json())
      .then(setComments);
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, articleId })
    });
    if (res.ok) {
      const comment = await res.json();
      setComments([comment, ...comments]);
      setContent('');
    }
  };

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder={t('placeholder')} rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            {t('submit')}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 mb-6 text-sm">{t('loginToComment')}</p>
      )}
      {comments.length === 0 ? (
        <p className="text-gray-400 text-sm">{t('noComments')}</p>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{c.user.name}</span>
                <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 text-sm">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
