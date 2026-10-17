import React from 'react';
import Link from 'next/link';
import { DisclaimerBanner, SourceDocBadge } from '@/components/DisclaimerBanner';
import { 
  InfoIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  SlidersIcon,
  MapPinIcon
} from '@/components/icons';
import predictionRules from '@/config/prediction_rules.json';

export default function MethodologyPage() {
  const { safe_margin, possible_lower_margin, risky_lower_margin } = predictionRules.thresholds;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
          <InfoIcon className="w-3.5 h-3.5" />
          Şeffaflık & Metodoloji
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Tahmin Algoritması & Veri Metodolojisi
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Platformumuzda sunulan tüm yerleştirme tahminleri ve risk kategorileri, geçmiş ÖSYM yerleştirme verilerinin matematiksel marj bantlarıyla analizine dayanır.
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner />

      {/* Section 1: Veri Kaynakları */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black">1</span>
          Veri Kaynakları ve Ayrıştırma Güvenilirliği
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
          <p>
            ÖSYM’nin kamuya açık bir API servisi <strong>bulunmamaktadır</strong>. Bu nedenle sistemimizdeki veriler, ÖSYM’nin internet sitesinde resmi olarak yayımladığı tercih kılavuzları (Tablo 3) ve yerleştirme sonuçları (en küçük / en büyük puanlar) PDF belgelerinden doğrudan Python veri boru hattı (pdfplumber, pandas) ile ayıklanmıştır.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Kapsanan Resmi Dönem Belgeleri:
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-teal-500 shrink-0" />
                <strong>KPSS 2024/5:</strong> Tercih Kılavuzu Tablo 3 & Lisans Yerleştirme Sonuçları (656 Hemşire Lisans kadrosu)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-teal-500 shrink-0" />
                <strong>KPSS 2025/4:</strong> Tercih Kılavuzu Tablo 3 & Lisans Yerleştirme Sonuçları (656 Hemşire Lisans kadrosu)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-teal-500 shrink-0" />
                <strong>KPSS 2025/5:</strong> Tercih Kılavuzu Tablo 3 & Lisans Yerleştirme Sonuçları (738 Hemşire Lisans kadrosu)
              </li>
            </ul>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            * 9 haneli ÖSYM Kurum Kodu üzerinden %100 birebir inner-join yapılmış olup hiçbir sahte veya uydurma veri üretilmemiştir. Ortaöğretim hemşirelik kadroları lisans tablosuna kesinlikle dahil edilmemiştir.
          </p>
        </div>
      </div>

      {/* Section 2: Tahmin Algoritması & Marj Bantları */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black">2</span>
            Risk Sınıflandırma Mantığı ve Formüller
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kullanıcının puanı ile ilin taban puanı arasındaki fark (<code className="font-mono text-teal-600">Puan Farkı = Puanınız - Taban Puan</code>) şu eşik değerlerine göre sınıflandırılır:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                🟢 Güvenli Tercih
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                Fark ≥ +{safe_margin} Puan
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              KPSS puanınız ilin son dönem taban puanının en az {safe_margin} puan üzerindedir. Olağanüstü bir kontenjan düşüşü yaşanmadıkça yerleşme olasılığınız çok yüksektir.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-sky-300 bg-sky-50/50 dark:bg-sky-950/20 dark:border-sky-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-sky-800 dark:text-sky-300">
                🟡 Olası Tercih
              </span>
              <span className="text-xs font-mono font-bold text-sky-700">
                -{possible_lower_margin} ≤ Fark &lt; +{safe_margin}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Puanınız ilin taban puanına çok yakındır. Kontenjanların korunması veya hafif artması durumunda atanma şansınız güçlüdür.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-amber-800 dark:text-amber-300">
                🟠 Riskli Tercih
              </span>
              <span className="text-xs font-mono font-bold text-amber-700">
                -{risky_lower_margin} ≤ Fark &lt; -{possible_lower_margin}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Puanınız ilin taban puanının 0.85 ile 2.20 puan gerisindedir. Yalnızca ilgili ilde kontenjanın hissedilir derecede artması durumunda yerleşme ihtimali doğar; listenin tamamının bu illerden kurulması risklidir.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-rose-800 dark:text-rose-300">
                🔴 Düşük İhtimal
              </span>
              <span className="text-xs font-mono font-bold text-rose-700">
                Fark &lt; -{risky_lower_margin} Puan
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Puanınız il taban puanının belirgin şekilde altındadır. Tercih listenizin ilk 1-2 sırasında sürpriz ve istek tercihi olarak yazılabilir ancak açıkta kalmamak için arkasından mutlaka Güvenli iller yazılmalıdır.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Senaryo Simülasyonu */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          Senaryo Simülasyonunun Matematiksel Arka Planı
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
          <p>
            Yeni bir atama döneminde iki temel makro faktör taban puanları doğrudan etkiler:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>
              <strong>Kontenjan Değişimi (%):</strong> Her %10'luk kontenjan artışı, aday havuzunun daha derinine inilmesini sağladığı için taban puanları yaklaşık ~0.25 puan aşağı çeker. Kontenjan daralmasında ise tam tersi etkiyle taban puanlar yükselir.
            </li>
            <li>
              <strong>Rekabet Katsayısı (x):</strong> Yeni mezun sayısı ve yüksek puanlı aday yığılması arttığında katsayı 1.05x - 1.10x düzeyine çıkar ve taban puanları yukarı iter.
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Sıkça Sorulan Sorular (SSS)
        </h2>
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Puanım 'Güvenli' olan bir ile kesin yerleşir miyim?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Hayır. Hiçbir tercih robotu veya tahmin algoritması %100 garanti veremez. O ildeki kontenjanın iptal edilmesi, beklenmedik aday tercihi kaymaları taban puanı değiştirebilir. Ancak geçmiş yıllara göre şansınız en üst düzeydedir.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Girdiğim KPSS puanı veya hazırladığım liste kaydediliyor mu?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Sitemizde kullanıcı hesabı veya sunucu veritabanı bulunmaz. Tüm veriler yalnızca kullandığınız telefon veya bilgisayarın tarayıcı önbelleğinde (localStorage) saklanır. Üçüncü şahıslar veya sunucu göremez.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              Başka bir branş (Ebe, Diyetisyen vb.) ne zaman eklenecek?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Veri tabanımızda tüm sağlık kadroları ayrıştırılmış olarak mevcuttur. İlk sürüm Hemşire (Lisans) hedefli optimize edilmiş olup, yapılandırma dosyamız modülerdir. Çok yakında diğer unvanlar da aktif edilecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
