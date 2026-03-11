import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Recommendation() {
  const params = useLocalSearchParams();
  const crops = params.crops ? JSON.parse(params.crops as string) : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Crops</Text>

      {crops.length === 0 ? (
        <Text>No crops found for current conditions</Text>
      ) : (
        crops.map((crop: string, index: number) => (
          <View key={index} style={styles.card}>
            <Text style={styles.crop}>{crop}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#0f6e02",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  crop: { color: "white", fontSize: 16, fontWeight: "600" },
});
