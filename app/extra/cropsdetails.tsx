import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { crops } from "../../data/crops";
import { fertilizers } from "../../data/fertilizers";

const BASE_URL = "https://57cb-41-220-233-110.ngrok-free.app/api/live-data/";

export default function CropDetails() {
  const { name, category, score } = useLocalSearchParams();
  const router = useRouter();

  const cropName = name?.toString().toLowerCase();
  const displayName =
    name?.toString().replace(/_/g, " ").toLowerCase() || "crop";

  const cropData = crops.find((c) => c.label.toLowerCase() === cropName);
  const fertilizerData = fertilizers.find(
    (f) => f.label.toLowerCase() === cropName,
  );

  interface ForecastMonth {
    month: string;
    temp: number;
    rainfall: number;
    humidity: number;
  }

  const [forecast, setForecast] = useState<ForecastMonth[]>([]);
  const [loadingForecast, setLoadingForecast] = useState(true);

  const fetchForecast = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      console.log("Backend response:", data);

      if (data.forecast_4_months && Array.isArray(data.forecast_4_months)) {
        setForecast(data.forecast_4_months);
      } else {
        console.log("No 4-month forecast in backend");
        setForecast([]);
      }
    } catch (err) {
      console.log("Forecast fetch error:", err);
    } finally {
      setLoadingForecast(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const getSuitability = () => {
    if (!cropData || forecast.length === 0) return null;

    let scoreCount = 0;

    forecast.forEach((month) => {
      const tempOk =
        month.temp >= cropData.temp_min && month.temp <= cropData.temp_max;

      const rainOk =
        month.rainfall >= cropData.rainfall_min &&
        month.rainfall <= cropData.rainfall_max;

      const humidityOk =
        month.humidity >= cropData.humidity_min &&
        month.humidity <= cropData.humidity_max;

      if (tempOk) scoreCount += 1;
      if (rainOk) scoreCount += 1;
      if (humidityOk) scoreCount += 1;
    });

    const maxScore = forecast.length * 3;
    const percentage = (scoreCount / maxScore) * 100;

    if (percentage >= 75) return { status: "Excellent", value: percentage };
    if (percentage >= 50) return { status: "Moderate", value: percentage };
    return { status: "Poor", value: percentage };
  };

  const getWarning = () => {
    if (!suitability) return null;

    if (suitability.value >= 75) {
      return "✅ Conditions are highly favorable. You can confidently plant this crop.";
    }

    if (suitability.value >= 50) {
      return "⚠️ Conditions are moderately suitable. Consider irrigation or soil improvement.";
    }

    return "❌ Conditions are poor. Avoid planting or use greenhouse/controlled farming.";
  };

  const getWeatherQuote = () => {
    if (!forecast.length) return "";

    const avgTemp =
      forecast.reduce((sum, m) => sum + m.temp, 0) / forecast.length;

    const avgRain =
      forecast.reduce((sum, m) => sum + m.rainfall, 0) / forecast.length;

    if (avgRain > 120) {
      return "🌧 Expect a wet season ahead — ideal for water-loving crops.";
    }

    if (avgTemp > 28) {
      return "☀️ A hot season is coming — irrigation and mulching will be key.";
    }

    return "🌤 Balanced weather ahead — stable conditions for most crops.";
  };

  const getAdvice = () => {
    if (!suitability) return [];

    if (suitability.value >= 75) {
      return [
        "Plant early to maximize yield.",
        "Use recommended fertilizers consistently.",
        "Monitor pests due to favorable growth conditions.",
      ];
    }

    if (suitability.value >= 50) {
      return [
        "Consider irrigation during dry periods.",
        "Use organic manure to improve soil fertility.",
        "Select drought-resistant crop varieties.",
      ];
    }

    return [
      "Delay planting until conditions improve.",
      "Use greenhouse or irrigation systems.",
      "Consider alternative crops better suited to conditions.",
    ];
  };

  const getInsights = () => {
    if (!forecast.length) return [];

    return [
      "Temperature affects crop growth rate and maturity.",
      "Rainfall determines water availability and irrigation needs.",
      "Humidity influences disease and pest prevalence.",
      "Soil pH affects nutrient absorption efficiency.",
    ];
  };

  const suitability = getSuitability();

  const getSeasonLabel = () => {
    if (!forecast.length) return null;

    const months = forecast.map((m) => m.month.toLowerCase());

    const hasLongRains =
      months.includes("march") ||
      months.includes("april") ||
      months.includes("may");

    const hasShortRains =
      months.includes("october") ||
      months.includes("november") ||
      months.includes("december");

    if (hasLongRains) {
      return "🌧️ Long Rains Season (March–May)";
    }

    if (hasShortRains) {
      return "🌱 Short Rains Season (October–December)";
    }

    return "☀️ Dry Season";
  };

  const getMonthRange = () => {
    if (!forecast.length) return "";

    const first = forecast[0].month;
    const last = forecast[forecast.length - 1].month;

    return `${first} – ${last}`;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.hello}>Crop Details</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{displayName}</Text>
          <Text style={styles.category}>{category}</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Suitability Score</Text>
            <Text style={styles.score}>
              {suitability ? `${suitability.value.toFixed(0)}%` : `${score}%`}
            </Text>
          </View>

          <View style={styles.commodityCard}>
            <Text style={styles.commodityCard}>
              <Text style={styles.cardTitle}>
                Seasonal Forecast (Next 4 Months)
              </Text>
            </Text>

            {loadingForecast ? (
              <Text>Loading forecast...</Text>
            ) : forecast.length === 0 ? (
              <Text style={{ color: "#777" }}>Forecast not available</Text>
            ) : (
              <>
                {forecast.map((month, index) => (
                  <View key={index} style={{ marginTop: 8 }}>
                    <Text style={styles.subTitle}>{month.month}</Text>
                    <Text style={styles.text}>Temp: {month.temp}°C</Text>
                    <Text style={styles.text}>
                      Rainfall: {month.rainfall} mm
                    </Text>
                    <Text style={styles.text}>Humidity: {month.humidity}%</Text>
                  </View>
                ))}

                {suitability && (
                  <Text style={styles.suitability}>
                    Suitability: {suitability.status} (
                    {suitability.value.toFixed(0)}%)
                  </Text>
                )}
              </>
            )}
          </View>

          {loadingForecast ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🌦 Forecasting</Text>

              {loadingForecast ? (
                <>
                  <Text style={styles.text}>
                    Forecasting for the season... please wait
                  </Text>
                  <ActivityIndicator size="small" color="#297904" />
                </>
              ) : forecast.length === 0 ? (
                <Text style={styles.text}>Forecast not available</Text>
              ) : (
                <>
                  <Text
                    style={[
                      styles.text,
                      { fontWeight: "700", color: "#297904" },
                    ]}
                  >
                    {getSeasonLabel()}
                  </Text>

                  <Text style={styles.text}>
                    Forecast Period: {getMonthRange()}
                  </Text>
                </>
              )}
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>⚠️ Advisory</Text>
                <Text style={styles.text}>
                  {getWarning() || "No advisory available"}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>🌦 Seasonal Insight</Text>
                <Text style={styles.text}>
                  {getWeatherQuote() || "No insight available"}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>🌱 Farming Advice</Text>

                {getAdvice().length > 0 ? (
                  getAdvice().map((tip, i) => (
                    <Text key={i} style={styles.text}>
                      • {tip}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.text}>No advice available</Text>
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>📘 Awareness</Text>

                {getInsights().length > 0 ? (
                  getInsights().map((item, i) => (
                    <Text key={i} style={styles.text}>
                      • {item}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.text}>No insights available</Text>
                )}
              </View>
            </>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fertilizer</Text>

            {fertilizerData ? (
              fertilizerData.fertilizers.basal.map((f, i) => (
                <Text key={i} style={styles.text}>
                  • {f}
                </Text>
              ))
            ) : (
              <Text>No fertilizer data</Text>
            )}
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F3E8" },

  header: {
    backgroundColor: "#297904",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: { marginRight: 15 },

  hello: { fontSize: 20, color: "#fff", fontWeight: "700" },

  scrollContent: { padding: 10 },

  title: { fontSize: 24, fontWeight: "bold" },

  category: { color: "#297904", marginBottom: 10 },

  card: {
    backgroundColor: "#def3ea",
    padding: 10,
    borderRadius: 15,
    marginTop: 15,
  },

  commodityCard: {
    backgroundColor: "#def3ea",
    padding: 5,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: "100%",
    alignSelf: "center",
    marginBottom: 20,
  },

  cardTitle: { fontWeight: "700" },

  text: { marginTop: 5, padding: 5 },

  score: { fontSize: 22, fontWeight: "bold", color: "#297904" },

  subTitle: { fontWeight: "700", marginTop: 5 },

  suitability: {
    padding: 5,
    marginTop: 10,
    fontWeight: "bold",
    color: "#297904",
    alignSelf: "center",
  },
});
