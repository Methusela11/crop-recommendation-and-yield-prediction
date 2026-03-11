// utils/cropLogic.ts

interface Crop {
  name: string;
  idealTemp: [number, number]; // min, max °C
  idealHumidity: [number, number]; // min, max %
  idealRainfall: [number, number]; // min, max mm
}

// Define your crops and ideal conditions
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

// Function to calculate score for each crop
export function recommendCrops(
  temp: number,
  humidity: number,
  rainfall: number,
): string[] {
  const scoredCrops = crops.map((crop) => {
    let score = 0;

    // Temperature score
    if (temp >= crop.idealTemp[0] && temp <= crop.idealTemp[1]) score += 1;

    // Humidity score
    if (humidity >= crop.idealHumidity[0] && humidity <= crop.idealHumidity[1])
      score += 1;

    // Rainfall score
    if (rainfall >= crop.idealRainfall[0] && rainfall <= crop.idealRainfall[1])
      score += 1;

    return { name: crop.name, score };
  });

  // Sort by score descending (best crops first)
  scoredCrops.sort((a, b) => b.score - a.score);

  // Return array of crop names in order of suitability
  return scoredCrops.map((c) => c.name);
}
