import predictionRules from '@/config/prediction_rules.json';
import { ProvinceSummary, PredictionResult, RiskCategory } from '@/types';

export interface SimulationOptions {
  quotaChangePercent?: number; // e.g., -20, 0, +20
  competitionMultiplier?: number; // e.g., 0.9, 1.0, 1.1
}

/**
 * Calculates adjusted baseline target score based on simulation options.
 */
export function calculateAdjustedScore(
  baseScore: number,
  options: SimulationOptions = {}
): number {
  const { quotaChangePercent = 0, competitionMultiplier = 1.0 } = options;
  
  // Kontenjan artarsa (%+20) taban puan düşme eğilimindedir.
  // Her %10 kontenjan artışı puanı ~0.25 puan aşağı çekebilir.
  const quotaShift = (quotaChangePercent / 10) * -0.25;
  
  // Rekabet çarpanı (örneğin 1.05 = aday puan yığılması %5 yüksek)
  // Taban puanı yukarı iter.
  const competitionShift = (competitionMultiplier - 1.0) * 8.0;
  
  return Number((baseScore + quotaShift + competitionShift).toFixed(5));
}

/**
 * Classifies a user's KPSS score against a province's historical data.
 */
export function predictPlacement(
  userScore: number,
  summary: ProvinceSummary,
  options: SimulationOptions = {}
): PredictionResult {
  const baseScore = summary.latest_min_score || summary.overall_min_score;
  const targetScore = calculateAdjustedScore(baseScore, options);
  const diff = Number((userScore - targetScore).toFixed(5));

  const { safe_margin, possible_lower_margin, risky_lower_margin } = predictionRules.thresholds;
  const labels = predictionRules.labels;

  let category: RiskCategory = 'unlikely';

  if (diff >= safe_margin) {
    category = 'safe';
  } else if (diff >= -possible_lower_margin) {
    category = 'possible';
  } else if (diff >= -risky_lower_margin) {
    category = 'risky';
  } else {
    category = 'unlikely';
  }

  const labelMeta = labels[category];

  // Determine trend by comparing latest period with previous period
  const periods = Object.keys(summary.periods).sort();
  let scoreTrend: 'up' | 'down' | 'stable' = 'stable';
  if (periods.length >= 2) {
    const lastP = summary.periods[periods[periods.length - 1]];
    const prevP = summary.periods[periods[periods.length - 2]];
    if (lastP && prevP) {
      const pDiff = lastP.min_score - prevP.min_score;
      if (pDiff > 0.4) scoreTrend = 'up';
      else if (pDiff < -0.4) scoreTrend = 'down';
    }
  }

  const latestPKey = periods[periods.length - 1];
  const latestQuota = latestPKey ? summary.periods[latestPKey]?.total_quota || 0 : 0;

  return {
    il: summary.il,
    userScore,
    targetScore,
    margin: safe_margin,
    category,
    categoryTitle: labelMeta.title,
    categoryBadgeColor: labelMeta.badge_color,
    mapColor: labelMeta.map_color,
    description: labelMeta.description,
    latestQuota,
    totalQuota: summary.total_quota,
    scoreDifference: diff,
    scoreTrend,
    periodsData: summary.periods
  };
}

/**
 * Predicts all provinces and returns sorted by category priority & score closeness.
 */
export function predictAllProvinces(
  userScore: number,
  provinces: ProvinceSummary[],
  options: SimulationOptions = {}
): PredictionResult[] {
  const results = provinces.map(p => predictPlacement(userScore, p, options));

  const priorityOrder: Record<RiskCategory, number> = {
    safe: 1,
    possible: 2,
    risky: 3,
    unlikely: 4
  };

  return results.sort((a, b) => {
    if (priorityOrder[a.category] !== priorityOrder[b.category]) {
      return priorityOrder[a.category] - priorityOrder[b.category];
    }
    // Closeness to score
    return Math.abs(a.scoreDifference) - Math.abs(b.scoreDifference);
  });
}

/**
 * Evaluates the balance of a preference list.
 */
export function analyzePreferenceBalance(items: { category: RiskCategory }[]) {
  if (items.length === 0) {
    return {
      score: 0,
      status: 'empty',
      message: 'Listenizde henüz tercih bulunmuyor.',
      counts: { safe: 0, possible: 0, risky: 0, unlikely: 0 }
    };
  }

  const counts = {
    safe: items.filter(i => i.category === 'safe').length,
    possible: items.filter(i => i.category === 'possible').length,
    risky: items.filter(i => i.category === 'risky').length,
    unlikely: items.filter(i => i.category === 'unlikely').length
  };

  const total = items.length;
  const safePercent = (counts.safe / total) * 100;
  const riskyPercent = ((counts.risky + counts.unlikely) / total) * 100;

  if (counts.safe === 0 && total >= 3) {
    return {
      score: 35,
      status: 'high_risk',
      message: 'Listenizde hiç Güvenli tercih yok! Açıkta kalmamak için en az 3-5 adet taban puanınızın altında Güvenli il eklemeniz şiddetle tavsiye edilir.',
      counts
    };
  }

  if (riskyPercent > 70) {
    return {
      score: 50,
      status: 'risky',
      message: 'Listenizin büyük kısmı Riskli ve Düşük İhtimal tercihlerden oluşuyor. Listenin sonlarına Güvenli ve Olası iller ekleyerek açıkta kalma riskini azaltabilirsiniz.',
      counts
    };
  }

  if (safePercent > 80 && total >= 5) {
    return {
      score: 75,
      status: 'too_safe',
      message: 'Listeniz ağırlıklı olarak Güvenli illerden oluşuyor. İsterseniz üst sıralara daha çok arzu ettiğiniz Olası veya Riskli birkaç ili ekleyebilirsiniz.',
      counts
    };
  }

  return {
    score: 95,
    status: 'balanced',
    message: 'Tebrikler! Tercih listeniz Güvenli, Olası ve Riskli tercihler arasında sağlıklı ve dengeli bir dağılıma sahiptir.',
    counts
  };
}
