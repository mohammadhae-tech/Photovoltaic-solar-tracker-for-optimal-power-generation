import React from 'react';
import { OptimalTilt } from '../types/solar';
import { Sliders, Sun, Snowflake, CloudRain, Flame, Layers } from 'lucide-react';

interface OptimalTiltCardProps {
  optimalTilt: OptimalTilt;
  currentTilt: number;
  provinceName: string;
  lang: 'fa' | 'en';
}

export const OptimalTiltCard: React.FC<OptimalTiltCardProps> = ({
  optimalTilt,
  currentTilt,
  provinceName,
  lang
}) => {
  const seasons = [
    {
      id: 'spring',
      titleFa: 'بهار (Spring)',
      titleEn: 'Spring Optimal',
      angle: optimalTilt.spring,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      badgeColor: 'bg-emerald-600',
      icon: CloudRain
    },
    {
      id: 'summer',
      titleFa: 'تابستان (Summer)',
      titleEn: 'Summer Optimal',
      angle: optimalTilt.summer,
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      badgeColor: 'bg-amber-600',
      icon: Flame
    },
    {
      id: 'autumn',
      titleFa: 'پاییز (Autumn)',
      titleEn: 'Autumn Optimal',
      angle: optimalTilt.autumn,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      badgeColor: 'bg-orange-600',
      icon: Sun
    },
    {
      id: 'winter',
      titleFa: 'زمستان (Winter)',
      titleEn: 'Winter Optimal',
      angle: optimalTilt.winter,
      color: 'bg-sky-50 border-sky-200 text-sky-800',
      badgeColor: 'bg-sky-600',
      icon: Snowflake
    }
  ];

  return (
    <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)]">
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#0056b3]" />
          <div>
            <h3 className="font-bold text-[#1a2b3c] text-sm">
              {lang === 'fa' ? `زوایای بهینه شیب فصلی پنل ثابت (${provinceName})` : `Seasonal Optimal Tilt Angles (${provinceName})`}
            </h3>
            <p className="text-xs text-[#627d98]">
              {lang === 'fa' 
                ? 'مقایسه شیب‌های فصلی استاندارد با ردیاب هوشمند خورشیدی' 
                : 'Optimal seasonal fixed angles vs continuous dual-axis tracking'}
            </p>
          </div>
        </div>

        {/* Annual Average Tag */}
        <div className="bg-[#e7f1ff] border border-[#b8daff] text-[#0056b3] px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5">
          <Layers className="w-4 h-4" />
          <span>{lang === 'fa' ? `میانگین سالانه: ${optimalTilt.annual}°` : `Annual Tilt: ${optimalTilt.annual}°`}</span>
        </div>
      </div>

      {/* 4 Season Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {seasons.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`p-3 rounded border ${s.color} transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-white font-bold bg-[#1a2b3c]">
                  {s.angle}°
                </span>
              </div>
              <span className="text-xs font-bold block mb-0.5">
                {lang === 'fa' ? s.titleFa : s.titleEn}
              </span>
              <span className="text-[11px] opacity-80 block">
                {lang === 'fa' ? `زاویه بهینه: ${s.angle} درجه` : `Optimal: ${s.angle} deg`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Real-time Dynamic Tracker Tilt Comparison */}
      <div className="mt-3 p-2.5 bg-[#f0f4f8] rounded border border-[#bcccdc] flex items-center justify-between text-xs">
        <span className="text-[#334e68]">
          {lang === 'fa' 
            ? 'زاویه شیب کنونی ردیاب دو محوره (Real-time Rig Rot X):' 
            : 'Current Real-time Dual-Axis Tracker Pitch (Rot X):'}
        </span>
        <span className="font-bold text-[#0056b3] text-sm font-mono">
          {currentTilt.toFixed(1)}°
        </span>
      </div>
    </div>
  );
};
