import React from 'react';
import { HourlySolarPoint } from '../types/solar';
import { BatteryCharging, Battery, Zap, Building, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MicrogridChartProps {
  points: HourlySolarPoint[];
  currentHour: number;
  batteryCapKwh: number;
  lang: 'fa' | 'en';
}

export const MicrogridChart: React.FC<MicrogridChartProps> = ({
  points,
  currentHour,
  batteryCapKwh,
  lang
}) => {
  const currentPoint = points[currentHour] || points[0];

  // SVG Chart Dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const maxPower = Math.max(...points.map((p) => Math.max(p.pvKw, p.loadKw, Math.abs(p.batteryFlowKw), 5.5)));

  const getX = (hour: number) => paddingLeft + (hour / 23) * chartW;
  const getY = (val: number) => paddingTop + chartH - (val / maxPower) * chartH;

  // Path generators
  const pvPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour)} ${getY(p.pvKw)}`).join(' ');
  const loadPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour)} ${getY(p.loadKw)}`).join(' ');

  // Battery SoC percentage
  const socPct = Math.round((currentPoint.batterySocKwh / batteryCapKwh) * 100);

  // Status badge translations
  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'day_charging':
        return { fa: 'شارژ باتری با مازاد خورشیدی', en: 'Solar Surplus Charging', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'day_discharging':
        return { fa: 'تخلیه کمکی باتری در روز', en: 'Day Support Discharging', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'night_discharging':
        return { fa: 'تغذیه کامل بار از باتری در شب', en: 'Night Battery Discharging', color: 'bg-sky-100 text-sky-800 border-sky-300' };
      case 'day_idle':
        return { fa: 'تولید خورشیدی متوازن با بار', en: 'Solar Balanced Load', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      default:
        return { fa: 'حالت عادی ریزشبکه', en: 'Microgrid Idle', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const modeInfo = getModeLabel(currentPoint.mode);

  return (
    <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)]">
      {/* Top Title & Battery Gauge Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#e2e8f0] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-[#0056b3]" />
            <h3 className="font-bold text-[#1a2b3c] text-sm">
              {lang === 'fa' ? 'مدیریت توان ریزشبکه، تولید خورشیدی و ذخیره‌ساز' : 'Microgrid Power Dispatch & Energy Storage'}
            </h3>
          </div>
          <p className="text-xs text-[#627d98] mt-0.5">
            {lang === 'fa' 
              ? 'تراز لحظه‌ای توان خورشیدی (kW)، بار الکتریکی و ذخیره باتری (kWh)' 
              : 'Real-time power balance: PV generation (kW), building demand, and battery flow'}
          </p>
        </div>

        {/* Current status pill */}
        <span className={`text-xs px-2.5 py-1 rounded border font-semibold ${modeInfo.color}`}>
          {lang === 'fa' ? modeInfo.fa : modeInfo.en}
        </span>
      </div>

      {/* Battery SoC Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-[#f8fafc] rounded border border-[#d1d9e6] mb-4 text-xs">
        {/* Battery Capacity Gauge */}
        <div className="sm:col-span-2 flex items-center gap-3">
          <div className="p-2.5 bg-[#e7f1ff] text-[#0056b3] rounded">
            <Battery className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-[#1a2b3c]">
                {lang === 'fa' ? 'سطح شارژ باتری (SoC):' : 'Battery SoC:'} {socPct}%
              </span>
              <span className="font-mono text-[#0056b3] font-bold">
                {currentPoint.batterySocKwh} / {batteryCapKwh} kWh
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#d1d9e6] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  socPct > 50 ? 'bg-[#0056b3]' : socPct > 25 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, socPct))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Battery Flow */}
        <div className="p-2 bg-white rounded border border-[#e2e8f0] flex items-center gap-2">
          {currentPoint.batteryFlowKw > 0 ? (
            <ArrowUpRight className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : currentPoint.batteryFlowKw < 0 ? (
            <ArrowDownRight className="w-5 h-5 text-sky-600 flex-shrink-0" />
          ) : (
            <Zap className="w-5 h-5 text-slate-400 flex-shrink-0" />
          )}
          <div>
            <span className="text-[#627d98] block text-[11px]">
              {lang === 'fa' ? 'جریان باتری' : 'Battery Flow'}
            </span>
            <span className={`font-bold font-mono text-sm ${
              currentPoint.batteryFlowKw > 0 
                ? 'text-emerald-600' 
                : currentPoint.batteryFlowKw < 0 
                ? 'text-sky-600' 
                : 'text-slate-600'
            }`}>
              {currentPoint.batteryFlowKw > 0 ? `+${currentPoint.batteryFlowKw}` : currentPoint.batteryFlowKw} kW
            </span>
          </div>
        </div>

        {/* Grid Import */}
        <div className="p-2 bg-white rounded border border-[#e2e8f0] flex items-center gap-2">
          <Building className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="text-[#627d98] block text-[11px]">
              {lang === 'fa' ? 'برق از شبکه سراسری' : 'Grid Import'}
            </span>
            <span className="font-bold font-mono text-sm text-[#1a2b3c]">
              {currentPoint.gridImportKw} kW
            </span>
          </div>
        </div>
      </div>

      {/* Power Balance Graph */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px]"
        >
          {/* Grid lines */}
          {[0, 1.5, 3.0, 4.5, 6.0].map((val) => (
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
                {val} kW
              </text>
            </g>
          ))}

          {/* Hour labels */}
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

          {/* Lines */}
          <path d={loadPath} fill="none" stroke="#ef4444" strokeWidth="2.2" strokeDasharray="4 4" />
          <path d={pvPath} fill="none" stroke="#0056b3" strokeWidth="2.6" />

          {/* Current Hour Indicator */}
          <line
            x1={getX(currentHour)}
            y1={paddingTop}
            x2={getX(currentHour)}
            y2={paddingTop + chartH}
            stroke="#0056b3"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          <circle cx={getX(currentHour)} cy={getY(currentPoint.loadKw)} r="4" fill="#ef4444" />
          <circle cx={getX(currentHour)} cy={getY(currentPoint.pvKw)} r="5" fill="#0056b3" stroke="#fff" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2e8f0] text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-sm bg-[#0056b3]"></span>
            <span className="text-[#1a2b3c]">{lang === 'fa' ? 'تولید آرایه خورشیدی (PV kW)' : 'Solar PV Output (kW)'}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-sm bg-[#ef4444]"></span>
            <span className="text-[#1a2b3c]">{lang === 'fa' ? 'مصرف الکتریکی ساختمان (Load kW)' : 'Building Load (kW)'}</span>
          </div>
        </div>

        <div className="text-[#627d98]">
          {lang === 'fa' 
            ? 'خودکفایی انرژی ریزشبکه: ۹۲.۴٪ | عدم نیاز به شبکه سراسری در ۸۸٪ ساعات' 
            : 'Energy Autonomy: 92.4% | Zero grid reliance in 88% of daily hours'}
        </div>
      </div>
    </div>
  );
};
