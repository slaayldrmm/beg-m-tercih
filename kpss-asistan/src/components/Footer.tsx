import React from 'react';
import Link from 'next/link';
import { StethoscopeIcon } from './icons';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <StethoscopeIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">KPSS Sağlık Asistanı</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sağlık Bakanlığı KPSS sözleşmeli sağlık personeli (Hemşire Lisans) yerleştirme süreçleri için geliştirilmiş bağımsız, ücretsiz ve şeffaf tercih danışmanlığı asistanı.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Hızlı Erişim
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/nereye-yerlesirim" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  İl Bazlı Taban Puanlar & Harita
                </Link>
              </li>
              <li>
                <Link href="/tercih-listesi" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Akıllı Tercih Listesi Hazırlayıcı
                </Link>
              </li>
              <li>
                <Link href="/karsilastir" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Şehir Karşılaştırma Modülü
                </Link>
              </li>
              <li>
                <Link href="/takvim-ve-evraklar" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Atama Takvimi & Evrak Kontrol Listesi
                </Link>
              </li>
              <li>
                <Link href="/yontem" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Tahmin Metodolojisi & Veri Sözlüğü
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal notice */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Yasal Uyarılara İlişkin
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
              Bu sitede sunulan tüm puan tahminleri ve marj analizleri geçmiş atama (2024/5, 2025/4, 2025/5) verilerine dayanır. Adayların tercihlerini yaparken resmi ÖSYM kılavuzunu incelemesi zorunludur.
            </p>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
              Gizlilik: Puanınız ve listeniz yalnızca tarayıcınızda kalır, hiçbir sunucuya iletilmez.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          © 2026 KPSS Sağlık Bakanlığı Yerleştirme Asistanı. Resmi kurum sitesi değildir.
        </div>
      </div>
    </footer>
  );
}
