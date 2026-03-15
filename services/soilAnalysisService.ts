import soilData from "../data/soil_dataset.json";

export const analyzeSoil = (temperature: number, humidity: number) => {
  const match = soilData.find((soil) => {
    return (
      humidity >= soil.humidity_range[0] &&
      humidity <= soil.humidity_range[1] &&
      temperature >= soil.temperature_range[0] &&
      temperature <= soil.temperature_range[1]
    );
  });

  return match || soilData[0];
};

