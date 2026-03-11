import dataset from "../data/crop_dataset.json";

export const recommendCrops = (
  temperature: number,
  humidity: number,
  rainfall: number,
): string[] => {
  const matches: Record<string, boolean> = {};

  dataset.forEach((row: any) => {
    const temp = parseFloat(row.temperature);
    const hum = parseFloat(row.humidity);
    const rain = parseFloat(row.rainfall);
    const crop = row.label;

    // Check if current weather is close to crop's preferred range
    if (
      Math.abs(temp - temperature) < 5 &&
      Math.abs(hum - humidity) < 15 &&
      Math.abs(rain - rainfall) < 50
    ) {
      matches[crop] = true;
    }
  });

  return Object.keys(matches);
};

