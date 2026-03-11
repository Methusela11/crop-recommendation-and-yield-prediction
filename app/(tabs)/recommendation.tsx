import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { recommendCrops } from "../../utils/cropLogic";

export default function Recommendation() {
  const [crops, setCrops] = useState<string[] | null>(null);
  const [locationName, setLocationName] = useState("");

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

    // Reverse geocode location
    const geo = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });
    if (geo.length > 0) setLocationName(`${geo[0].city}, ${geo[0].country}`);

    // Fetch weather data
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
    );
    const weatherData = await weatherRes.json();
    const temperature = weatherData.current_weather.temperature;

    // You can enhance this with a real humidity & rainfall API or dataset
    const humidity = 70; // mock
    const rainfall = 120; // mock

    const recommended = recommendCrops(temperature, humidity, rainfall);
    setCrops(recommended);
  };

  if (!crops) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Analyzing soil, weather and location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Crops</Text>
      <Text style={styles.location}>{locationName}</Text>

      {crops.map((crop, index) => (
        <Text key={index} style={styles.crop}>
          {index + 1}. {crop}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 10 },
  location: { fontSize: 16, marginBottom: 20, color: "gray" },
  crop: { fontSize: 28, fontWeight: "bold", color: "green", marginBottom: 5 },
});
