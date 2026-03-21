import { NextIntlClientProvider, useMessages } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
