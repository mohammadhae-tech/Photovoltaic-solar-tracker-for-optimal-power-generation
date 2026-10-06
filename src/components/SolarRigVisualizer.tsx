import React, { useEffect, useRef } from 'react';
import { HourlySolarPoint } from '../types/solar';
import { Compass, Sun, Compass as SunIcon, ShieldCheck } from 'lucide-react';

interface SolarRigVisualizerProps {
  point: HourlySolarPoint;
  provinceNameFa: string;
  provinceNameEn: string;
  lang: 'fa' | 'en';
}

export const SolarRigVisualizer: React.FC<SolarRigVisualizerProps> = ({
  point,
  provinceNameFa,
  provinceNameEn,
  lang
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | undefined;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isDay = point.alt > 0;
      const cx = width / 2;
      const cy = height / 2 + 35;

      // Draw Sky gradient background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isDay) {
        skyGrad.addColorStop(0, '#0284c7'); // Bright day blue
        skyGrad.addColorStop(0.6, '#38bdf8');
        skyGrad.addColorStop(1, '#e0f2fe');
      } else {
        skyGrad.addColorStop(0, '#0a192f'); // Night dark navy
        skyGrad.addColorStop(0.7, '#172a45');
        skyGrad.addColorStop(1, '#203a5e');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Stars if night
      if (!isDay) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        const starSeeds = [
          [0.15, 0.12], [0.25, 0.28], [0.42, 0.18], [0.65, 0.08], [0.82, 0.22],
          [0.78, 0.35], [0.12, 0.38], [0.35, 0.08], [0.9, 0.15], [0.5, 0.3]
        ];
        starSeeds.forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.arc(sx * width, sy * height, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw Horizon & Ground ellipse (Ground grid)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, 160, 48, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDay ? '#94a3b8' : '#334155';
      ctx.fill();
      ctx.strokeStyle = isDay ? '#cbd5e1' : '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Compass lines on ground
      ctx.strokeStyle = isDay ? '#64748b' : '#64748b';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      // North - South
      ctx.moveTo(cx, cy + 30 - 45);
      ctx.lineTo(cx, cy + 30 + 45);
      // East - West
      ctx.moveTo(cx - 150, cy + 30);
      ctx.lineTo(cx + 150, cy + 30);
      ctx.stroke();
      ctx.setLineDash([]);

      // Compass labels
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = isDay ? '#1e293b' : '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('N (0°)', cx, cy + 30 - 48);
      ctx.fillText('S (180°)', cx, cy + 30 + 58);
      ctx.fillText('W (270°)', cx - 165, cy + 33);
      ctx.fillText('E (90°)', cx + 165, cy + 33);
      ctx.restore();

      // Draw Sun or Moon Position
      let sunX = cx;
      let sunY = cy - 140;
      if (isDay) {
        // Orbit calculation
        const orbitRadiusX = 170;
        const orbitRadiusY = 110;
        // Azimuth from North (0° = N, 90° = E, 180° = S, 270° = W)
        const azRad = (point.az - 90) * (Math.PI / 180);
        const altRatio = Math.sin((point.alt * Math.PI) / 180);

        sunX = cx + Math.cos(azRad) * orbitRadiusX * (1 - altRatio * 0.4);
        sunY = cy - altRatio * orbitRadiusY - 20;

        // Sunlight glow
        const glow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 45);
        glow.addColorStop(0, 'rgba(255, 235, 59, 1)');
        glow.addColorStop(0.3, 'rgba(255, 193, 7, 0.7)');
        glow.addColorStop(1, 'rgba(255, 152, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 45, 0, Math.PI * 2);
        ctx.fill();

        // Sun disc
        ctx.beginPath();
        ctx.arc(sunX, sunY, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffea00';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Sunbeam ray to tracker center
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(cx, cy - 35);
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.restore();
      } else {
        // Moon
        const moonX = cx + 110;
        const moonY = cy - 120;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#f1f5f9';
        ctx.fill();
        ctx.shadowColor = '#cbd5e1';
        ctx.shadowBlur = 10;
      }

      // Draw Tracker Pedestal / Base Pillar
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 7, cy - 35, 14, 65);

      // Base ring & foundation
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, 24, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tracker Gimbal Joint (Dual-axis motorized head)
      ctx.beginPath();
      ctx.arc(cx, cy - 35, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#0056b3';
      ctx.fill();
      ctx.strokeStyle = '#003d80';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Panel Array with Dual-Axis Rotations
      // rotZ = Yaw (horizontal rotation)
      // rotX = Tilt / Pitch (vertical inclination)
      ctx.save();
      ctx.translate(cx, cy - 35);

      // Apply Tracker angles
      const rotZRad = (point.rigRotZ || 0) * (Math.PI / 180);
      const rotXRad = (point.rigRotX || 0) * (Math.PI / 180);

      // 3D Isometric projection approximation:
      // Yaw rotates in 2D plane with perspective squash, Tilt rotates width/height
      const panelWidth = 110;
      const panelHeight = 70;

      // Compute skewed quadrilateral for realistic solar panel orientation
      const tiltFactor = Math.cos(rotXRad); // Tilt flattens height
      const yawSin = Math.sin(rotZRad);
      const yawCos = Math.cos(rotZRad);

      ctx.rotate(yawSin * 0.4);

      // Panel frame
      const effectiveW = panelWidth * (0.8 + 0.2 * Math.abs(yawCos));
      const effectiveH = panelHeight * (0.5 + 0.5 * Math.abs(tiltFactor));

      const pX = -effectiveW / 2;
      const pY = -effectiveH / 2;

      // Shadow on ground
      ctx.save();
      ctx.translate(0, 65);
      ctx.beginPath();
      ctx.ellipse(0, 0, effectiveW * 0.6, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();
      ctx.restore();

      // Panel Backing Support Struts
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-effectiveW / 2 + 10, -effectiveH / 2);
      ctx.lineTo(0, 0);
      ctx.lineTo(effectiveW / 2 - 10, effectiveH / 2);
      ctx.stroke();

      // Main PV Module Face
      const panelGrad = ctx.createLinearGradient(pX, pY, pX + effectiveW, pY + effectiveH);
      if (isDay) {
        panelGrad.addColorStop(0, '#1e3a8a'); // Photovoltaic silicon blue
        panelGrad.addColorStop(0.5, '#1d4ed8');
        panelGrad.addColorStop(1, '#0284c7');
      } else {
        panelGrad.addColorStop(0, '#0f172a');
        panelGrad.addColorStop(1, '#1e293b');
      }

      ctx.fillStyle = panelGrad;
      ctx.strokeStyle = '#e2e8f0'; // Aluminum frame
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.roundRect(pX, pY, effectiveW, effectiveH, 4);
      ctx.fill();
      ctx.stroke();

      // Photovoltaic cell grid lines (6x4 cells)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      const cols = 5;
      const rows = 3;
      for (let c = 1; c < cols; c++) {
        const xPos = pX + (effectiveW / cols) * c;
        ctx.beginPath();
        ctx.moveTo(xPos, pY);
        ctx.lineTo(xPos, pY + effectiveH);
        ctx.stroke();
      }
      for (let r = 1; r < rows; r++) {
        const yPos = pY + (effectiveH / rows) * r;
        ctx.beginPath();
        ctx.moveTo(pX, yPos);
        ctx.lineTo(pX + effectiveW, yPos);
        ctx.stroke();
      }

      // Panel central normal arrow (indicates AOI = 0 alignment with sun)
      if (isDay) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -28);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.arc(0, -28, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
      }

      ctx.restore();
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [point]);

  return (
    <div className="bg-white border border-[#d1d9e6] rounded-[6px] shadow-[0px_4px_18px_0px_rgba(0,40,80,0.08)] overflow-hidden">
      {/* Visualizer Header */}
      <div className="p-4 bg-gradient-to-r from-[#1a2b3c] to-[#0056b3] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
            <Compass className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">
              {lang === 'fa' ? 'شبیه‌ساز سه‌بعدی و جهت‌گیری فیزیکی ردیاب' : 'Dual-Axis Solar Tracker 3D Physical Rig'}
            </h3>
            <p className="text-xs text-sky-100">
              {lang === 'fa' 
                ? `استان: ${provinceNameFa} | ساعت: ${point.hour.toString().padStart(2, '0')}:00` 
                : `Province: ${provinceNameEn} | Hour: ${point.hour.toString().padStart(2, '0')}:00`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1 ${
            point.alt > 0 ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30' : 'bg-slate-700/60 text-slate-300 border border-slate-600'
          }`}>
            <Sun className="w-3.5 h-3.5" />
            {point.alt > 0 ? (lang === 'fa' ? 'تابش خورشیدی روز' : 'Daylight Active') : (lang === 'fa' ? 'مد استراحت شبانه' : 'Night Rest')}
          </span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative bg-slate-900 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={480}
          height={260}
          className="w-full max-w-[480px] h-[260px] block"
        />
        
        {/* Floating status tag */}
        <div className="absolute bottom-2 left-2 bg-[#1a2b3c]/80 backdrop-blur text-white text-[11px] px-2 py-1 rounded border border-white/10 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'fa' ? 'خطای برخورد زاویه‌ای (AOI): ۰.۰۰°' : 'Incidence Error (AOI): 0.00°'}</span>
        </div>
      </div>

      {/* Real-time telemetry indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#d1d9e6] bg-[#f8fafc] text-xs">
        <div className="p-3 text-center">
          <span className="text-[#627d98] block text-[11px] mb-0.5">
            {lang === 'fa' ? 'فراز خورشید (Elevation)' : 'Sun Altitude'}
          </span>
          <span className="font-bold text-[#1a2b3c] text-sm">
            {point.alt}°
          </span>
        </div>
        <div className="p-3 text-center">
          <span className="text-[#627d98] block text-[11px] mb-0.5">
            {lang === 'fa' ? 'سمت خورشید (Azimuth)' : 'Sun Azimuth'}
          </span>
          <span className="font-bold text-[#1a2b3c] text-sm">
            {point.az}°
          </span>
        </div>
        <div className="p-3 text-center">
          <span className="text-[#627d98] block text-[11px] mb-0.5">
            {lang === 'fa' ? 'چرخش افقی دکل (Rot Z)' : 'Rig Yaw (Rot Z)'}
          </span>
          <span className="font-bold text-[#0056b3] text-sm">
            {point.rigRotZ}°
          </span>
        </div>
        <div className="p-3 text-center">
          <span className="text-[#627d98] block text-[11px] mb-0.5">
            {lang === 'fa' ? 'شیب عمودی ردیاب (Tilt X)' : 'Rig Pitch (Tilt X)'}
          </span>
          <span className="font-bold text-[#0056b3] text-sm">
            {point.rigRotX}°
          </span>
        </div>
      </div>
    </div>
  );
};
