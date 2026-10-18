import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TURKEY_PROVINCES_GEO } from '@/data/turkey_regions';
import { toProvinceSlug } from '@/lib/province-slug';
import provincesSummaryRaw from '@/data/provinces_summary.json';
import nurseLisansRaw from '@/data/nurse_lisans.json';
import { DisclaimerBanner, SourceDocBadge } from '@/components/DisclaimerBanner';
import { 
  MapPinIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  InfoIcon,
  CalendarIcon
} from '@/components/icons';
import { ProvinceSummary, PlacementRecord } from '@/types';
import { ProvinceDetailClient } from './ProvinceDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TURKEY_PROVINCES_GEO.map((p) => ({
    slug: toProvinceSlug(p.name),
  }));
}

export default async function ProvinceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Find geo info
  const geo = TURKEY_PROVINCES_GEO.find(p => toProvinceSlug(p.name) === slug);
  if (!geo) {
    notFound();
  }

  // Find summary
  const provinces = provincesSummaryRaw as unknown as ProvinceSummary[];
  const summary = provinces.find(p => p.il === geo.name);
  if (!summary) {
    notFound();
  }

  // Find all placement records for this province
  const allPlacements = nurseLisansRaw as unknown as PlacementRecord[];
  const provincePlacements = allPlacements.filter(p => p.il === geo.name);

  // Group placements by period
  const periodsOrder = ['2025/5', '2025/4', '2024/5'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/nereye-yerlesirim" className="hover:text-teal-600 dark:hover:text-teal-400">İller</Link>
        <span>/</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{geo.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 font-bold">
              Plaka {geo.plate}
            </span>
            <span>{geo.region} Bölgesi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MapPinIcon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            {geo.name} Hemşire (Lisans) Atama Verileri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ÖSYM'nin son 3 sözleşmeli sağlık personeli yerleştirmesindeki taban puanları, hastane bazlı kontenjanları ve özel kadro türleri.
          </p>
        </div>

        {/* Client-side Add to Preferences and Share Buttons */}
        <ProvinceDetailClient 
          provinceName={geo.name}
          latestMinScore={summary.latest_min_score}
          totalQuota={summary.total_quota}
        />
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Son Dönem Taban Puan
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 mt-1 font-mono">
            {summary.latest_min_score.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Dönem: {summary.latest_period}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            En Düşük Taban Puan
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {summary.overall_min_score.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Son 3 dönem genelinde
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            En Yüksek Taban Puan
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-200 mt-1 font-mono">
            {summary.overall_max_score.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Son 3 dönem tavan puanı
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Toplam Alınan Hemşire
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
            {summary.total_quota} <span className="text-xs font-normal text-slate-400">Kadro</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            3 yerleştirme toplamı
          </div>
        </div>
      </div>

      {/* Period Comparison Cards & Visual Charts */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Dönemler Arası Taban Puan & Kontenjan Değişimi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {geo.name} ili için ÖSYM kılavuzlarında açılan kontenjanların ve oluşan taban puanların dönemsel grafiği.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(summary.periods).map(([periodKey, pStats]) => (
            <div
              key={periodKey}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  KPSS {periodKey}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {pStats.year} Yılı
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Taban Puan (En Küçük):</span>
                  <strong className="text-teal-600 dark:text-teal-400 font-mono text-sm">
                    {pStats.min_score.toFixed(5)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tavan Puan (En Büyük):</span>
                  <strong className="text-slate-700 dark:text-slate-300 font-mono">
                    {pStats.max_score.toFixed(5)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Açılan Kontenjan:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {pStats.total_quota} kişi
                  </strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span>Genel: {pStats.general_quota}</span>
                  <span>Özel/TSM/45-A: {pStats.special_quota}</span>
                </div>
              </div>

              {/* Progress bar visual for quota */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(15, (pStats.total_quota / Math.max(...Object.values(summary.periods).map(x => x.total_quota || 1))) * 100))}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Institutions & Hospitals List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Hastane ve Kurum Bazlı Yerleştirme Sonuçları
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {geo.name} ilinde açılmış tüm hastane, toplum sağlığı merkezi ve aile hekimliği birimleri ({provincePlacements.length} kadro kaydı).
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            ÖSYM 9 Haneli Kurum Kodu ile listelenmiştir
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Dönem</th>
                <th className="py-3 px-4">ÖSYM Kodu</th>
                <th className="py-3 px-4">Kurum / Hastane Adı</th>
                <th className="py-3 px-4">Kontenjan</th>
                <th className="py-3 px-4">Taban Puan</th>
                <th className="py-3 px-4">Tavan Puan</th>
                <th className="py-3 px-4">Kontenjan Türü</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {provincePlacements.map((record) => (
                <tr key={`${record.donem}_${record.osym_kodu}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 font-bold">
                      {record.donem}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-xs">
                    {record.osym_kodu}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-sm">
                    {record.kurum_adi}
                    {record.aciklama && (
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {record.aciklama}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {record.kontenjan}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                    {record.en_kucuk_puan.toFixed(5)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {record.en_buyuk_puan.toFixed(5)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {record.kontenjan_turu}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Source citation */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>* Tablodaki taban ve tavan puanlar ÖSYM resmi tutanaklarından alınmıştır.</span>
          <div className="flex gap-2">
            <SourceDocBadge docName="ÖSYM Tercih Kılavuzu & Min-Max Lisans" year="2024-2025" />
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}
