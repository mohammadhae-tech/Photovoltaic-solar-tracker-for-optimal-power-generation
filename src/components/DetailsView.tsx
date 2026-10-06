import React, { useState } from 'react';
import { ProvinceSolarData, SeasonKey, LangMode } from '../types/solar';
import { SolarRigVisualizer } from './SolarRigVisualizer';
import { HourlyScrubber } from './HourlyScrubber';
import { IrradianceChart } from './IrradianceChart';
import { MicrogridChart } from './MicrogridChart';
import { OptimalTiltCard } from './OptimalTiltCard';
import { SEASONS_LIST } from '../data/provincesData';
import { MapPin, Calendar, Table, Download, Sparkles, ArrowRight, Sun, Zap, Battery, Info } from 'lucide-react';

interface DetailsViewProps {
  province: ProvinceSolarData;
  selectedSeason: SeasonKey;
  onSeasonChange: (season: SeasonKey) => void;
  onBackToOverview: () => void;
  lang: LangMode;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  province,
  selectedSeason,
  onSeasonChange,
  onBackToOverview,
  lang
}) => {
  const [currentHour, setCurrentHour] = useState<number>(12); // Default solar noon
  const [showTable, setShowTable] = useState<boolean>(false);

  const seasonPoints = province.seasons[selectedSeason] || province.seasons.spring;
  const currentPoint = seasonPoints[currentHour] || seasonPoints[0];
  const activeSeasonMeta = SEASONS_LIST.find((s) => s.id === selectedSeason) || SEASONS_LIST[0];

  const handleExportProvinceCsv = () => {
    const headers = [
      'hour', 'alt_deg', 'az_deg', 'dni_wm2', 'dhi_wm2', 'ghi_wm2',
      'opt_tilt_deg', 'opt_az_deg', 'rig_rotZ_deg', 'rig_rotX_deg', 'aoi_deg',
      'poa_tracked_wm2', 'poa_fixed_wm2', 'poa_horizontal_wm2',
      'pv_kw', 'load_kw', 'battery_flow_kw', 'battery_soc_kwh', 'grid_import_kw', 'mode'
    ];
    const rows = seasonPoints.map((p) => [
      p.hour, p.alt, p.az, p.dni, p.dhi, p.ghi,
      p.optTilt, p.optAz, p.rigRotZ, p.rigRotX, p.aoi,
      p.poaTracked, p.poaFixed, p.poaHorizontal,
      p.pvKw, p.loadKw, p.batteryFlowKw, p.batterySocKwh, p.gridImportKw, p.mode
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${province.nameEn.toLowerCase()}_${selectedSeason}_simulation.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.06)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToOverview}
            className="flex items-center gap-1.5 text-xs text-[#0056b3] hover:text-[#003d80] font-semibold bg-[#e7f1ff] px-3 py-1.5 rounded transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            <span>{lang === 'fa' ? 'بازگشت به فهرست استان‌ها' : 'Back to Overview'}</span>
          </button>
          <div className="h-5 w-px bg-[#d1d9e6]"></div>
          <div>
            <h2 className="text-lg font-bold text-[#1a2b3c] flex items-center gap-2">
              <span>{lang === 'fa' ? `شبیه‌سازی تخصصی استان ${province.nameFa}` : `Detailed Simulation: ${province.nameEn}`}</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                {lang === 'fa' ? `مرکز: ${province.capitalFa}` : `Capital: ${province.capitalEn}`}
              </span>
            </h2>
            <span className="text-xs text-[#627d98]">
              {lang === 'fa' 
                ? `مختصات جغرافیایی: ${province.lat}°N, ${province.lon}°E | ارتفاع خورشیدی در ظهر: ${seasonPoints[12]?.alt}°` 
                : `Coordinates: ${province.lat}°N, ${province.lon}°E | Solar Noon Altitude: ${seasonPoints[12]?.alt}°`}
            </span>
          </div>
        </div>

        {/* Season Selector Chips & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {SEASONS_LIST.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSeasonChange(s.id as SeasonKey)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedSeason === s.id
                  ? 'bg-[#0056b3] text-white shadow-xs'
                  : 'bg-[#f0f4f8] text-[#334e68] hover:bg-[#e2e8f0]'
              }`}
            >
              <span>{lang === 'fa' ? s.nameFa : s.nameEn}</span>
              <span className="text-[10px] opacity-75">
                ({s.id === 'spring' ? '5 May' : s.id === 'summer' ? '6 Aug' : s.id === 'autumn' ? '6 Nov' : '4 Feb'})
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={handleExportProvinceCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f4f8] hover:bg-[#e2e8f0] border border-[#bcccdc] rounded text-xs font-medium text-[#243b53] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#0056b3]" />
            <span>{lang === 'fa' ? 'خروجی CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport (Rig Visualizer + Hourly Controller) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Tracker Rig Viewport */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <SolarRigVisualizer
            point={currentPoint}
            provinceNameFa={province.nameFa}
            provinceNameEn={province.nameEn}
            lang={lang}
          />
        </div>

        {/* Hourly Scrubber + Seasonal Tilt Angles */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <HourlyScrubber
            currentHour={currentHour}
            onHourChange={setCurrentHour}
            dayPoints={seasonPoints}
            lang={lang}
          />

          <OptimalTiltCard
            optimalTilt={province.optimalTilt}
            currentTilt={currentPoint.rigRotX}
            provinceName={lang === 'fa' ? province.nameFa : province.nameEn}
            lang={lang}
          />
        </div>
      </div>

      {/* Graphs Row: Irradiance comparison & Microgrid balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IrradianceChart
          points={seasonPoints}
          currentHour={currentHour}
          onHourSelect={setCurrentHour}
          lang={lang}
        />

        <MicrogridChart
          points={seasonPoints}
          currentHour={currentHour}
          batteryCapKwh={province.batteryAutonomyHours * 1.5}
          lang={lang}
        />
      </div>

      {/* Toggle Full 24-Hour Raw Telemetry Table */}
      <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-[#0056b3]" />
            <h4 className="font-bold text-sm text-[#1a2b3c]">
              {lang === 'fa' ? 'جدول تله‌متری ۲۴ ساعته داده‌های شبیه‌سازی' : '24-Hour Simulation Raw Telemetry Matrix'}
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowTable(!showTable)}
            className="text-xs font-semibold px-3 py-1.5 border border-[#bcccdc] rounded text-[#0056b3] hover:bg-[#e7f1ff] transition-colors"
          >
            {showTable ? (lang === 'fa' ? 'بستن جدول' : 'Hide Table') : (lang === 'fa' ? 'مشاهده جدول کامل' : 'Show Full Table')}
          </button>
        </div>

        {showTable && (
          <div className="overflow-x-auto max-h-96 border border-[#e2e8f0] rounded">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
              <thead className="bg-[#1a2b3c] text-white sticky top-0 font-semibold">
                <tr>
                  <th className="p-2 border border-slate-700">ساعت</th>
                  <th className="p-2 border border-slate-700">فراز (Alt)</th>
                  <th className="p-2 border border-slate-700">سمت (Az)</th>
                  <th className="p-2 border border-slate-700">DNI (W/m²)</th>
                  <th className="p-2 border border-slate-700">DHI (W/m²)</th>
                  <th className="p-2 border border-slate-700">POA Tracked</th>
                  <th className="p-2 border border-slate-700">POA Fixed</th>
                  <th className="p-2 border border-slate-700">Rig Rot Z</th>
                  <th className="p-2 border border-slate-700">Rig Rot X</th>
                  <th className="p-2 border border-slate-700">PV (kW)</th>
                  <th className="p-2 border border-slate-700">Load (kW)</th>
                  <th className="p-2 border border-slate-700">Battery (kW)</th>
                  <th className="p-2 border border-slate-700">SoC (kWh)</th>
                  <th className="p-2 border border-slate-700">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {seasonPoints.map((p) => {
                  const isCurrent = p.hour === currentHour;
                  return (
                    <tr
                      key={p.hour}
                      onClick={() => setCurrentHour(p.hour)}
                      className={`cursor-pointer hover:bg-[#e7f1ff] transition-colors ${
                        isCurrent ? 'bg-[#dbeafe] font-bold' : p.hour % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'
                      }`}
                    >
                      <td className="p-2 font-mono">{p.hour}:00</td>
                      <td className="p-2 font-mono">{p.alt}°</td>
                      <td className="p-2 font-mono">{p.az}°</td>
                      <td className="p-2 font-mono">{p.dni}</td>
                      <td className="p-2 font-mono">{p.dhi}</td>
                      <td className="p-2 font-mono font-bold text-[#0056b3]">{p.poaTracked}</td>
                      <td className="p-2 font-mono text-amber-700">{p.poaFixed}</td>
                      <td className="p-2 font-mono">{p.rigRotZ}°</td>
                      <td className="p-2 font-mono">{p.rigRotX}°</td>
                      <td className="p-2 font-mono text-emerald-700">{p.pvKw}</td>
                      <td className="p-2 font-mono text-red-600">{p.loadKw}</td>
                      <td className="p-2 font-mono">{p.batteryFlowKw > 0 ? `+${p.batteryFlowKw}` : p.batteryFlowKw}</td>
                      <td className="p-2 font-mono font-bold">{p.batterySocKwh}</td>
                      <td className="p-2 text-[11px] text-slate-700">{p.mode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
