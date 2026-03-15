import dataset from "../data/crop_dataset.json";

export const recommendCrops = (
  temperature: number,
  humidity: number,
  rainfall: number,
): string[] => {
  // Estimate soil nutrients (simple approximation)
  const estimatedN = humidity > 60 ? 80 : 40;
  const estimatedP = rainfall > 100 ? 60 : 40;
  const estimatedK = temperature > 25 ? 50 : 30;
  const estimatedPH = 6.5;

  const scores: { crop: string; score: number }[] = [];

  dataset.forEach((row: any) => {
    const score =
      Math.abs(row.N - estimatedN) +
      Math.abs(row.P - estimatedP) +
      Math.abs(row.K - estimatedK) +
      Math.abs(row.temperature - temperature) +
      Math.abs(row.humidity - humidity) +
      Math.abs(row.ph - estimatedPH) +
      Math.abs(row.rainfall - rainfall);

    scores.push({
      crop: row.label,
      score: score,
    });
  });

  // Sort by best match
  scores.sort((a, b) => a.score - b.score);

  // Remove duplicates and return top crops
  const unique = [...new Set(scores.map((s) => s.crop))];

  return unique.slice(0, 5);
};
