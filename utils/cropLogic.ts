// utils/cropLogic.ts

interface Crop {
  name: string;
  idealTemp: [number, number]; // °C
  idealHumidity: [number, number]; // %
  idealRainfall: [number, number]; // mm
}

// Define crops and ideal conditions
const crops: Crop[] = [
  {
    name: "Maize",
    idealTemp: [20, 30],
    idealHumidity: [50, 80],
    idealRainfall: [50, 200],
  },
  {
    name: "Rice",
    idealTemp: [25, 35],
    idealHumidity: [70, 100],
    idealRainfall: [100, 300],
  },
  {
    name: "Beans",
    idealTemp: [18, 28],
    idealHumidity: [40, 70],
    idealRainfall: [30, 100],
  },
  {
    name: "Sorghum",
    idealTemp: [28, 38],
    idealHumidity: [30, 60],
    idealRainfall: [20, 80],
  },
  {
    name: "Wheat",
    idealTemp: [15, 25],
    idealHumidity: [40, 70],
    idealRainfall: [20, 80],
  },
];

// Function to calculate score
export function recommendCrops(
  temp: number,
  humidity: number,
  rainfall: number,
): string[] {
  const scored = crops.map((crop) => {
    let score = 0;
    if (temp >= crop.idealTemp[0] && temp <= crop.idealTemp[1]) score += 1;
    if (humidity >= crop.idealHumidity[0] && humidity <= crop.idealHumidity[1])
      score += 1;
    if (rainfall >= crop.idealRainfall[0] && rainfall <= crop.idealRainfall[1])
      score += 1;
    return { name: crop.name, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((c) => c.name);
}
