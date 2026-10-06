import React, { useState, useMemo } from 'react';
import { ProvinceSolarData, SeasonKey, LangMode } from '../types/solar';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Zap, Sun, ShieldCheck, Battery, TrendingUp, Sparkles, Filter } from 'lucide-react';

interface ProvincesOverviewGridProps {
  provinces: ProvinceSolarData[];
  selectedSeason: SeasonKey;
  onSelectProvince: (provinceEn: string) => void;
  lang: LangMode;
}

export const ProvincesOverviewGrid: React.FC<ProvincesOverviewGridProps> = ({
  provinces,
  selectedSeason,
  onSelectProvince,
  lang
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'yield' | 'gain' | 'tilt' | 'name'>('yield');
  const [regionFilter, setRegionFilter] = useState<'all' | 'central' | 'north' | 'south' | 'west' | 'east'>('all');

  const filteredProvinces = useMemo(() => {
    return provinces.filter((p) => {
      const matchSearch =
        p.nameFa.includes(searchTerm) ||
        p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.capitalFa.includes(searchTerm) ||
        p.capitalEn.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (regionFilter === 'central') {
        return ['Tehran', 'Isfahan', 'Yazd', 'Markazi', 'Qom', 'Semnan', 'Alborz'].includes(p.nameEn);
      }
      if (regionFilter === 'north') {
        return ['Gilan', 'Mazandaran', 'Golestan', 'Ardabil', 'East Azerbaijan', 'West Azerbaijan'].includes(p.nameEn);
      }
      if (regionFilter === 'south') {
        return ['Fars', 'Khuzestan', 'Hormozgan', 'Bushehr', 'Kerman', 'Sistan & Baluchestan'].includes(p.nameEn);
      }
      if (regionFilter === 'west') {
        return ['Kurdistan', 'Kermanshah', 'Lorestan', 'Ilam', 'Hamadan', 'Zanjan', 'Qazvin', 'Chaharmahal & Bakhtiari', 'Kohgiluyeh & Boyer-Ahmad'].includes(p.nameEn);
      }
      if (regionFilter === 'east') {
        return ['Razavi Khorasan', 'South Khorasan', 'North Khorasan'].includes(p.nameEn);
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'yield') return b.annualPvMwh - a.annualPvMwh;
      if (sortBy === 'gain') return b.trackedGainPct - a.trackedGainPct;
      if (sortBy === 'tilt') return a.optimalTilt[selectedSeason] - b.optimalTilt[selectedSeason];
      return a.nameEn.localeCompare(b.nameEn);
    });
  }, [provinces, searchTerm, sortBy, regionFilter, selectedSeason]);

  // Overall national stats
  const nationalAvgYield = (provinces.reduce((acc, p) => acc + p.annualPvMwh, 0) / provinces.length).toFixed(1);
  const nationalAvgGain = (provinces.reduce((acc, p) => acc + p.trackedGainPct, 0) / provinces.length).toFixed(1);
  const nationalAvgAutonomy = (provinces.reduce((acc, p) => acc + p.batteryAutonomyHours, 0) / provinces.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* National Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)] flex items-center justify-between">
          <div>
            <span className="text-[#627d98] text-xs block mb-1">
              {lang === 'fa' ? 'تعداد کل استان‌های تحت پوشش' : 'Covered Iran Provinces'}
            </span>
            <span className="text-2xl font-bold text-[#1a2b3c] font-mono">
              ۳۱ <span className="text-xs font-normal text-[#627d98]">{lang === 'fa' ? 'استان کشور' : 'Provinces'}</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded bg-[#e7f1ff] text-[#0056b3] flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)] flex items-center justify-between">
          <div>
            <span className="text-[#627d98] text-xs block mb-1">
              {lang === 'fa' ? 'متوسط تولید سالانه هر سامانه' : 'National Avg Solar Yield'}
            </span>
            <span className="text-2xl font-bold text-[#0056b3] font-mono">
              {nationalAvgYield} <span className="text-xs font-normal text-[#627d98]">MWh/سال</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)] flex items-center justify-between">
          <div>
            <span className="text-[#627d98] text-xs block mb-1">
              {lang === 'fa' ? 'میانگین افزایش بازدهی ردیاب' : 'Dual-Axis Tracking Gain'}
            </span>
            <span className="text-2xl font-bold text-emerald-600 font-mono">
              +{nationalAvgGain}% <span className="text-xs font-normal text-[#627d98]">{lang === 'fa' ? 'نسبت به ثابت' : 'vs Fixed'}</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)] flex items-center justify-between">
          <div>
            <span className="text-[#627d98] text-xs block mb-1">
              {lang === 'fa' ? 'میانگین تاب‌آوری باتری' : 'Storage Autonomy'}
            </span>
            <span className="text-2xl font-bold text-amber-600 font-mono">
              {nationalAvgAutonomy} <span className="text-xs font-normal text-[#627d98]">{lang === 'fa' ? 'ساعت مداوم' : 'Hours'}</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
            <Battery className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#627d98] absolute right-3 rtl:right-3 ltr:left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'fa' ? 'جستجوی استان یا مرکز استان (مثال: تهران، اصفهان، تبریز)...' : 'Search province or capital...'}
              className="w-full bg-[#f8fafc] border border-[#bcccdc] rounded-[4px] py-2 px-9 text-xs text-[#243b53] focus:outline-none focus:border-[#0056b3] focus:bg-white transition-all"
            />
          </div>

          {/* Regional Filter & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Region Filter Buttons */}
            <div className="flex items-center gap-1 bg-[#f0f4f8] p-1 rounded-[4px] border border-[#d1d9e6] text-xs">
              <Filter className="w-3.5 h-3.5 text-[#627d98] mx-1" />
              {[
                { id: 'all', labelFa: 'همه', labelEn: 'All' },
                { id: 'central', labelFa: 'مرکزی', labelEn: 'Central' },
                { id: 'north', labelFa: 'شمال', labelEn: 'North' },
                { id: 'south', labelFa: 'جنوب', labelEn: 'South' },
                { id: 'west', labelFa: 'غرب', labelEn: 'West' },
                { id: 'east', labelFa: 'شرق', labelEn: 'East' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegionFilter(r.id as any)}
                  className={`px-2.5 py-1 rounded-[3px] font-medium transition-all ${
                    regionFilter === r.id
                      ? 'bg-[#0056b3] text-white shadow-xs'
                      : 'text-[#334e68] hover:text-[#1a2b3c]'
                  }`}
                >
                  {lang === 'fa' ? r.labelFa : r.labelEn}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#627d98]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#bcccdc] rounded-[4px] px-2 py-1.5 text-xs text-[#243b53] focus:outline-none"
              >
                <option value="yield">{lang === 'fa' ? 'بیشترین تولید سالانه (MWh)' : 'Highest Annual Yield'}</option>
                <option value="gain">{lang === 'fa' ? 'بیشترین افزایش ردیاب (%)' : 'Highest Tracking Gain'}</option>
                <option value="tilt">{lang === 'fa' ? 'زاویه شیب بهینه فصل' : 'Seasonal Optimal Tilt'}</option>
                <option value="name">{lang === 'fa' ? 'ترتیب الفبایی' : 'Alphabetical Name'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Provinces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProvinces.map((province) => {
          const seasonTilt = province.optimalTilt[selectedSeason];

          return (
            <div
              key={province.nameEn}
              className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.06)] hover:border-[#0056b3] hover:shadow-[0px_6px_22px_0px_rgba(0,40,80,0.12)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3 border-b border-[#f1f5f9] pb-2.5">
                  <div>
                    <h4 className="font-bold text-base text-[#1a2b3c]">
                      {lang === 'fa' ? province.nameFa : province.nameEn}
                    </h4>
                    <span className="text-xs text-[#627d98]">
                      {lang === 'fa' 
                        ? `مرکز: ${province.capitalFa} | مختصات: ${province.lat}°N, ${province.lon}°E` 
                        : `Capital: ${province.capitalEn} | ${province.lat}°N, ${province.lon}°E`}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-[#e7f1ff] text-[#0056b3] rounded">
                    +{province.trackedGainPct}%
                  </span>
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
                    <span className="text-[#627d98] block text-[11px] mb-0.5">
                      {lang === 'fa' ? 'تولید آرایه سالانه' : 'Annual Generation'}
                    </span>
                    <span className="font-bold text-[#1a2b3c] font-mono text-sm">
                      {province.annualPvMwh} MWh
                    </span>
                  </div>

                  <div className="p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
                    <span className="text-[#627d98] block text-[11px] mb-0.5">
                      {lang === 'fa' ? `شیب بهینه (${selectedSeason})` : `Optimal Tilt (${selectedSeason})`}
                    </span>
                    <span className="font-bold text-[#0056b3] font-mono text-sm">
                      {seasonTilt}° <span className="text-[10px] text-[#627d98]">({province.optimalTilt.annual}° سالانه)</span>
                    </span>
                  </div>

                  <div className="p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
                    <span className="text-[#627d98] block text-[11px] mb-0.5">
                      {lang === 'fa' ? 'خودکفایی ریزشبکه' : 'Self-Sufficiency'}
                    </span>
                    <span className="font-bold text-emerald-600 font-mono text-sm">
                      {province.selfSufficiencyPct}%
                    </span>
                  </div>

                  <div className="p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
                    <span className="text-[#627d98] block text-[11px] mb-0.5">
                      {lang === 'fa' ? 'تاب‌آوری ذخیره‌ساز' : 'Battery Autonomy'}
                    </span>
                    <span className="font-bold text-amber-600 font-mono text-sm">
                      {province.batteryAutonomyHours} ساعت
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectProvince(province.nameEn)}
                className="w-full mt-2 py-2 px-3 bg-[#0056b3] hover:bg-[#003d80] text-white text-xs font-semibold rounded-[4px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{lang === 'fa' ? 'ورود به شبیه‌ساز و جزئیات ردیاب' : 'Inspect Simulation & Rig'}</span>
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredProvinces.length === 0 && (
        <div className="text-center py-12 bg-white rounded border border-[#d1d9e6]">
          <p className="text-sm text-[#627d98]">
            {lang === 'fa' ? 'هیچ استانی با این مشخصات یافت نشد.' : 'No provinces found matching the search criteria.'}
          </p>
        </div>
      )}
    </div>
  );
};
