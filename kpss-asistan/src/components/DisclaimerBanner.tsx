import React from 'react';
import { AlertTriangleIcon, InfoIcon } from './icons';

interface DisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export function DisclaimerBanner({ compact = false, className = "" }: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-3 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 rounded-lg ${className}`}>
        <AlertTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <p>
          <strong>Yasal Uyarı:</strong> Bu araç geçmiş yıl verilerine dayalı tahmin sunar, yerleşme garantisi vermez. Karar vermeden önce ÖSYM tercih kılavuzunu ve resmi duyuruları esas alın. Resmi devlet/ÖSYM sitesi değildir.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-teal-500/10 border border-amber-500/30 rounded-xl ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg shrink-0 mt-0.5">
          <AlertTriangleIcon className="w-5 h-5" />
        </div>
        <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            Önemli Bilgilendirme ve Sorumluluk Reddi Beyanı
          </p>
          <p>
            Bu araç geçmiş yıl verilerine dayalı tahmin sunar, <strong>kesin yerleşme garantisi vermez</strong>. Tercih bildiriminde bulunmadan önce mutlaka ÖSYM resmi tercih kılavuzunu ve Sağlık Bakanlığı duyurularını esas alınız.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            * Bu platform bağımsız bir açık kaynak asistanıdır. ÖSYM veya T.C. Sağlık Bakanlığı'nın resmi internet sitesi değildir. Kullanıcı verileriniz (puan, tercihler) sunucuya iletilmez, yalnızca tarayıcınızda (localStorage) saklanır.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SourceDocBadge({ docName, year }: { docName: string; year?: number | string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700">
      <InfoIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
      Resmi Kaynak: {docName} {year ? `(${year})` : ''}
    </span>
  );
}
