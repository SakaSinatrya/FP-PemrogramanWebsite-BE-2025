// Temporary in-memory storage (akan diganti dengan database nanti)
const scores: Array<{ id: string; score: number; created_at: Date }> = [];

export class WhackARoboService {
  static getTopScores() {
    // Sort by score descending and take top 10
    const topScores = [...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => ({
        id: s.id,
        score: s.score,
        createdAt: s.created_at.toISOString(),
      }));

    return topScores;
  }

  static createScore(score: number) {
    const newScore = {
      id: `score_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      score,
      created_at: new Date(),
    };

    scores.push(newScore);

    return {
      id: newScore.id,
      score: newScore.score,
      createdAt: newScore.created_at.toISOString(),
    };
  }
}
