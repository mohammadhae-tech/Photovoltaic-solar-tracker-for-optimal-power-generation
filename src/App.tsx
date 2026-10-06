import React, { useState, useEffect } from 'react';
import { PROVINCES_DATA } from './data/provincesData';
import { SeasonKey, ViewMode, LangMode } from './types/solar';
import { Header } from './components/Header';
import { IndexView } from './components/IndexView';
import { DetailsView } from './components/DetailsView';
import { GitBranch, ShieldCheck, Sun, Layers, Cpu, FileCode2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('index');
  const [selectedProvinceEn, setSelectedProvinceEn] = useState<string>('Tehran');
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>('spring');
  const [lang, setLang] = useState<LangMode>('fa');

  // Handle URL hash navigation for #index and #details
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'details') {
        setCurrentView('details');
      } else if (hash === 'index') {
        setCurrentView('index');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProvinceFromGrid = (nameEn: string) => {
    setSelectedProvinceEn(nameEn);
    setCurrentView('details');
    window.location.hash = 'details';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentProvince = PROVINCES_DATA.find((p) => p.nameEn === selectedProvinceEn) || PROVINCES_DATA[0];

  return (
    <div className={`min-h-screen flex flex-col bg-[#f0f4f8] text-[#1a2b3c] ${lang === 'fa' ? 'font-sans' : 'font-sans'}`} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        selectedProvinceEn={selectedProvinceEn}
        onProvinceChange={setSelectedProvinceEn}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        lang={lang}
        onLangToggle={() => setLang(lang === 'fa' ? 'en' : 'fa')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {currentView === 'index' ? (
          <IndexView
            provinces={PROVINCES_DATA}
            selectedSeason={selectedSeason}
            onSelectProvince={handleSelectProvinceFromGrid}
            lang={lang}
          />
        ) : (
          <DetailsView
            province={currentProvince}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            onBackToOverview={() => handleViewChange('index')}
            lang={lang}
          />
        )}
      </main>

      {/* Footer with git status & system details */}
      <footer className="bg-[#1a2b3c] text-white border-t border-slate-700 mt-12 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-700/60 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#0056b3] flex items-center justify-center text-white font-bold">
                <Sun className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <span className="font-bold text-sm block">
                  {lang === 'fa' ? 'سامانه شبیه‌ساز ردیاب خورشیدی دو محوره و ریزشبکه ایران' : 'Iran Dual-Axis Solar Tracker & Microgrid Simulator'}
                </span>
                <span className="text-slate-400 text-xs">
                  {lang === 'fa' ? 'مبتنی بر شبیه‌سازی ۲,۹۷۶ نقطه داده در ۳۱ استان کشور' : 'Comprehensive 2,976 Hourly Simulation Points across 31 Provinces'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-slate-300">
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                <span>Git Ready | Branch: main</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-slate-300">
                <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
                <span>index.html & details.html Modified</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <span>
              {lang === 'fa'
                ? 'طراحی و توسعه یافته بر اساس تم آبی رسمی (Corporate Blue) با محاسبات فیزیکی دقیق تابش خورشیدی'
                : 'Designed with Corporate Blue Theme, high-precision solar geometry, and dual-axis tracking mechanics.'}
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleViewChange('index')}
                className="hover:text-white transition-colors underline"
              >
                {lang === 'fa' ? 'نمای کلی (Index)' : 'Overview (Index)'}
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('details')}
                className="hover:text-white transition-colors underline"
              >
                {lang === 'fa' ? 'شبیه‌ساز تفصیلی (Details)' : 'Details Simulator'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
