'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { TurkeyMap } from '@/components/TurkeyMap';
import { DisclaimerBanner, SourceDocBadge } from '@/components/DisclaimerBanner';
import { 
  SearchIcon, 
  SlidersIcon, 
  MapPinIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CheckCircleIcon,
  ListOrderedIcon,
  InfoIcon
} from '@/components/icons';
import { predictAllProvinces } from '@/lib/prediction';
import { ProvinceSummary, PredictionResult, RiskCategory } from '@/types';
import provincesSummaryRaw from '@/data/provinces_summary.json';
import { REGIONS_LIST } from '@/data/turkey_regions';

export default function PlacementExplorerPage() {
  const [userScore, setUserScore] = useState<number>(78.50);
  const [scoreInput, setScoreInput] = useState<string>('78.50');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('Tümü');
  const [simulationOpen, setSimulationOpen] = useState<boolean>(false);
  const [quotaShiftPercent, setQuotaShiftPercent] = useState<number>(0);
  const [competitionMultiplier, setCompetitionMultiplier] = useState<number>(1.0);
  const [addedProvinces, setAddedProvinces] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const provinces = provincesSummaryRaw as unknown as ProvinceSummary[];

  useEffect(() => {
    // Load stored score
    const saved = localStorage.getItem('kpss_user_score');
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed > 0) {
        setUserScore(parsed);
        setScoreInput(saved);
      }
    }

    // Load saved preferences to highlight added ones
    const updateAddedList = () => {
      try {
        const storedList = localStorage.getItem('kpss_preference_list');
        if (storedList) {
          const arr = JSON.parse(storedList);
          setAddedProvinces(arr.map((item: any) => item.il));
        }
      } catch (e) {}
    };
    updateAddedList();
    window.addEventListener('storage', updateAddedList);
    window.addEventListener('preference_updated', updateAddedList);
    return () => {
      window.removeEventListener('storage', updateAddedList);
      window.removeEventListener('preference_updated', updateAddedList);
    };
  }, []);

  const handleScoreChange = (val: string) => {
    setScoreInput(val);
    const parsed = parseFloat(val.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 50 && parsed <= 100) {
      setUserScore(parsed);
      localStorage.setItem('kpss_user_score', parsed.toString());
    }
  };

  // Run prediction engine with simulation parameters
  const predictionsList = useMemo(() => {
    return predictAllProvinces(userScore, provinces, {
      quotaChangePercent: quotaShiftPercent,
      competitionMultiplier
    });
  }, [userScore, provinces, quotaShiftPercent, competitionMultiplier]);

  // Map keyed by province name
  const predictionsMap = useMemo(() => {
    const map: Record<string, PredictionResult> = {};
    predictionsList.forEach((p) => {
      map[p.il] = p;
    });
    return map;
  }, [predictionsList]);

  // Filtered list
  const filteredList = useMemo(() => {
    return predictionsList.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!p.il.toLowerCase().includes(q)) return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [predictionsList, searchQuery, selectedCategory]);

  // Counts
  const counts = useMemo(() => {
    return {
      total: predictionsList.length,
      safe: predictionsList.filter(p => p.category === 'safe').length,
      possible: predictionsList.filter(p => p.category === 'possible').length,
      risky: predictionsList.filter(p => p.category === 'risky').length,
      unlikely: predictionsList.filter(p => p.category === 'unlikely').length,
    };
  }, [predictionsList]);

  // Add to preference list
  const handleAddToPreferences = (pred: PredictionResult) => {
    try {
      const stored = localStorage.getItem('kpss_preference_list');
      const list = stored ? JSON.parse(stored) : [];

      if (list.some((item: any) => item.il === pred.il)) {
        // Remove if already exists
        const updated = list.filter((item: any) => item.il !== pred.il);
        localStorage.setItem('kpss_preference_list', JSON.stringify(updated));
        setAddedProvinces(updated.map((item: any) => item.il));
        window.dispatchEvent(new Event('preference_updated'));
        showToast(`${pred.il} tercih listenizden çıkarıldı.`);
        return;
      }

      if (list.length >= 30) {
        alert('ÖSYM kılavuzuna göre en fazla 30 tercih yapabilirsiniz.');
        return;
      }

      const newItem = {
        id: `pref_${Date.now()}_${Math.random()}`,
        order: list.length + 1,
        il: pred.il,
        lastMinScore: pred.targetScore,
        category: pred.category,
        categoryTitle: pred.categoryTitle,
        badgeColor: pred.categoryBadgeColor,
        totalQuota: pred.totalQuota,
        addedAt: new Date().toISOString()
      };

      const updated = [...list, newItem];
      localStorage.setItem('kpss_preference_list', JSON.stringify(updated));
      setAddedProvinces(updated.map((item: any) => item.il));
      window.dispatchEvent(new Event('preference_updated'));
      showToast(`${pred.il} tercih listenize eklendi (${list.length + 1}. sıra).`);
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-teal-500/40 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircleIcon className="w-5 h-5 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card: Score Input + Simulation Toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            Hemşire (Lisans) Yerleştirme Tahmini
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Nereye Yerleşebilirim?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Girdiğiniz KPSS puanı il bazındaki geçmiş yerleştirme taban puanlarıyla kıyaslanır.
          </p>
        </div>

        {/* Score & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700">
            <span className="text-xs font-bold px-2 text-slate-600 dark:text-slate-300">
              Puanınız:
            </span>
            <input
              type="text"
              value={scoreInput}
              onChange={(e) => handleScoreChange(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-xl font-black text-center text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
            />
          </div>

          <button
            onClick={() => setSimulationOpen(!simulationOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
              simulationOpen || quotaShiftPercent !== 0 || competitionMultiplier !== 1.0
                ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <SlidersIcon className="w-4 h-4" />
            <span>Senaryo Simülasyonu</span>
            {(quotaShiftPercent !== 0 || competitionMultiplier !== 1.0) && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tablo
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Harita
            </button>
          </div>
        </div>
      </div>

      {/* Simulation Drawer (Aşama 3 - Senaryo Simülasyonu) */}
      {simulationOpen && (
        <div className="bg-gradient-to-r from-teal-500/10 via-slate-50 to-cyan-500/10 dark:from-teal-950/40 dark:via-slate-900 dark:to-cyan-950/40 rounded-3xl p-6 border border-teal-500/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Senaryo Simülasyonu: Kontenjan & Rekabet Tahmini
              </h3>
            </div>
            {(quotaShiftPercent !== 0 || competitionMultiplier !== 1.0) && (
              <button
                onClick={() => {
                  setQuotaShiftPercent(0);
                  setCompetitionMultiplier(1.0);
                }}
                className="text-xs text-rose-500 font-semibold hover:underline"
              >
                Sıfırla
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sağlık Bakanlığı'nın yeni alımında kontenjan artarsa taban puanlar düşme; mezun yığılması ve rekabet artarsa puanlar yükselme eğilimi gösterir. Kaydırıcıları ayarlayarak sonuçların nasıl değişeceğini simüle edin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">
                  Beklenen Kontenjan Değişimi:
                </span>
                <span className={`px-2 py-0.5 rounded ${
                  quotaShiftPercent > 0 ? 'bg-emerald-100 text-emerald-800' : quotaShiftPercent < 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {quotaShiftPercent > 0 ? `+${quotaShiftPercent}% Kontenjan` : quotaShiftPercent < 0 ? `${quotaShiftPercent}% Kontenjan` : 'Aynı (Geçmiş Yıl)'}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={quotaShiftPercent}
                onChange={(e) => setQuotaShiftPercent(parseInt(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-%30 (Daralma)</span>
                <span>0 (Normal)</span>
                <span>+%30 (Büyük Alım)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">
                  Aday Yoğunluğu & Rekabet Katsayısı:
                </span>
                <span className={`px-2 py-0.5 rounded ${
                  competitionMultiplier > 1 ? 'bg-amber-100 text-amber-800' : competitionMultiplier < 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {competitionMultiplier}x {competitionMultiplier > 1 ? '(Yüksek Yığılma)' : competitionMultiplier < 1 ? '(Düşük Yığılma)' : '(Normal)'}
                </span>
              </div>
              <input
                type="range"
                min="0.9"
                max="1.1"
                step="0.05"
                value={competitionMultiplier}
                onChange={(e) => setCompetitionMultiplier(parseFloat(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.9x (Düşük Rekabet)</span>
                <span>1.0x (Varsayılan)</span>
                <span>1.1x (Yüksek Rekabet)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'safe' ? 'all' : 'safe')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'safe'
              ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Güvenli İller
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {counts.safe} <span className="text-xs font-normal text-slate-400">il</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Puanınız tabanın +1.25 üstünde
          </div>
        </button>

        <button
          onClick={() => setSelectedCategory(selectedCategory === 'possible' ? 'all' : 'possible')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'possible'
              ? 'ring-2 ring-sky-500 bg-sky-50 dark:bg-sky-950/50 border-sky-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              Olası İller
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {counts.possible} <span className="text-xs font-normal text-slate-400">il</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Puanınız tabana yakın (-0.85 aralığı)
          </div>
        </button>

        <button
          onClick={() => setSelectedCategory(selectedCategory === 'risky' ? 'all' : 'risky')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'risky'
              ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Riskli İller
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {counts.risky} <span className="text-xs font-normal text-slate-400">il</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Tabanın 0.85-2.20 puan altındasınız
          </div>
        </button>

        <button
          onClick={() => setSelectedCategory(selectedCategory === 'unlikely' ? 'all' : 'unlikely')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedCategory === 'unlikely'
              ? 'ring-2 ring-rose-500 bg-rose-50 dark:bg-rose-950/50 border-rose-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Düşük İhtimal
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {counts.unlikely} <span className="text-xs font-normal text-slate-400">il</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Puanınız tabandan belirgin düşük
          </div>
        </button>
      </div>

      {/* Main Content: Map or Table */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Bölge Filtresi:
            </span>
            {REGIONS_LIST.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          <TurkeyMap
            predictions={predictionsMap}
            selectedRegion={selectedRegion}
          />
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="İl adına göre ara (Örn: Adana, İzmir)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Gösterilen: <strong>{filteredList.length}</strong> / {predictionsList.length} İl
              </span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  Filtreyi Temizle
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">İl Adı</th>
                  <th className="py-3 px-4">Son Taban Puan</th>
                  <th className="py-3 px-4">Puan Farkınız</th>
                  <th className="py-3 px-4">Trend</th>
                  <th className="py-3 px-4">Toplam Kontenjan</th>
                  <th className="py-3 px-4">Yerleşme Durumu</th>
                  <th className="py-3 px-4 sm:px-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                {filteredList.map((item) => {
                  const isAdded = addedProvinces.includes(item.il);
                  const slug = item.il.toLowerCase()
                    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
                    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                    .replace(/İ/g, 'i');

                  return (
                    <tr
                      key={item.il}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                        <Link
                          href={`/il/${slug}`}
                          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5"
                        >
                          <MapPinIcon className="w-4 h-4 text-slate-400" />
                          <span>{item.il}</span>
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-200">
                        {item.targetScore.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={item.scoreDifference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {item.scoreDifference >= 0 ? `+${item.scoreDifference.toFixed(2)}` : item.scoreDifference.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.scoreTrend === 'up' ? (
                          <span className="inline-flex items-center text-rose-500 font-semibold text-[11px]" title="Taban puan son dönemlerde yükseldi">
                            <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5" /> Yükselen
                          </span>
                        ) : item.scoreTrend === 'down' ? (
                          <span className="inline-flex items-center text-emerald-500 font-semibold text-[11px]" title="Taban puan son dönemlerde düştü">
                            <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5" /> Düşen
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Dengeli</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <strong>{item.totalQuota}</strong> kişi
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${item.categoryBadgeColor}`}>
                          {item.categoryTitle}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right space-x-2">
                        <button
                          onClick={() => handleAddToPreferences(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-700'
                              : 'bg-slate-100 hover:bg-teal-600 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isAdded ? '✓ Listede' : '+ Listeye Ekle'}
                        </button>

                        <Link
                          href={`/il/${slug}`}
                          className="inline-block px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          Detay &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer & Document Badge */}
      <div className="pt-4 space-y-3">
        <DisclaimerBanner />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>* Veriler ÖSYM Tercih Kılavuzu (Tablo 3) ve Yerleştirme Sonuç tutanaklarından derlenmiştir.</span>
          <div className="flex gap-2">
            <SourceDocBadge docName="ÖSYM Min-Max Lisans" year="2024-2025" />
          </div>
        </div>
      </div>
    </div>
  );
}
