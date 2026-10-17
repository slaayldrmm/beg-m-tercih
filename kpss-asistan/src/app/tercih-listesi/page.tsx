'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ListOrderedIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  TrashIcon, 
  PrinterIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon,
  MapPinIcon,
  InfoIcon
} from '@/components/icons';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { analyzePreferenceBalance } from '@/lib/prediction';
import { PreferenceItem } from '@/types';

export default function PreferenceListPage() {
  const [items, setItems] = useState<PreferenceItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateScore, setCandidateScore] = useState<string>('');
  const [printDate, setPrintDate] = useState<string>('');

  useEffect(() => {
    setPrintDate(new Date().toLocaleDateString('tr-TR'));
    // Load preference list
    const stored = localStorage.getItem('kpss_preference_list');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch (e) {}
    }

    // Load score
    const savedScore = localStorage.getItem('kpss_user_score');
    if (savedScore) setCandidateScore(savedScore);
  }, []);

  const saveItems = (newItems: PreferenceItem[]) => {
    const reordered = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));
    setItems(reordered);
    localStorage.setItem('kpss_preference_list', JSON.stringify(reordered));
    window.dispatchEvent(new Event('preference_updated'));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    saveItems(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    saveItems(updated);
  };

  const clearAll = () => {
    if (confirm('Tüm tercih listenizi temizlemek istediğinize emin misiniz?')) {
      saveItems([]);
    }
  };

  const updateNotes = (id: string, notes: string) => {
    const updated = items.map(item => item.id === id ? { ...item, notes } : item);
    saveItems(updated);
  };

  // Drag and drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return;

    const updated = [...items];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(idx, 0, draggedItem);
    setDraggedIndex(idx);
    saveItems(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Balance analysis
  const balance = analyzePreferenceBalance(items);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            ÖSYM 30 Tercih Kuralına Uygun
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ListOrderedIcon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            Tercih Listesi Hazırlayıcı
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            İlleri sürükleyerek veya oklarla taşıyarak sıralayın. Akıllı denge analizi listenizin risk durumunu anlık denetler.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>Yazdır / PDF İndir</span>
              </button>

              <button
                onClick={clearAll}
                className="p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                title="Tümünü Temizle"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}

          <Link
            href="/nereye-yerlesirim"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors flex items-center gap-1"
          >
            <span>+ İl Ekle</span>
          </Link>
        </div>
      </div>

      {/* Print-Only Official Header */}
      <div className="hidden print:block pb-6 border-b border-slate-300 text-left">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-black uppercase">
              KPSS Sağlık Bakanlığı Sözleşmeli Personel Tercih Listesi Taslağı
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Hemşire (Lisans) Düzeyi | Tarih: {printDate || 'Güncel'}
            </p>
          </div>
          <div className="text-right text-xs">
            <div>KPSS Puanı: <strong>{candidateScore || 'Belirtilmedi'}</strong></div>
            <div>Toplam Tercih: <strong>{items.length} / 30</strong></div>
          </div>
        </div>
      </div>

      {/* Smart Balance Analyzer Box (Aşama 4 Kuralı) */}
      {items.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Akıllı Danışman: Liste Denge Analizi
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                balance.status === 'balanced' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : balance.status === 'high_risk' 
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                Denge Skoru: %{balance.score}
              </span>
            </div>

            <span className="text-xs font-bold text-slate-500">
              {items.length} / 30 Tercih
            </span>
          </div>

          {/* Visual Distribution Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
            <div 
              style={{ width: `${(balance.counts.safe / items.length) * 100}%` }} 
              className="bg-emerald-500 h-full transition-all" 
              title={`Güvenli: ${balance.counts.safe}`} 
            />
            <div 
              style={{ width: `${(balance.counts.possible / items.length) * 100}%` }} 
              className="bg-sky-500 h-full transition-all" 
              title={`Olası: ${balance.counts.possible}`} 
            />
            <div 
              style={{ width: `${(balance.counts.risky / items.length) * 100}%` }} 
              className="bg-amber-500 h-full transition-all" 
              title={`Riskli: ${balance.counts.risky}`} 
            />
            <div 
              style={{ width: `${(balance.counts.unlikely / items.length) * 100}%` }} 
              className="bg-rose-500 h-full transition-all" 
              title={`Düşük: ${balance.counts.unlikely}`} 
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Güvenli: {balance.counts.safe}
              </span>
              <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-500" /> Olası: {balance.counts.possible}
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Riskli: {balance.counts.risky}
              </span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Düşük: {balance.counts.unlikely}
              </span>
            </div>
            
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium max-w-md">
              {balance.message}
            </p>
          </div>
        </div>
      )}

      {/* Preferences List Items */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto">
            <ListOrderedIcon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Tercih Listeniz Henüz Boş
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            "Nereye Yerleşirim?" sayfasına giderek puanınıza uygun illeri tek tıkla tercih listenize ekleyebilirsiniz.
          </p>
          <Link
            href="/nereye-yerlesirim"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors"
          >
            <MapPinIcon className="w-4 h-4" />
            İlleri İncele ve Tercih Ekle
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const slug = item.il.toLowerCase()
              .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
              .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
              .replace(/İ/g, 'i');

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  draggedIndex === index ? 'opacity-40 scale-95 border-teal-500' : 'hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Left: Order and Title */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 shrink-0 cursor-grab active:cursor-grabbing">
                    {item.order}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/il/${slug}`}
                        className="font-bold text-base text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        {item.il}
                      </Link>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${item.badgeColor}`}>
                        {item.categoryTitle}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Son Taban Puanı: <strong className="font-mono text-slate-700 dark:text-slate-300">{item.lastMinScore.toFixed(2)}</strong> | Toplam Alım: {item.totalQuota || '-'}
                    </div>
                  </div>
                </div>

                {/* Center: Quick Note Field */}
                <div className="flex-1 max-w-xs sm:mx-4 print:hidden">
                  <input
                    type="text"
                    placeholder="Kişisel notunuz (Örn: Lojman var, yakın)..."
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                {/* Print view note */}
                {item.notes && (
                  <div className="hidden print:block text-xs italic text-slate-600">
                    Not: {item.notes}
                  </div>
                )}

                {/* Right: Reorder & Delete Actions */}
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto print:hidden">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Yukarı Taşı"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Aşağı Taşı"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors ml-1"
                    title="Listeden Çıkar"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="pt-4">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
