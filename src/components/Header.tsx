import React from 'react';
import { Sun, Download, Globe, MapPin, Calendar, LayoutDashboard, Sliders } from 'lucide-react';
import { PROVINCES_DATA, SEASONS_LIST } from '../data/provincesData';
import { SeasonKey, ViewMode, LangMode } from '../types/solar';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedProvinceEn: string;
  onProvinceChange: (nameEn: string) => void;
  selectedSeason: SeasonKey;
  onSeasonChange: (season: SeasonKey) => void;
  lang: LangMode;
  onLangToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  selectedProvinceEn,
  onProvinceChange,
  selectedSeason,
  onSeasonChange,
  lang,
  onLangToggle,
}) => {
  const currentProvince = PROVINCES_DATA.find((p) => p.nameEn === selectedProvinceEn) || PROVINCES_DATA[0];

  const handleDownloadCsv = () => {
    const link = document.createElement('a');
    link.href = '/data/iran_solar_simulation.csv';
    link.download = 'iran_31_provinces_solar_simulation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentProvince, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `${currentProvince.nameEn.toLowerCase()}_solar_simulation.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="bg-white border-b border-[#d1d9e6] sticky top-0 z-50 shadow-sm">
      {/* Top Banner Bar */}
      <div className="bg-[#1a2b3c] text-white px-4 py-1.5 text-xs flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">
            {lang === 'fa' 
              ? 'پایگاه داده جامع هواشناسی و تابش ۳۱ استان کشور | الگوریتم ردیاب دو محوره' 
              : 'Iran 31 Provinces Meteorological & Solar Radiation Database | Dual-Axis Algorithm'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onLangToggle}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-semibold">{lang === 'fa' ? 'English (EN)' : 'فارسی (FA)'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[6px] bg-[#0056b3] text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Sun className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1a2b3c] tracking-tight">
                {lang === 'fa' 
                  ? 'سامانه پایش ردیاب خورشیدی و ریزشبکه استان‌های ایران' 
                  : 'Iran Solar Tracker & Microgrid Simulator'}
              </h1>
              <p className="text-xs text-[#627d98]">
                {lang === 'fa' 
                  ? 'شبیه‌سازی دینامیک ردیاب دو محوره، تخمین POA و بالانس توان ذخیره‌ساز' 
                  : 'Dual-Axis Tracking Rig Dynamics, POA Radiation & Battery Dispatch'}
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher Tabs (Index vs Details) */}
            <div className="bg-[#f0f4f8] p-1 rounded-[6px] border border-[#bcccdc] flex items-center">
              <button
                type="button"
                onClick={() => onViewChange('index')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[4px] transition-all ${
                  currentView === 'index'
                    ? 'bg-[#0056b3] text-white shadow-sm'
                    : 'text-[#334e68] hover:text-[#1a2b3c]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'نمای کلی استان‌ها (Index)' : 'Overview (Index)'}</span>
              </button>

              <button
                type="button"
                onClick={() => onViewChange('details')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[4px] transition-all ${
                  currentView === 'details'
                    ? 'bg-[#0056b3] text-white shadow-sm'
                    : 'text-[#334e68] hover:text-[#1a2b3c]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'شبیه‌ساز و جزئیات (Details)' : 'Details Simulator'}</span>
              </button>
            </div>

            {/* Province Selector */}
            <div className="flex items-center gap-1 bg-white border border-[#bcccdc] rounded-[6px] px-2.5 py-1">
              <MapPin className="w-3.5 h-3.5 text-[#0056b3]" />
              <select
                value={selectedProvinceEn}
                onChange={(e) => onProvinceChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#1a2b3c] focus:outline-none cursor-pointer py-1"
              >
                {PROVINCES_DATA.map((p) => (
                  <option key={p.nameEn} value={p.nameEn}>
                    {lang === 'fa' ? `${p.nameFa} (${p.capitalFa})` : `${p.nameEn} (${p.capitalEn})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Season Selector */}
            <div className="flex items-center gap-1 bg-white border border-[#bcccdc] rounded-[6px] px-2.5 py-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <select
                value={selectedSeason}
                onChange={(e) => onSeasonChange(e.target.value as SeasonKey)}
                className="bg-transparent text-xs font-medium text-[#1a2b3c] focus:outline-none cursor-pointer py-1"
              >
                {SEASONS_LIST.map((s) => (
                  <option key={s.id} value={s.id}>
                    {lang === 'fa' ? `${s.nameFa} (${s.dateFa})` : `${s.nameEn}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Download Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="flex items-center gap-1 px-2.5 py-2 border border-[#bcccdc] rounded-[4px] text-xs text-[#243b53] hover:bg-[#f0f4f8] transition-colors"
                title={lang === 'fa' ? 'دانلود فایل CSV کل داده‌های ۳۱ استان' : 'Download Full 31-Province CSV Dataset'}
              >
                <Download className="w-3.5 h-3.5 text-[#0056b3]" />
                <span className="font-medium hidden sm:inline">CSV</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex items-center gap-1 px-2.5 py-2 border border-[#bcccdc] rounded-[4px] text-xs text-[#243b53] hover:bg-[#f0f4f8] transition-colors"
                title={lang === 'fa' ? 'دانلود فایل JSON این استان' : 'Download Province JSON'}
              >
                <span className="font-medium font-mono text-[11px] text-[#0056b3]">{'{ }'}</span>
                <span className="font-medium hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
