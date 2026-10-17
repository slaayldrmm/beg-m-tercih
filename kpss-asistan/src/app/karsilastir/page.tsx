'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScaleIcon, MapPinIcon, CheckCircleIcon, ArrowRightIcon } from '@/components/icons';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import provincesSummaryRaw from '@/data/provinces_summary.json';
import { ProvinceSummary, CityComparisonNote } from '@/types';

export default function CompareCitiesPage() {
  const provinces = provincesSummaryRaw as unknown as ProvinceSummary[];
  
  const [city1, setCity1] = useState<string>('ADANA');
  const [city2, setCity2] = useState<string>('İZMİR');
  const [city3, setCity3] = useState<string>(''); // optional 3rd city
  const [userScore, setUserScore] = useState<number>(78.5);

  // User personalized notes per city
  const [notes, setNotes] = useState<Record<string, CityComparisonNote>>({});

  useEffect(() => {
    // Load score
    const savedScore = localStorage.getItem('kpss_user_score');
    if (savedScore) {
      const p = parseFloat(savedScore);
      if (!isNaN(p)) setUserScore(p);
    }

    // Load comparison notes
    const savedNotes = localStorage.getItem('kpss_city_comparison_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {}
    }
  }, []);

  const handleNoteChange = (cityName: string, field: keyof CityComparisonNote, value: string) => {
    const current = notes[cityName] || {
      il: cityName,
      kiraTahmini: '',
      nobetYogunlugu: '',
      yakinlikNotu: '',
      ozelNotlar: ''
    };

    const updated = {
      ...notes,
      [cityName]: {
        ...current,
        [field]: value
      }
    };

    setNotes(updated);
    localStorage.setItem('kpss_city_comparison_notes', JSON.stringify(updated));
  };

  const selectedCityNames = [city1, city2, city3].filter(Boolean);
  const selectedProvinces = selectedCityNames.map(name => provinces.find(p => p.il === name)).filter(Boolean) as ProvinceSummary[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
          <ScaleIcon className="w-4 h-4" />
          Karar Destek Sistemi
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Şehir Karşılaştırma Modülü
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Arasında kaldığınız illeri seçerek resmi taban puanları kıyaslayın. Kira, nöbet yoğunluğu ve ulaşım gibi kişisel bilgileri kendiniz not alarak kararınızı kolaylaştırın. (Sistem asla uydurma veri göstermez).
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4">
          Karşılaştırılacak İlleri Seçiniz
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              1. Şehir:
            </label>
            <select
              value={city1}
              onChange={(e) => setCity1(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500"
            >
              {provinces.map(p => (
                <option key={p.il} value={p.il}>{p.il}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              2. Şehir:
            </label>
            <select
              value={city2}
              onChange={(e) => setCity2(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500"
            >
              {provinces.map(p => (
                <option key={p.il} value={p.il}>{p.il}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              3. Şehir (İsteğe Bağlı):
            </label>
            <select
              value={city3}
              onChange={(e) => setCity3(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="">-- Şehir Seçilmedi --</option>
              {provinces.map(p => (
                <option key={p.il} value={p.il}>{p.il}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedProvinces.map((prov) => {
          const userNotes = notes[prov.il] || {
            il: prov.il,
            kiraTahmini: '',
            nobetYogunlugu: '',
            yakinlikNotu: '',
            ozelNotlar: ''
          };

          const diff = userScore - prov.latest_min_score;

          return (
            <div
              key={prov.il}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              {/* City Title */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPinIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    {prov.il}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    diff >= 1.25 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    diff >= -0.85 ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                    diff >= -2.20 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {diff >= 1.25 ? 'Güvenli' : diff >= -0.85 ? 'Olası' : diff >= -2.20 ? 'Riskli' : 'Düşük'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Son 3 Dönem Toplam Kontenjan: <strong>{prov.total_quota} kişi</strong>
                </div>
              </div>

              {/* Official Score Metrics */}
              <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Son Taban Puan:</span>
                  <strong className="font-mono text-teal-600 dark:text-teal-400 text-sm">
                    {prov.latest_min_score.toFixed(2)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Puan Farkınız:</span>
                  <strong className={`font-mono ${diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">En Düşük Kapatan Dönem:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    {prov.overall_min_score.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* User Editable Fields (No fake data!) */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Kişisel Değerlendirmeniz</span>
                  <span className="text-[10px] text-teal-600 font-normal">Otomatik Kaydedilir</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Kira & Yaşam Maliyeti Notu:
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 15.000 TL civarı, hastaneye yakın..."
                    value={userNotes.kiraTahmini}
                    onChange={(e) => handleNoteChange(prov.il, 'kiraTahmini', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Nöbet & İş Yoğunluğu Notu:
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Acil servis yoğun, TSM rahat..."
                    value={userNotes.nobetYogunlugu}
                    onChange={(e) => handleNoteChange(prov.il, 'nobetYogunlugu', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Memlekete / Aileye Yakınlık (Ulaşım):
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Hızlı tren var, 2 saat..."
                    value={userNotes.yakinlikNotu}
                    onChange={(e) => handleNoteChange(prov.il, 'yakinlikNotu', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Genel Değerlendirme & Artı / Eksi:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Kişisel tercih notlarınız..."
                    value={userNotes.ozelNotlar}
                    onChange={(e) => handleNoteChange(prov.il, 'ozelNotlar', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}
