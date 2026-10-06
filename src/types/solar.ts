export interface HourlySolarPoint {
  hour: number;
  alt: number;
  az: number;
  dni: number;
  dhi: number;
  ghi: number;
  optTilt: number;
  optAz: number;
  rigRotZ: number;
  rigRotX: number;
  aoi: number;
  poaTracked: number;
  poaFixed: number;
  poaHorizontal: number;
  pvKw: number;
  loadKw: number;
  batteryFlowKw: number;
  batterySocKwh: number;
  gridImportKw: number;
  mode: 'night_discharging' | 'day_discharging' | 'day_charging' | 'day_idle' | 'night_idle';
}

export interface OptimalTilt {
  spring: number;
  summer: number;
  autumn: number;
  winter: number;
  annual: number;
}

export interface ProvinceSolarData {
  nameEn: string;
  nameFa: string;
  capitalEn: string;
  capitalFa: string;
  lat: number;
  lon: number;
  optimalTilt: OptimalTilt;
  annualPvMwh: number;
  trackedGainPct: number;
  selfSufficiencyPct: number;
  batteryAutonomyHours: number;
  seasons: {
    spring: HourlySolarPoint[];
    summer: HourlySolarPoint[];
    autumn: HourlySolarPoint[];
    winter: HourlySolarPoint[];
  };
}

export type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';
export type ViewMode = 'index' | 'details';
export type LangMode = 'fa' | 'en';
