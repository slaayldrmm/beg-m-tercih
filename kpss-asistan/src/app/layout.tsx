import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'KPSS Sağlık Bakanlığı Yerleştirme Asistanı | Hemşire (Lisans) Tercih Robotu',
  description: 'KPSS lisans puanınıza göre Sağlık Bakanlığı sözleşmeli sağlık personeli (Hemşire) alımlarında geçmiş taban puanları inceleyin, güvenli ve olası illeri keşfedin, akıllı tercih listenizi hazırlayın.',
  keywords: ['KPSS Sağlık', 'Hemşire Atama Puanları', 'KPSS Tercih Robotu', 'Sağlık Bakanlığı Taban Puanları', 'KPSS 2024/5', 'KPSS 2025/4', 'KPSS 2025/5'],
  authors: [{ name: 'KPSS Sağlık Asistanı' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <div className="print:hidden">
          <Footer />
        </div>
      </body>
    </html>
  );
}
