import React from 'react';
import { ProvinceSolarData, SeasonKey, LangMode } from '../types/solar';
import { ProvincesOverviewGrid } from './ProvincesOverviewGrid';
import { ProvincesComparisonChart } from './ProvincesComparisonChart';
import { Sun, ShieldAlert, Cpu, Sparkles, BookOpen, Layers } from 'lucide-react';

interface IndexViewProps {
  provinces: ProvinceSolarData[];
  selectedSeason: SeasonKey;
  onSelectProvince: (nameEn: string) => void;
  lang: LangMode;
}

export const IndexView: React.FC<IndexViewProps> = ({
  provinces,
  selectedSeason,
  onSelectProvince,
  lang
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Intro Banner */}
      <div className="bg-gradient-to-r from-[#1a2b3c] via-[#003d80] to-[#0056b3] text-white rounded-[6px] p-6 shadow-md">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'شبیه‌سازی فیزیکی ردیاب دو محوره خورشیدی با الگوریتم زاویه تابش صفر' : 'Dual-Axis Solar Tracking Simulator (Zero AOI Alignment)'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {lang === 'fa' 
              ? 'پایگاه ملی پایش پتانسیل خورشیدی و ریزشبکه‌های ۳۱ استان ایران' 
              : 'National Solar Tracking Potential & Microgrid Simulator for 31 Iranian Provinces'}
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-3xl">
            {lang === 'fa'
              ? 'این سامانه با تحلیل هندسه زاویه فراز و سمت خورشید، شدت تابش مستقیم (DNI)، پخشی (DHI) و کل (GHI)، جهت‌گیری بهینه دکل ردیاب دو محوره (Rot Z و Rot X) را محاسبه کرده و افزایش بازدهی ۲۸ تا ۳۶ درصدی تولید برق خورشیدی را به همراه تراز انرژی باتری و خودکفایی ریزشبکه ارائه می‌دهد.'
              : 'Simulates solar altitude & azimuth, DNI, DHI, and GHI to compute optimal dual-axis tracker rig orientation (Yaw Rot Z & Pitch Rot X), demonstrating a 28% to 36% yield gain over fixed tilt systems alongside battery storage dispatch.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-sky-200">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'fa' ? 'الگوریتم ردیابی بلادرنگ (AOI = ۰.۰۰°)' : 'Zero-Incidence Dual-Axis Vector Tracking'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-300" />
              <span>{lang === 'fa' ? '۴ فصل کامل و ۲۴ ساعت شبانه‌روز' : '4 Seasons & 24 Hourly Simulation Steps'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provinces Comparison Chart */}
      <ProvincesComparisonChart
        provinces={provinces}
        onSelectProvince={onSelectProvince}
        lang={lang}
      />

      {/* 31 Provinces Grid with Search & Filters */}
      <ProvincesOverviewGrid
        provinces={provinces}
        selectedSeason={selectedSeason}
        onSelectProvince={onSelectProvince}
        lang={lang}
      />
    </div>
  );
};
