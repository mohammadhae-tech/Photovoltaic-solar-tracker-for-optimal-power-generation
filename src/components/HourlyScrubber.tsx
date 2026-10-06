import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Sun, Moon, Clock } from 'lucide-react';
import { HourlySolarPoint } from '../types/solar';

interface HourlyScrubberProps {
  currentHour: number;
  onHourChange: (hour: number) => void;
  dayPoints: HourlySolarPoint[];
  lang: 'fa' | 'en';
}

export const HourlyScrubber: React.FC<HourlyScrubberProps> = ({
  currentHour,
  onHourChange,
  dayPoints,
  lang
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1000); // 1 sec per hour

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onHourChange((currentHour + 1) % 24);
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, currentHour, speed, onHourChange]);

  const currentPoint = dayPoints[currentHour] || dayPoints[0];

  return (
    <div className="bg-white border border-[#d1d9e6] rounded-[6px] p-4 shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)]">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#e7f1ff] text-[#0056b3] rounded">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#1a2b3c] font-mono">
                {currentHour.toString().padStart(2, '0')}:00
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                currentPoint.alt > 0 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {currentPoint.alt > 0 
                  ? (lang === 'fa' ? 'روشنایی روز' : 'Daylight') 
                  : (lang === 'fa' ? 'شب' : 'Night')}
              </span>
            </div>
            <span className="text-xs text-[#627d98]">
              {lang === 'fa' ? 'محور زمان شبیه‌سازی ۲۴ ساعته' : '24-Hour Simulation Timeline'}
            </span>
          </div>
        </div>

        {/* Player controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onHourChange((currentHour - 1 + 24) % 24)}
            className="p-2 border border-[#bcccdc] rounded text-[#243b53] hover:bg-[#f0f4f8] transition-colors"
            title={lang === 'fa' ? 'یک ساعت قبل' : 'Previous Hour'}
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-2 rounded flex items-center gap-1.5 font-medium text-xs text-white transition-all ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-[#0056b3] hover:bg-[#003d80]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'توقف' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{lang === 'fa' ? 'شروع انیمیشن' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onHourChange((currentHour + 1) % 24)}
            className="p-2 border border-[#bcccdc] rounded text-[#243b53] hover:bg-[#f0f4f8] transition-colors"
            title={lang === 'fa' ? 'یک ساعت بعد' : 'Next Hour'}
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </button>

          <button
            type="button"
            onClick={() => onHourChange(12)}
            className="px-2.5 py-2 border border-[#bcccdc] rounded text-xs text-[#334e68] hover:bg-[#f0f4f8] font-medium"
            title={lang === 'fa' ? 'ظهر خورشیدی' : 'Solar Noon'}
          >
            {lang === 'fa' ? 'ظهر ۱۲:۰۰' : 'Noon'}
          </button>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="text-xs border border-[#bcccdc] rounded px-2 py-2 bg-white text-[#334e68] focus:outline-none focus:border-[#0056b3]"
          >
            <option value={1500}>0.7x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
          </select>
        </div>
      </div>

      {/* Hourly Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="23"
          step="1"
          value={currentHour}
          onChange={(e) => onHourChange(Number(e.target.value))}
          className="w-full h-2.5 bg-[#d1d9e6] rounded-lg appearance-none cursor-pointer accent-[#0056b3]"
        />

        {/* 24-hour tick marks with daylight visualization */}
        <div className="grid grid-cols-24 gap-0.5 text-center pt-1">
          {Array.from({ length: 24 }).map((_, h) => {
            const p = dayPoints[h];
            const isCurrent = h === currentHour;
            const isSunUp = p && p.alt > 0;

            return (
              <button
                key={h}
                type="button"
                onClick={() => onHourChange(h)}
                className={`py-1 rounded text-[10px] font-mono transition-all flex flex-col items-center ${
                  isCurrent
                    ? 'bg-[#0056b3] text-white font-bold ring-2 ring-[#0056b3]/30'
                    : isSunUp
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                }`}
                title={`ساعت ${h}:00 - ${isSunUp ? 'روز' : 'شب'}`}
              >
                <span>{h}</span>
                <span className="w-1.5 h-1.5 rounded-full mt-0.5" style={{
                  backgroundColor: isCurrent ? '#ffffff' : (isSunUp ? '#f59e0b' : '#94a3b8')
                }}></span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
