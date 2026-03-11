import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { recommendCrops } from "../../utils/cropLogic";

export default function Recommendation() {
  const [crops, setCrops] = useState<string[] | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendation();
  }, []);

  const getRecommendation = async () => {
    setLoading(true);

    // 1️⃣ Request device location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permission denied");
      setLoading(false);
      return;
    }

    // 2️⃣ Get device GPS location
    const location = await Location.getCurrentPositionAsync({});
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;

    // 3️⃣ Reverse geocode to get full address
    const geo = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });

    if (geo.length > 0) {
      const loc = geo[0];
      const fullAddress = `${loc.name || ""}, ${loc.street || ""}, ${loc.subregion || ""}, ${loc.city || ""}, ${loc.region || ""}, ${loc.postalCode || ""}, ${loc.country || ""}`;
      setAddress(fullAddress);
    }

    try {
      // 4️⃣ Fetch real weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation`,
      );
      const weatherData = await weatherRes.json();

      const temperature = weatherData.current_weather.temperature;
      const humidity = weatherData.hourly.relative_humidity_2m[0]; // current hour
      const rainfall = weatherData.hourly.precipitation[0]; // current hour

      console.log("Weather:", { temperature, humidity, rainfall });

      // 5️⃣ Get prioritized crops
      const recommended = recommendCrops(temperature, humidity, rainfall);
      setCrops(recommended);
    } catch (error) {
      alert("Failed to fetch weather data");
      console.error(error);
    }

    setLoading(false);
  };

  if (loading || !crops) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.title}>
          Analyzing soil, weather, and location...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Crops</Text>
      <Text style={styles.addressTitle}>My location address is:</Text>
      <Text style={styles.address}>{address}</Text>

      {crops.map((crop, i) => (
        <Text key={i} style={styles.crop}>
          {i + 1}. {crop}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  title: { fontSize: 24, marginBottom: 10, color: "white" },
  addressTitle: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
    color: "white",
  },
  address: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "gray",
  },
  crop: { fontSize: 28, fontWeight: "bold", color: "green", marginBottom: 5 },
});
