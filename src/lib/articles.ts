import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  content: string;
}

const contentDir = path.join(process.cwd(), 'content');

export function getArticles(locale: string): Article[] {
  const dir = path.join(contentDir, locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
  return files.map(file => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: file.replace('.mdx', ''),
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      date: data.date || '',
      content
    };
  }).sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getArticle(locale: string, slug: string): Article | null {
  const filePath = path.join(contentDir, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    category: data.category || '',
    date: data.date || '',
    content
  };
}
