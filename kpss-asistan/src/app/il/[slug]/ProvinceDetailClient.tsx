'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ListOrderedIcon } from '@/components/icons';

interface Props {
  provinceName: string;
  latestMinScore: number;
  totalQuota: number;
}

export function ProvinceDetailClient({ provinceName, latestMinScore, totalQuota }: Props) {
  const [isAdded, setIsAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kpss_preference_list');
      if (stored) {
        const list = JSON.parse(stored);
        setIsAdded(list.some((item: any) => item.il === provinceName));
      }
    } catch (e) {}
  }, [provinceName]);

  const togglePreference = () => {
    try {
      const stored = localStorage.getItem('kpss_preference_list');
      const list = stored ? JSON.parse(stored) : [];

      if (isAdded) {
        const updated = list.filter((item: any) => item.il !== provinceName);
        localStorage.setItem('kpss_preference_list', JSON.stringify(updated));
        setIsAdded(false);
        window.dispatchEvent(new Event('preference_updated'));
        showToast(`${provinceName} tercih listenizden çıkarıldı.`);
      } else {
        if (list.length >= 30) {
          alert('ÖSYM kurallarına göre en fazla 30 tercih yapabilirsiniz.');
          return;
        }

        const newItem = {
          id: `pref_${Date.now()}_${Math.random()}`,
          order: list.length + 1,
          il: provinceName,
          lastMinScore: latestMinScore,
          category: 'possible',
          categoryTitle: 'Olası',
          badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
          totalQuota,
          addedAt: new Date().toISOString()
        };

        const updated = [...list, newItem];
        localStorage.setItem('kpss_preference_list', JSON.stringify(updated));
        setIsAdded(true);
        window.dispatchEvent(new Event('preference_updated'));
        showToast(`${provinceName} tercih listenize eklendi (${list.length + 1}. sıra).`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex items-center gap-3">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-teal-500/40 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircleIcon className="w-5 h-5 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <button
        onClick={togglePreference}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
          isAdded
            ? 'bg-teal-700 text-white hover:bg-teal-800'
            : 'bg-teal-600 text-white hover:bg-teal-500'
        }`}
      >
        <ListOrderedIcon className="w-4 h-4" />
        <span>{isAdded ? '✓ Tercih Listemde' : '+ Tercih Listeme Ekle'}</span>
      </button>
    </div>
  );
}
