export function computeLevel(scorePct: number, grade: number | string): string {
  if (typeof grade === 'string' && grade === 'EESH') {
    // EESH specific level bands
    if (scorePct < 30) return 'L1';
    if (scorePct < 60) return 'L2';
    if (scorePct < 80) return 'L3';
    return 'L4';
  }
  
  const gradeNum = typeof grade === 'string' ? parseInt(grade) : grade;
  
  // Grade-specific level bands
  if (gradeNum <= 8) {
    if (scorePct < 40) return 'L1';
    if (scorePct < 70) return 'L2';
    return 'L3';
  } else if (gradeNum <= 10) {
    if (scorePct < 35) return 'L1';
    if (scorePct < 65) return 'L2';
    if (scorePct < 85) return 'L3';
    return 'L4';
  } else {
    // Grade 11-12
    if (scorePct < 30) return 'L1';
    if (scorePct < 55) return 'L2';
    if (scorePct < 75) return 'L3';
    if (scorePct < 90) return 'L4';
    return 'L5';
  }
}

export function pickWeakTopics(
  topicStats: Record<string, { correct: number; total: number }>, 
  k: number = 3
): string[] {
  return Object.entries(topicStats)
    .map(([topic, stats]) => [topic, stats.correct / (stats.total || 1)] as const)
    .sort((a, b) => a[1] - b[1])
    .slice(0, k)
    .map(([topic]) => topic);
}

export function generatePlacementTest(grade: string, questionCount: number = 20) {
  // Distribution: 40% easy (diff 1-2), 40% medium (3), 20% hard (4-5)
  const easyCount = Math.floor(questionCount * 0.4);
  const mediumCount = Math.floor(questionCount * 0.4);
  const hardCount = questionCount - easyCount - mediumCount;
  
  return {
    easyCount,
    mediumCount,
    hardCount,
    totalCount: questionCount
  };
}

export function calculateTopicMastery(
  topicStats: Record<string, { correct: number; total: number }>
): Record<string, number> {
  const mastery: Record<string, number> = {};
  
  for (const [topic, stats] of Object.entries(topicStats)) {
    mastery[topic] = Math.min(1, Math.max(0, stats.correct / (stats.total || 1)));
  }
  
  return mastery;
}
