import React, { useState } from 'react';
import { ProvinceSolarData, LangMode } from '../types/solar';
import { BarChart3, TrendingUp, Award } from 'lucide-react';

interface ProvincesComparisonChartProps {
  provinces: ProvinceSolarData[];
  onSelectProvince: (nameEn: string) => void;
  lang: LangMode;
}

export const ProvincesComparisonChart: React.FC<ProvincesComparisonChartProps> = ({
  provinces,
  onSelectProvince,
  lang
}) => {
  const [metric, setMetric] = useState<'yield' | 'gain'>('yield');

  const sortedProvinces = [...provinces].sort((a, b) => {
    if (metric === 'yield') return b.annualPvMwh - a.annualPvMwh;
    return b.trackedGainPct - a.trackedGainPct;
  });

  const maxValue = Math.max(
    ...sortedProvinces.map((p) => (metric === 'yield' ? p.annualPvMwh : p.trackedGainPct))
  );

  return (
    <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-5 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#e2e8f0] pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#0056b3]" />
          <div>
            <h3 className="font-bold text-[#1a2b3c] text-sm">
              {lang === 'fa' ? 'رتبه‌بندی پتانسیل خورشیدی و بهره ردیاب ۳۱ استان ایران' : 'Iran 31 Provinces Solar Potential & Tracking Gain Ranking'}
            </h3>
            <p className="text-xs text-[#627d98]">
              {lang === 'fa' ? 'مقایسه عملکرد تولید و پتانسیل اقتصادی ردیاب خورشیدی دو محوره' : 'Comparative dual-axis tracker performance across Iranian geography'}
            </p>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1.5 bg-[#f0f4f8] p-1 rounded border border-[#bcccdc] text-xs">
          <button
            type="button"
            onClick={() => setMetric('yield')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              metric === 'yield' ? 'bg-[#0056b3] text-white shadow-xs' : 'text-[#334e68] hover:text-[#1a2b3c]'
            }`}
          >
            {lang === 'fa' ? 'تولید سالانه (MWh)' : 'Annual Yield (MWh)'}
          </button>
          <button
            type="button"
            onClick={() => setMetric('gain')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              metric === 'gain' ? 'bg-[#0056b3] text-white shadow-xs' : 'text-[#334e68] hover:text-[#1a2b3c]'
            }`}
          >
            {lang === 'fa' ? 'افزایش ردیاب (%)' : 'Tracking Gain (%)'}
          </button>
        </div>
      </div>

      {/* Bar List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 max-h-[460px] overflow-y-auto pr-2">
        {sortedProvinces.map((p, idx) => {
          const val = metric === 'yield' ? p.annualPvMwh : p.trackedGainPct;
          const pct = (val / maxValue) * 100;
          const isTop3 = idx < 3;

          return (
            <div
              key={p.nameEn}
              onClick={() => onSelectProvince(p.nameEn)}
              className="group cursor-pointer p-2 rounded hover:bg-[#f8fafc] border border-transparent hover:border-[#d1d9e6] transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isTop3 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-[#e2e8f0] text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-[#1a2b3c] group-hover:text-[#0056b3] transition-colors">
                    {lang === 'fa' ? p.nameFa : p.nameEn}
                  </span>
                  <span className="text-[11px] text-[#627d98]">
                    ({lang === 'fa' ? p.capitalFa : p.capitalEn})
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className={metric === 'gain' ? 'text-emerald-600' : 'text-[#0056b3]'}>
                    {metric === 'gain' ? `+${val}%` : `${val} MWh`}
                  </span>
                </div>
              </div>

              {/* Bar Fill */}
              <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    metric === 'gain' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : 'bg-gradient-to-r from-[#0056b3] to-[#0284c7]'
                  }`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
