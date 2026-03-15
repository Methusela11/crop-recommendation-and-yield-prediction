import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { analyzeSoil } from "../../services/soilAnalysisService";

export default function SoilAnalysis() {
  const [soil, setSoil] = useState<any>(null);

  useEffect(() => {
    const result = analyzeSoil(26, 65); // example values
    setSoil(result);
  }, []);

  if (!soil) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soil Analysis</Text>

      <Text style={styles.info}>Soil Type: {soil.soil_type}</Text>
      <Text style={styles.info}>pH: {soil.ph}</Text>
      <Text style={styles.info}>Nitrogen: {soil.nitrogen}</Text>

      <Text style={styles.cropTitle}>Best Crops</Text>

      {soil.crops.map((crop: string, index: number) => (
        <Text key={index} style={styles.crop}>
          🌱 {crop}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: "white",
    marginBottom: 8,
  },
  cropTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginTop: 20,
  },
  crop: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
});
