'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  CheckSquareIcon, 
  CheckCircleIcon, 
  InfoIcon, 
  AlertTriangleIcon 
} from '@/components/icons';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import calendarData from '@/config/calendar.json';
import documentsData from '@/config/documents.json';
import { DocumentItem } from '@/types';

export default function CalendarAndDocumentsPage() {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'documents' | 'calendar'>('documents');

  const documents = documentsData.documents as DocumentItem[];

  useEffect(() => {
    // Load saved checklist
    const saved = localStorage.getItem('kpss_documents_checklist');
    if (saved) {
      try {
        setCheckedDocs(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleDoc = (id: string) => {
    const updated = {
      ...checkedDocs,
      [id]: !checkedDocs[id]
    };
    setCheckedDocs(updated);
    localStorage.setItem('kpss_documents_checklist', JSON.stringify(updated));
  };

  const completedCount = documents.filter(d => checkedDocs[d.id]).length;
  const progressPercent = Math.round((completedCount / documents.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            Atama Süreci Rehberi
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            Atama Takvimi & Evrak Kontrol Listesi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Yerleştirme sürecini adım adım takip edin, hazırladığınız resmi evrakları işaretleyin.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Evrak Listesi ({completedCount}/{documents.length})
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Resmi Takvim
          </button>
        </div>
      </div>

      {/* Evrak Kontrol Listesi Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
              <span className="text-slate-800 dark:text-slate-200">
                Evrak Hazırlık Durumu
              </span>
              <span className="text-teal-600 dark:text-teal-400">
                %{progressPercent} Tamamlandı ({completedCount} / {documents.length})
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              * İşaretlemeleriniz cihazınızda (localStorage) kalıcı olarak saklanır, sayfayı yenileseniz de kaybolmaz.
            </p>
          </div>

          {/* Documents Checklist Items */}
          <div className="space-y-3">
            {documents.map((doc) => {
              const isChecked = !!checkedDocs[doc.id];
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                    isChecked
                      ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800/80 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // handled by parent div
                      className="w-5 h-5 rounded-md text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className={`text-sm font-bold ${
                        isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                      }`}>
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {doc.category}
                        </span>
                        {doc.required ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            Zorunlu
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Duruma Bağlı
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {doc.description}
                    </p>

                    {doc.tip && (
                      <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium flex items-center gap-1 pt-0.5">
                        <InfoIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>İpucu: {doc.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resmi Takvim Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Yönetilebilir Takvim
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {calendarData.active_recruitment.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {calendarData.notice}
              </p>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-teal-500/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6 pt-2">
              {calendarData.active_recruitment.events.map((ev, idx) => (
                <div key={ev.id} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-teal-600 border-4 border-white dark:border-slate-900 shadow-sm" />

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {ev.title}
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {ev.date_str}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {ev.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past periods reference card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Geçmiş Atama Dönemleri Takvimi & Arşivi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {calendarData.past_periods.map((past) => (
                <div key={past.period} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {past.period}
                  </div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                    {past.date}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    {past.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}
