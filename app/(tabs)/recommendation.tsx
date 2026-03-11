import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Recommendation() {
  const [crop, setCrop] = useState<string | null>(null);

  useEffect(() => {
    getRecommendation();
  }, []);

  const getRecommendation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Location permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    const lat = location.coords.latitude;
    const lon = location.coords.longitude;

    console.log("Location:", lat, lon);

    // Temporary mock result
    setTimeout(() => {
      setCrop("Maize");
    }, 2000);
  };

  if (!crop) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Analyzing soil and weather...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Crop</Text>
      <Text style={styles.crop}>{crop}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    marginBottom: 20,
  },

  crop: {
    fontSize: 32,
    fontWeight: "bold",
    color: "green",
  },
});
