export interface PlacementRecord {
  yil: number;
  donem: string;
  osym_kodu: string;
  sb_kodu?: string;
  kadro_unvan: string;
  ogrenim_duzeyi: string;
  il: string;
  kurum_adi: string;
  teskilat: string;
  kontenjan: number;
  yerlesen: number;
  bos_kalan: number;
  en_kucuk_puan: number;
  en_buyuk_puan: number;
  kontenjan_turu: string;
  nitelik_kodlari?: string[];
  aciklama?: string;
  kaynak_kilavuz: string;
  kaynak_sonuc: string;
}

export interface PeriodStats {
  donem: string;
  year: number;
  total_quota: number;
  min_score: number;
  max_score: number;
  placements_count: number;
  general_quota: number;
  special_quota: number;
}

export interface ProvinceSummary {
  il: string;
  periods: Record<string, PeriodStats>;
  total_quota: number;
  overall_min_score: number;
  overall_max_score: number;
  latest_min_score: number;
  latest_period: string;
  institutions_count?: number;
}

export type RiskCategory = 'safe' | 'possible' | 'risky' | 'unlikely';

export interface PredictionResult {
  il: string;
  userScore: number;
  targetScore: number;
  margin: number;
  category: RiskCategory;
  categoryTitle: string;
  categoryBadgeColor: string;
  mapColor: string;
  description: string;
  latestQuota: number;
  totalQuota: number;
  scoreDifference: number; // userScore - targetScore
  scoreTrend: 'up' | 'down' | 'stable';
  periodsData: Record<string, PeriodStats>;
}

export interface PreferenceItem {
  id: string; // unique item id
  order: number;
  il: string;
  kurum_adi?: string;
  osym_kodu?: string;
  kontenjan?: number;
  totalQuota?: number;
  lastMinScore: number;
  category: RiskCategory;
  categoryTitle: string;
  badgeColor: string;
  notes?: string;
  addedAt: string;
}

export interface CityComparisonNote {
  il: string;
  kiraTahmini: string;
  nobetYogunlugu: string;
  yakinlikNotu: string;
  ozelNotlar: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  required: boolean;
  description: string;
  tip?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date_str: string;
  status: 'completed' | 'active' | 'pending';
  description: string;
}
