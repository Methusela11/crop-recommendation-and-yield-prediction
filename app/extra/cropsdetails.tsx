import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
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
        {/* HERO */}
        <ImageBackground source={{ uri: CROP_BG }} style={styles.hero}>
          <View style={styles.heroOverlay}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>

            <Text style={styles.heroTitle}>{displayName}</Text>
            <Text style={styles.heroSub}>{category}</Text>
          </View>
        </ImageBackground>

        <ScrollView style={styles.scroll}>
          {/* SUITABILITY */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>🌱 Suitability</Text>

            <Text style={styles.bigScore}>
              {suitability ? `${suitability.value.toFixed(0)}%` : `${score}%`}
            </Text>

            <Text style={styles.suitabilityStatus}>{suitability?.status}</Text>
          </View>

          {/* FORECAST */}
          <Text style={styles.sectionTitle}>🌦 Seasonal Forecast</Text>

          <View style={{ paddingHorizontal: 16 }}>
            {loadingForecast ? (
              <ActivityIndicator size="large" color="#2E7D32" />
            ) : (
              forecast.map((month, index) => (
                <View key={index} style={styles.calBlock}>
                  <Text style={styles.calSeasonLabel}>{month.month}</Text>

                  <Text style={styles.calValue}>🌡 Temp: {month.temp}°C</Text>
                  <Text style={styles.calValue}>
                    🌧 Rainfall: {month.rainfall} mm
                  </Text>
                  <Text style={styles.calValue}>
                    💧 Humidity: {month.humidity}%
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* ADVISORY */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>⚠️ Advisory</Text>
            <Text style={styles.soilDesc}>{getWarning()}</Text>
          </View>

          {/* INSIGHT */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>🌤 Seasonal Insight</Text>
            <Text style={styles.soilDesc}>{getWeatherQuote()}</Text>
          </View>

          {/* FARMING ADVICE */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>🌱 Farming Advice</Text>

            {getAdvice().map((tip, i) => (
              <Text key={i} style={styles.listItem}>
                • {tip}
              </Text>
            ))}
          </View>

          {/* AWARENESS */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>📘 Awareness</Text>

            {getInsights().map((item, i) => (
              <Text key={i} style={styles.listItem}>
                • {item}
              </Text>
            ))}
          </View>

          {/* FERTILIZER */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>🧪 Fertilizer Guide</Text>

            {fertilizerData ? (
              fertilizerData.fertilizers.basal.map((f, i) => (
                <View key={i} style={styles.fertCard}>
                  <Text style={styles.fertName}>{f}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.soilDesc}>No fertilizer data</Text>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

const CROP_BG =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  hero: { height: 180, width: "100%" },

  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: 16,
  },

  heroTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  heroSub: { fontSize: 13, color: "#ddd" },

  scroll: { flex: 1 },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B5E20",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  infoCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  bigScore: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  suitabilityStatus: {
    fontSize: 14,
    fontWeight: "700",
    color: "#388E3C",
    marginTop: 4,
  },

  soilDesc: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },

  listItem: {
    fontSize: 13,
    color: "#555",
    marginVertical: 3,
  },

  calBlock: {
    backgroundColor: "#F1F8E9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  calSeasonLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 6,
  },

  calValue: {
    fontSize: 13,
    color: "#555",
  },

  fertCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#F57C00",
  },

  fertName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
});
