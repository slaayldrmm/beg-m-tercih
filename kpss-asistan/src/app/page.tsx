'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  StethoscopeIcon, 
  MapPinIcon, 
  ListOrderedIcon, 
  CalendarIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  ScaleIcon,
  SlidersIcon
} from '@/components/icons';
import { DisclaimerBanner, SourceDocBadge } from '@/components/DisclaimerBanner';
import professionConfig from '@/config/profession_filter.json';
import provincesSummary from '@/data/provinces_summary.json';

export default function HomePage() {
  const router = useRouter();
  const [scoreInput, setScoreInput] = useState<string>('');
  const [selectedProfession, setSelectedProfession] = useState<string>('hemsire-lisans');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    // Load previously entered score if exists
    const savedScore = localStorage.getItem('kpss_user_score');
    if (savedScore) {
      setScoreInput(savedScore);
    }
  }, []);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    const score = parseFloat(scoreInput.replace(',', '.'));

    if (isNaN(score) || score < 50 || score > 100) {
      setValidationError('Lütfen 50.00 ile 100.00 arasında geçerli bir KPSS Lisans puanı giriniz.');
      return;
    }

    setValidationError('');
    localStorage.setItem('kpss_user_score', score.toString());
    localStorage.setItem('kpss_target_profession', selectedProfession);
    router.push('/nereye-yerlesirim');
  };

  // Stats calculation
  const totalProvinces = provincesSummary.length;
  let totalQuotaAll = 0;
  let lowestScoreAll = 999;
  let highestScoreAll = 0;

  provincesSummary.forEach((p: any) => {
    totalQuotaAll += p.total_quota || 0;
    if (p.overall_min_score && p.overall_min_score < lowestScoreAll) {
      lowestScoreAll = p.overall_min_score;
    }
    if (p.overall_max_score && p.overall_max_score > highestScoreAll) {
      highestScoreAll = p.overall_max_score;
    }
  });

  return (
    <div className="w-full">
      {/* Hero Section with Medical Clean Teal Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-500/10 via-teal-500/5 to-transparent pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-teal-100 dark:border-teal-950/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            Sağlık Bakanlığı 2024 & 2025 ÖSYM Resmi Verileriyle Entegre
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            KPSS Puanınızla <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Hangi İllere Yerleşebilirsiniz?
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hemşirelik lisans mezunları için son 3 atama döneminin (2024/5, 2025/4, 2025/5) taban puanlarını analiz edin, risk marjınızı görün ve akıllı tercih listenizi saniyeler içinde hazırlayın.
          </p>

          {/* Score Input Card */}
          <div className="mt-10 max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800">
            <form onSubmit={handleStartAnalysis} className="space-y-5 text-left">
              <div>
                <label htmlFor="profession" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  1. Branş / Öğrenim Düzeyi
                </label>
                <div className="relative">
                  <select
                    id="profession"
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all text-sm"
                  >
                    {professionConfig.available_targets.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.title_tr} {p.slug === 'hemsire-lisans' ? '(Aktif Veri Seti)' : '(Yakında)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="kpssScore" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    2. KPSS P3 Lisans Puanınız
                  </label>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                    Örn: 78.45201
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="kpssScore"
                    placeholder="Örn: 78.50"
                    value={scoreInput}
                    onChange={(e) => {
                      setScoreInput(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    className={`w-full px-4 py-3.5 text-lg font-bold rounded-xl border ${
                      validationError 
                        ? 'border-rose-500 focus:ring-rose-500' 
                        : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                    } bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    P3 PUANI
                  </div>
                </div>
                {validationError && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">
                    {validationError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                id="btn-analyze"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 active:scale-[0.99] shadow-lg shadow-teal-600/25 transition-all text-base cursor-pointer"
              >
                <span>Nereye Yerleşebilirim? İlleri Gör</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-teal-500" />
                Kayıt / Üyelik Gerekmez
              </span>
              <span className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-teal-500" />
                Tarayıcıda Saklanır (Gizli)
              </span>
            </div>
          </div>

          {/* Mandatory Legal Disclaimer */}
          <div className="mt-8 max-w-xl mx-auto">
            <DisclaimerBanner compact />
          </div>
        </div>
      </section>

      {/* Key Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
              2.050
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Lisans Hemşire Kontenjanı
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">3 Dönem Toplamı</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalProvinces} İl
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Tüm Türkiye Kapsamı
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">81 İl Eksiksiz Analiz</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {lowestScoreAll.toFixed(2)}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              En Düşük Taban Puan
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Son 3 Dönem Minimumu</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">
              3 Resmi Dönem
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              2024/5 & 2025/4 & 2025/5
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">ÖSYM Min-Max Sonuçları</div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Tercih Sürecinde İhtiyacınız Olan Her Şey
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Kulaktan dolma bilgilere değil, ÖSYM'nin resmi yerleştirme sonuçlarına dayanan analitik araçlar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/nereye-yerlesirim"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPinIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              İnteraktif Türkiye Haritası
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              81 ilin taban puanlarını renkli risk haritasında görün; Güvenli, Olası ve Riskli illeri tek bakışta ayırt edin.
            </p>
            <div className="mt-4 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
              Haritayı İncele &rarr;
            </div>
          </Link>

          <Link
            href="/tercih-listesi"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ListOrderedIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Akıllı Tercih Listesi & Denge Analizi
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              İlleri listenize ekleyip sürükleyerek sıralayın. Açıkta kalma riskinizi ölçen akıllı algoritma ile liste dengesini koruyun.
            </p>
            <div className="mt-4 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
              Listemi Oluştur &rarr;
            </div>
          </Link>

          <Link
            href="/karsilastir"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ScaleIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Şehir Karşılaştırma Modülü
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Arasında kaldığınız illeri yan yana koyun; puan, kontenjan ve kendi aldığınız kira / nöbet notlarıyla kıyaslayın.
            </p>
            <div className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              Şehirleri Kıyasla &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* Official Data Source Information Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Resmi ÖSYM ve Sağlık Bakanlığı Veri Kaynakları
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sitemizdeki tüm taban puanlar ve kontenjan sayıları, ÖSYM tarafından yayımlanan KPSS-2024/5, KPSS-2025/4 ve KPSS-2025/5 tercih kılavuzları ile resmi yerleştirme sonuç tutanaklarından otomatik olarak derlenmiştir. Üçüncü taraf veya tahmini rakam kullanılmamıştır.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <SourceDocBadge docName="KPSS-2024/5 Lisans Yerleştirme Sonuçları" year="2024" />
              <SourceDocBadge docName="KPSS-2025/4 Lisans Yerleştirme Sonuçları" year="2025" />
              <SourceDocBadge docName="KPSS-2025/5 Lisans Yerleştirme Sonuçları" year="2025" />
            </div>
          </div>

          <Link
            href="/yontem"
            className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Yöntem & Veri Sözlüğü &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
