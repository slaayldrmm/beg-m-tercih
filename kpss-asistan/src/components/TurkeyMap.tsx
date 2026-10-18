'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TURKEY_PROVINCES_GEO, ProvinceGeoInfo } from '@/data/turkey_regions';
import { toProvinceSlug } from '@/lib/province-slug';
import { PredictionResult } from '@/types';
import { MapPinIcon, ArrowRightIcon } from './icons';

interface TurkeyMapProps {
  predictions: Record<string, PredictionResult>; // keyed by province name (e.g., "ADANA")
  onSelectProvince?: (provinceName: string) => void;
  selectedRegion?: string;
}

export function TurkeyMap({ predictions, onSelectProvince, selectedRegion = 'Tümü' }: TurkeyMapProps) {
  const [hovered, setHovered] = useState<{
    geo: ProvinceGeoInfo;
    pred?: PredictionResult;
  } | null>(null);

  const getColor = (geo: ProvinceGeoInfo) => {
    const pred = predictions[geo.name];
    if (!pred) return '#94a3b8'; // slate-400
    if (pred.category === 'safe') return '#10b981'; // emerald-500
    if (pred.category === 'possible') return '#0ea5e9'; // sky-500
    if (pred.category === 'risky') return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  };

  const isDimmed = (geo: ProvinceGeoInfo) => {
    if (selectedRegion === 'Tümü') return false;
    return geo.region !== selectedRegion;
  };

  return (
    <div className="relative w-full bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 sm:p-6 overflow-hidden shadow-xl">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
            <MapPinIcon className="w-5 h-5 text-teal-400" />
            İnteraktif Türkiye Haritası & Yerleşme Durumu
          </h3>
          <p className="text-xs text-slate-400">
            İllerin üzerine gelerek taban puan ve yerleşme ihtimalinizi inceleyin; tıklayarak il detayına gidin.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs shadow-emerald-500/50" />
            <span className="text-emerald-400">Güvenli</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shadow-xs shadow-sky-500/50" />
            <span className="text-sky-400">Olası</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs shadow-amber-500/50" />
            <span className="text-amber-400">Riskli</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs shadow-rose-500/50" />
            <span className="text-rose-400">Düşük</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[2/1] min-h-[300px] max-h-[550px]">
        <svg
          viewBox="0 0 1020 500"
          className="w-full h-full select-none"
        >
          {/* Subtle stylized grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Regional Connection lines */}
          <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
            {TURKEY_PROVINCES_GEO.slice(0, 40).map((geo, i) => {
              const next = TURKEY_PROVINCES_GEO[(i + 7) % TURKEY_PROVINCES_GEO.length];
              return (
                <line
                  key={`line-${i}`}
                  x1={geo.x}
                  y1={geo.y}
                  x2={next.x}
                  y2={next.y}
                />
              );
            })}
          </g>

          {/* Province Nodes */}
          {TURKEY_PROVINCES_GEO.map((geo) => {
            const pred = predictions[geo.name];
            const color = getColor(geo);
            const dimmed = isDimmed(geo);
            const isHover = hovered?.geo.plate === geo.plate;

            return (
              <g
                key={geo.plate}
                transform={`translate(${geo.x}, ${geo.y})`}
                className={`cursor-pointer transition-all duration-200 ${dimmed ? 'opacity-20' : 'opacity-100'}`}
                onMouseEnter={() => setHovered({ geo, pred })}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectProvince?.(geo.name)}
              >
                {/* Glow circle for hovered node */}
                {isHover && (
                  <circle
                    r={22}
                    fill={color}
                    opacity={0.3}
                    className="animate-ping"
                  />
                )}

                {/* Base circle node */}
                <circle
                  r={isHover ? 13 : 9}
                  fill={color}
                  stroke="#0f172a"
                  strokeWidth={2}
                  className="transition-all duration-150 shadow-md"
                />

                {/* Plate or Short label */}
                <text
                  y={3.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isHover ? 9 : 7}
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {geo.plate}
                </text>

                {/* Province name text below */}
                <text
                  y={19}
                  textAnchor="middle"
                  fill={isHover ? '#38bdf8' : '#cbd5e1'}
                  fontSize={isHover ? 9 : 7.5}
                  fontWeight={isHover ? 'bold' : 'normal'}
                  className="pointer-events-none tracking-tight"
                >
                  {geo.name.length > 9 ? geo.name.substring(0, 8) + '..' : geo.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Popover Box */}
        {hovered && (
          <div
            className="absolute z-30 pointer-events-none transition-all duration-75 bg-slate-800/95 backdrop-blur-md border border-slate-700 text-white rounded-xl p-3 shadow-2xl max-w-xs text-xs"
            style={{
              left: `${Math.min(Math.max((hovered.geo.x / 1020) * 100, 10), 80)}%`,
              top: `${Math.min(Math.max((hovered.geo.y / 500) * 100 - 20, 5), 75)}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1 border-b border-slate-700 pb-1">
              <span className="font-bold text-sm text-teal-300">
                {hovered.geo.plate} - {hovered.geo.name}
              </span>
              <span className="text-[10px] text-slate-400">
                {hovered.geo.region}
              </span>
            </div>

            {hovered.pred ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Son Taban Puan:</span>
                  <span className="font-bold text-white">{hovered.pred.targetScore.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Puan Farkı:</span>
                  <span className={`font-semibold ${hovered.pred.scoreDifference >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {hovered.pred.scoreDifference >= 0 ? `+${hovered.pred.scoreDifference.toFixed(2)}` : hovered.pred.scoreDifference.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Durum:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hovered.pred.categoryBadgeColor}`}>
                    {hovered.pred.categoryTitle}
                  </span>
                </div>
                <div className="text-[10px] text-teal-400 pt-1 flex items-center gap-1 font-medium">
                  Tıklayarak il detayını inceleyin &rarr;
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-[11px]">
                Bu il için henüz yerleştirme verisi hesaplanamadı.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Province Quick Bar on bottom if clicked/hovered */}
      {hovered?.pred && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-teal-400 text-sm">{hovered.geo.name}</span>
            <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${hovered.pred.categoryBadgeColor}`}>
              {hovered.pred.categoryTitle}
            </span>
            <span className="text-slate-400">
              Son Taban: <strong className="text-white">{hovered.pred.targetScore.toFixed(2)}</strong> | Toplam Kontenjan: <strong className="text-white">{hovered.pred.totalQuota}</strong>
            </span>
          </div>

          <Link
            href={`/il/${toProvinceSlug(hovered.geo.name)}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-colors"
          >
            {hovered.geo.name} Detayına Git
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
