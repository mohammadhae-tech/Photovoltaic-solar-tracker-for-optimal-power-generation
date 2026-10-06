import React, { useState } from 'react';
import { HourlySolarPoint } from '../types/solar';
import { SunMedium, Zap, TrendingUp } from 'lucide-react';

interface IrradianceChartProps {
  points: HourlySolarPoint[];
  currentHour: number;
  onHourSelect?: (hour: number) => void;
  lang: 'fa' | 'en';
}

export const IrradianceChart: React.FC<IrradianceChartProps> = ({
  points,
  currentHour,
  onHourSelect,
  lang
}) => {
  const [hoverHour, setHoverHour] = useState<number | null>(null);

  const activeHour = hoverHour !== null ? hoverHour : currentHour;
  const activePoint = points[activeHour] || points[0];

  // Calculate maximum irradiance for scaling
  const maxPoa = Math.max(...points.map((p) => Math.max(p.poaTracked, p.poaFixed, p.poaHorizontal, 1100)));

  // SVG chart dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const getX = (hour: number) => paddingLeft + (hour / 23) * chartW;
  const getY = (val: number) => paddingTop + chartH - (val / maxPoa) * chartH;

  // Build SVG path strings
  const trackedPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour)} ${getY(p.poaTracked)}`).join(' ');
  const fixedPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour)} ${getY(p.poaFixed)}`).join(' ');
  const horizPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour)} ${getY(p.poaHorizontal)}`).join(' ');

  // Filled area for tracked solar radiation
  const trackedArea = `${trackedPath} L ${getX(23)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  // Daily totals
  const dailyTrackedKwh = (points.reduce((acc, p) => acc + p.poaTracked, 0) / 1000).toFixed(2);
  const dailyFixedKwh = (points.reduce((acc, p) => acc + p.poaFixed, 0) / 1000).toFixed(2);
  const dailyHorizKwh = (points.reduce((acc, p) => acc + p.poaHorizontal, 0) / 1000).toFixed(2);
  const gainPct = (((Number(dailyTrackedKwh) - Number(dailyFixedKwh)) / Number(dailyFixedKwh)) * 100).toFixed(1);

  return (
    <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)]">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-[#e2e8f0] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <SunMedium className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-[#1a2b3c] text-sm">
              {lang === 'fa' ? 'مقایسه تابش صفحه ردیاب (POA) با پنل ثابت و افقی' : 'Plane of Array (POA) Irradiance Comparison'}
            </h3>
          </div>
          <p className="text-xs text-[#627d98] mt-0.5">
            {lang === 'fa' 
              ? 'تابش فرودی بر سطح جاذب خورشیدی (W/m²) در طول ۲۴ ساعت' 
              : 'Incident solar irradiance on collector plane (W/m²) over 24 hours'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#0056b3]"></span>
            <span className="text-[#1a2b3c]">{lang === 'fa' ? 'ردیاب دو محوره' : 'Dual-Axis Tracked'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#eab308]"></span>
            <span className="text-[#64748b]">{lang === 'fa' ? 'شیب ثابت جنوبی' : 'Fixed Optimal Tilt'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#94a3b8]"></span>
            <span className="text-[#64748b]">{lang === 'fa' ? 'افقی (GHI)' : 'Horizontal'}</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px]"
        >
          <defs>
            <linearGradient id="trackedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0056b3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0056b3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 250, 500, 750, 1000].map((val) => (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={getY(val)}
                x2={svgWidth - paddingRight}
                y2={getY(val)}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={getY(val) + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
                fontFamily="sans-serif"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Hour grid lines */}
          {[0, 4, 8, 12, 16, 20, 23].map((h) => (
            <g key={h}>
              <line
                x1={getX(h)}
                y1={paddingTop}
                x2={getX(h)}
                y2={paddingTop + chartH}
                stroke="#f1f5f9"
              />
              <text
                x={getX(h)}
                y={paddingTop + chartH + 16}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                fontFamily="sans-serif"
              >
                {h}:00
              </text>
            </g>
          ))}

          {/* Shaded Area for Tracked */}
          <path d={trackedArea} fill="url(#trackedGrad)" />

          {/* Lines */}
          <path d={horizPath} fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="3 3" />
          <path d={fixedPath} fill="none" stroke="#eab308" strokeWidth="2.2" />
          <path d={trackedPath} fill="none" stroke="#0056b3" strokeWidth="2.6" />

          {/* Current Hour Indicator Line */}
          <line
            x1={getX(activeHour)}
            y1={paddingTop}
            x2={getX(activeHour)}
            y2={paddingTop + chartH}
            stroke="#0056b3"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Points at active hour */}
          <circle cx={getX(activeHour)} cy={getY(activePoint.poaHorizontal)} r="3.5" fill="#94a3b8" />
          <circle cx={getX(activeHour)} cy={getY(activePoint.poaFixed)} r="4" fill="#eab308" />
          <circle cx={getX(activeHour)} cy={getY(activePoint.poaTracked)} r="5" fill="#0056b3" stroke="#fff" strokeWidth="1.5" />

          {/* Interactive touch targets for each hour */}
          {points.map((p) => (
            <rect
              key={p.hour}
              x={getX(p.hour) - chartW / 48}
              y={paddingTop}
              width={chartW / 24}
              height={chartH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverHour(p.hour)}
              onMouseLeave={() => setHoverHour(null)}
              onClick={() => onHourSelect && onHourSelect(p.hour)}
            />
          ))}
        </svg>
      </div>

      {/* Hourly Hover / Selected Values Card */}
      <div className="mt-3 p-3 bg-[#f8fafc] rounded border border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1a2b3c] bg-white px-2 py-1 rounded border border-[#d1d9e6]">
            {lang === 'fa' ? `ساعت ${activeHour}:00` : `Hour ${activeHour}:00`}
          </span>
          <span className="text-[#627d98]">
            DNI: <b className="text-[#1a2b3c]">{activePoint.dni}</b> W/m² | DHI: <b className="text-[#1a2b3c]">{activePoint.dhi}</b> W/m²
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#0056b3] font-semibold">
            {lang === 'fa' ? 'ردیاب:' : 'Tracked:'} <b>{activePoint.poaTracked}</b> W/m²
          </span>
          <span className="text-amber-700 font-semibold">
            {lang === 'fa' ? 'ثابت:' : 'Fixed:'} <b>{activePoint.poaFixed}</b> W/m²
          </span>
          <span className="text-slate-600 font-semibold">
            {lang === 'fa' ? 'افقی:' : 'Horizontal:'} <b>{activePoint.poaHorizontal}</b> W/m²
          </span>
        </div>
      </div>

      {/* Energy Gain Summary Bar */}
      <div className="mt-3 pt-3 border-t border-[#e2e8f0] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-[#e7f1ff] p-2 rounded">
          <span className="text-[#0056b3] block text-[11px] mb-0.5 font-medium">{lang === 'fa' ? 'انرژی روزانه ردیاب' : 'Tracked Daily'}</span>
          <span className="font-bold text-[#0056b3] text-sm">{dailyTrackedKwh} kWh/m²</span>
        </div>
        <div className="bg-amber-50 p-2 rounded">
          <span className="text-amber-700 block text-[11px] mb-0.5 font-medium">{lang === 'fa' ? 'انرژی پنل ثابت' : 'Fixed Daily'}</span>
          <span className="font-bold text-amber-800 text-sm">{dailyFixedKwh} kWh/m²</span>
        </div>
        <div className="bg-slate-100 p-2 rounded">
          <span className="text-slate-600 block text-[11px] mb-0.5 font-medium">{lang === 'fa' ? 'انرژی افقی (GHI)' : 'Horizontal Daily'}</span>
          <span className="font-bold text-slate-700 text-sm">{dailyHorizKwh} kWh/m²</span>
        </div>
        <div className="bg-emerald-50 p-2 rounded">
          <span className="text-emerald-700 block text-[11px] mb-0.5 font-medium flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {lang === 'fa' ? 'بهره ردیاب دو محوره' : 'Tracker Gain'}
          </span>
          <span className="font-bold text-emerald-700 text-sm">+{gainPct}%</span>
        </div>
      </div>
    </div>
  );
};
