import * as Location from "expo-location";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Forecast = {
  month: string;
  temp: number;
  rainfall: number;
  humidity: number;
};

type WeatherData = {
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  weather_icon: string;
  soil_ph: number;
  soil_temperature: number;
  city: string;
  avg_temp_month: number;
  rainfall_mm_per_month: number;
  forecast_4_months: Forecast[];
  recommended_crops: { label: string; percentage: number }[];
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission denied!");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      try {
        const res = await fetch(
          `https://82c4-41-220-233-110.ngrok-free.app/api/live-data?lat=${lat}&lon=${lon}`,
        );

        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setWeather(data);
        } catch (jsonErr) {
          console.error("Failed to parse JSON:", text);
          console.error("Failed to parse JSON:", jsonErr);
          alert("Server did not return JSON. Check backend or ngrok URL.");
        }
      } catch (err) {
        console.error("Network error:", err);
        alert("Network request failed. Is your server running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#297904" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load weather data.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.hello}>Weather Analysis </Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.weatherCard}>
            <Text style={styles.hello}>{weather.city}</Text>
            {weather.weather_icon && (
              <Image
                source={{ uri: weather.weather_icon }}
                style={styles.weatherIcon}
              />
            )}
            <Text style={styles.temp}>{Math.round(weather.temperature)}°C</Text>
            <Text style={styles.details}>
              Humidity: {weather.humidity}% | Wind: {weather.wind_speed} km/h |
              Precipitation: {weather.precipitation} mm
            </Text>
            <Text style={styles.hello}>{weather.city}</Text>
          </View>

          {/* 4-Month Forecast */}
          <Text style={[styles.sectiontitle, { marginTop: 20 }]}>
            4-Month Forecast
          </Text>
          {weather.forecast_4_months.map((f, idx) => (
            <View key={idx} style={styles.forecastCard}>
              <Text style={styles.forecastMonth}>{f.month}</Text>
              <Text>Temp: {f.temp}°C</Text>
              <Text>Rainfall: {f.rainfall} mm</Text>
              <Text>Humidity: {f.humidity}%</Text>
            </View>
          ))}

          {/* Soil Analysis */}
          <Text style={[styles.sectiontitle, { marginTop: 20 }]}>
            Soil Analysis
          </Text>
          <Text>Soil pH: {weather.soil_ph}</Text>
          <Text>Soil Temp: {weather.soil_temperature}°C</Text>

          {/* Recommended Crops */}
          <Text style={[styles.sectiontitle, { marginTop: 20 }]}>
            Top Recommended Crops
          </Text>
          {weather.recommended_crops.map((c, idx) => (
            <Text key={idx}>
              {c.label} - {c.percentage}%
            </Text>
          ))}
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  hello: { fontSize: 20, color: "#fff", fontWeight: "700" },
  scrollContent: { padding: 20 },
  sectiontitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  weatherCard: {
    backgroundColor: "#e3f2c1",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  weatherIcon: { width: 80, height: 80 },
  temp: { fontSize: 36, fontWeight: "700", marginVertical: 5 },
  details: { fontSize: 12, color: "#555" },
  forecastCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  forecastMonth: { fontWeight: "600", marginBottom: 5 },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
});
