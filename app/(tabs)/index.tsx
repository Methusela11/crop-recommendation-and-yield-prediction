import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { recommendCrops } from "../../services/cropDatasetService";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [address, setAddress] = useState<string>("Fetching location...");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLocationAndWeather(); // refresh location & weather
    setRefreshing(false);
  };

  const [weather, setWeather] = useState<{
    temperature: number;
    condition: string;
    humidity: number;
    soilMoisture: string;
    precipitation: number;
  } | null>(null);

  const [recommendedCrops, setRecommendedCrops] = useState<string[]>([]);

  const router = useRouter();

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  // Calculate soil moisture based on humidity and precipitation
  const getSoilMoisture = (humidity: number, precipitation: number) => {
    if (humidity >= 70 || precipitation >= 5) return "High";
    if (humidity >= 40 || precipitation >= 1) return "Moderate";
    return "Low";
  };

  const fetchLocationAndWeather = async () => {
    if (loadingLocation) return;
    setLoadingLocation(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setAddress("Location permission denied");
      setLoadingLocation(false);
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({});

      let fullAddress = "";

      try {
        // Try Expo reverse geocode first
        const geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (geo.length > 0) {
          const locData = geo[0];
          fullAddress = `${locData.city || ""}, ${locData.region || ""}, ${locData.country || ""}`;
        }
      } catch (e) {
        console.log("Expo reverse geocode failed");
      }

      // Fallback using OpenStreetMap
      if (!fullAddress) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.coords.latitude}&lon=${loc.coords.longitude}`,
        );

        const data = await res.json();

        fullAddress = `${data.address.city || data.address.town || data.address.village || ""}, ${data.address.country || ""}`;
      }

      setAddress(fullAddress || "Unknown location");

      // WEATHER API
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation`,
      );

      const weatherData = await weatherRes.json();

      const temperature = weatherData.current_weather.temperature;
      const conditionCode = weatherData.current_weather.weathercode;
      const humidity = weatherData.hourly.relative_humidity_2m[0];
      const precipitation = weatherData.hourly.precipitation[0];

      setWeather({
        temperature,
        condition: mapWeatherCodeToText(conditionCode),
        humidity,
        soilMoisture: getSoilMoisture(humidity, precipitation),
        precipitation,
      });
      // 🔹 Get recommended crops from JSON dataset
      const crops = recommendCrops(temperature, humidity, precipitation);
      setRecommendedCrops(crops);
    } catch (err) {
      console.error(err);
      setAddress("Failed to fetch location/weather");
    }

    setLoadingLocation(false);
  };

  const mapWeatherCodeToText = (code: number) => {
    switch (code) {
      case 0:
        return "Clear";
      case 1:
      case 2:
        return "Partly Cloudy";
      case 3:
        return "Cloudy";
      case 45:
      case 48:
        return "Fog";
      case 51:
      case 53:
      case 55:
        return "Drizzle";
      case 61:
      case 63:
      case 65:
        return "Rain";
      case 71:
      case 73:
      case 75:
        return "Snow";
      case 95:
      case 96:
      case 99:
        return "Thunderstorm";
      default:
        return "Cloudy";
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDarkMode ? "#fff" : "#000"} // spinner color
        />
      }
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#272626" : "#b6ac8c" },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.location}>
            <TouchableOpacity onPress={fetchLocationAndWeather}>
              <Ionicons name="location" size={25} color="#E74C3C" />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 6,
              }}
            >
              {loadingLocation && (
                <ActivityIndicator
                  size="small"
                  color={isDarkMode ? "#fff" : "#000"}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={[
                  styles.locationText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {loadingLocation ? "Fetching location..." : address}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={22}
                color={isDarkMode ? "#fff" : "#333"}
              />
            </TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal"
              size={22}
              color={isDarkMode ? "#fff" : "#333"}
            />
          </View>
        </View>

        {/* WEATHER CARD */}
        <View
          style={[
            styles.weatherCard,
            { backgroundColor: isDarkMode ? "#555" : "#f8f6f4" },
          ]}
        >
          <View>
            <Text
              style={[styles.temp, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              {weather ? `${weather.temperature}°C` : "--°C"}
            </Text>
            <Text
              style={[styles.cloud, { color: isDarkMode ? "#ccc" : "#555" }]}
            >
              {weather ? weather.condition : "Loading..."}
            </Text>
          </View>

          <View style={styles.weatherStats}>
            <View>
              <Text
                style={[
                  styles.weatherLabel,
                  { color: isDarkMode ? "#ccc" : "#444" },
                ]}
              >
                Humidity
              </Text>
              <View style={styles.goodBadge}>
                <Text style={styles.badgeText}>
                  {weather ? `${weather.humidity}%` : "Analyzing..."}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={[
                  styles.weatherLabel,
                  { color: isDarkMode ? "#ccc" : "#444" },
                ]}
              >
                Soil Moisture
              </Text>
              <View
                style={[
                  styles.goodBadge,
                  {
                    backgroundColor:
                      weather?.soilMoisture === "High"
                        ? "#DFF5E4"
                        : weather?.soilMoisture === "Moderate"
                          ? "#F7E5D2"
                          : "#FADBD8",
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {weather ? weather.soilMoisture : "Analyzing..."}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={[
                  styles.weatherLabel,
                  { color: isDarkMode ? "#ccc" : "#444" },
                ]}
              >
                Precipitation
              </Text>
              <View style={styles.lowBadge}>
                <Text style={styles.badgeText}>
                  {weather ? `${weather.precipitation}mm` : "Calculating..."}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/recommendation",
              params: { crops: JSON.stringify(recommendedCrops) },
            })
          }
        >
          <Text style={styles.mainButtonText}>Get Crop Recommendation</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        {/* SECTION + GRID */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            CROP RECOMMENDATION AND YIELD PREDICTION SYSTEM
          </Text>

          {/* GRID */}
          <View style={styles.grid}>
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDarkMode ? "#444" : "#F7F4F0" },
              ]}
              onPress={() => router.push("/(tabs)/recommendation")}
            >
              <Image
                source={require("../../assets/images/crop/1.png")}
                style={styles.cardImage}
              />
              <Text
                style={[
                  styles.cardText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Crop Advice
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDarkMode ? "#444" : "#F7F4F0" },
              ]}
            >
              <Image
                source={require("../../assets/images/weather/w1.png")}
                style={styles.cardImage}
              />
              <Text
                style={[
                  styles.cardText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Weather
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDarkMode ? "#444" : "#F7F4F0" },
              ]}
            >
              <Image
                source={require("../../assets/images/soil/11.png")}
                style={styles.cardImage}
              />
              <Text
                style={[
                  styles.cardText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Soil Analysis
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDarkMode ? "#444" : "#F7F4F0" },
              ]}
            >
              <Image
                source={require("../../assets/images/farm/1.png")}
                style={styles.cardImage}
              />
              <Text
                style={[
                  styles.cardText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                My Farm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
  },
  location: { flexDirection: "row", alignItems: "center" },
  locationText: { marginLeft: 6, fontSize: 12, fontWeight: "600" },
  weatherCard: { borderRadius: 20, padding: 20, marginTop: 50 },
  temp: { fontSize: 28, fontWeight: "bold" },
  cloud: { color: "#555" },
  weatherStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  weatherLabel: { fontSize: 12, color: "#444" },
  goodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  lowBadge: {
    backgroundColor: "#F7E5D2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  badgeText: { fontSize: 10 },
  sectionTitle: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 30,
    marginBottom: 15,
    fontWeight: "600",
  },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f6e02",
    padding: 15,
    borderRadius: 30,
    justifyContent: "space-between",
    marginTop: 50,
  },

  mainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardImage: { width: 60, height: 55, marginBottom: 10 },
  cardText: { fontWeight: "600" },
});
