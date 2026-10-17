'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  StethoscopeIcon, 
  MapPinIcon, 
  ListOrderedIcon, 
  CalendarIcon, 
  InfoIcon, 
  ScaleIcon, 
  MoonIcon, 
  SunIcon 
} from './icons';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [prefCount, setPrefCount] = useState(0);

  useEffect(() => {
    // Check initial theme
    const savedTheme = localStorage.getItem('kpss_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Load preference count
    const updatePrefCount = () => {
      try {
        const stored = localStorage.getItem('kpss_preference_list');
        if (stored) {
          const list = JSON.parse(stored);
          setPrefCount(Array.isArray(list) ? list.length : 0);
        } else {
          setPrefCount(0);
        }
      } catch (e) {
        setPrefCount(0);
      }
    };

    updatePrefCount();
    window.addEventListener('storage', updatePrefCount);
    window.addEventListener('preference_updated', updatePrefCount);
    return () => {
      window.removeEventListener('storage', updatePrefCount);
      window.removeEventListener('preference_updated', updatePrefCount);
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kpss_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kpss_theme', 'dark');
      setIsDark(true);
    }
  };

  const navLinks = [
    { href: '/', label: 'Puan Girişi', icon: StethoscopeIcon },
    { href: '/nereye-yerlesirim', label: 'Nereye Yerleşirim?', icon: MapPinIcon },
    { 
      href: '/tercih-listesi', 
      label: 'Tercih Listem', 
      icon: ListOrderedIcon,
      badge: prefCount > 0 ? prefCount : undefined 
    },
    { href: '/karsilastir', label: 'Şehir Kıyasla', icon: ScaleIcon },
    { href: '/takvim-ve-evraklar', label: 'Takvim & Evrak', icon: CalendarIcon },
    { href: '/yontem', label: 'Yöntem & Kaynak', icon: InfoIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-teal-900/10 dark:border-teal-400/10 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <StethoscopeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                KPSS Sağlık Asistanı
              </div>
              <div className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Hemşire (Lisans) Yerleştirme
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Dark Mode Toggle & Mobile Menu button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Karanlık Mod Değiştir"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Menüyü Aç"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-teal-600 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
