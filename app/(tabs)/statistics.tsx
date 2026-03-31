import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Statistics() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.hello}>Statistics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectiontitle}>Weather Analysis</Text>
        <ImageBackground
          source={require("../../assets/images/photo.jpeg")}
          style={styles.weatherContainer}
          imageStyle={{ borderRadius: 20 }}
        >
          <Text style={styles.weatherTitle}>Local Weather Forecast</Text>
          <Text style={styles.weatherLocation}>Current location: Nairobi</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { day: "Today", temp: 20, rain: 92 },
              { day: "Tomorrow", temp: 20, rain: 92 },
              { day: "Saturday", temp: 19, rain: 77 },
              { day: "Sunday", temp: 18, rain: 96 },
              { day: "Monday", temp: 18, rain: 81 },
              { day: "Tuesday", temp: 18, rain: 81 },
              { day: "Wednesday", temp: 18, rain: 81 },
            ].map((item, index) => (
              <View key={index} style={styles.weatherCard}>
                <Text style={styles.dayText}>{item.day}</Text>
                <Text style={styles.icon}>🌧</Text>
                <Text style={styles.temp}>{item.temp}°C</Text>
                <Text style={styles.rainText}>RAIN</Text>
                <Text style={styles.precip}>Precipitation: {item.rain}%</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={styles.tip}>
            Farming Tip: With rain expected, delay fertilizer application to
            prevent runoff.
          </Text>
        </ImageBackground>
        <Pressable
          style={styles.fieldButton}
          onPress={() => router.push("/extra/weather")}
        >
          <Text style={styles.fieldButtonText}>View Weather Statistics</Text>
        </Pressable>

        <Text style={styles.sectiontitle}>Soil Analysis</Text>
        <ImageBackground
          source={require("../../assets/images/photo.jpeg")}
          style={styles.soilContainer}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/soil/1.png")}
              resizeMode="contain"
              style={styles.fieldImage}
            />
          </View>
        </ImageBackground>
        <Pressable
          style={styles.fieldButton}
          onPress={() => router.push("/extra/soil")}
        >
          <Text style={styles.fieldButtonText}>View Soil Analysis</Text>
        </Pressable>
      </ScrollView>
    </View>
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
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },

  backArrow: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },
  hello: { fontSize: 20, color: "#fff", fontWeight: "700" },
  scrollContent: { paddingTop: 20, paddingBottom: 110 },
  sectiontitle: { fontSize: 14, marginBottom: 15, paddingLeft: 20 },
  fieldCard: { marginTop: 15, borderRadius: 20, overflow: "hidden" },
  fieldImage: { width: "100%", height: 160, marginBottom: 20 },
  fieldButton: {
    backgroundColor: "#297904",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "flex-start",
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },

  fieldButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  weatherContainer: {
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  soilContainer: {
    marginHorizontal: 10,
  },

  weatherTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  weatherLocation: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 15,
  },

  weatherCard: {
    backgroundColor: "#132F4C",
    padding: 5,
    borderRadius: 15,
    marginRight: 5,
    alignItems: "center",
    width: 100,
  },

  dayText: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },

  icon: {
    fontSize: 24,
    marginVertical: 5,
  },

  temp: {
    color: "#00D4FF",
    fontSize: 18,
    fontWeight: "bold",
  },

  rainText: {
    color: "#ccc",
    fontSize: 12,
  },

  precip: {
    color: "#aaa",
    fontSize: 10,
  },

  tip: {
    color: "#fff",
    marginTop: 15,
    fontSize: 12,
    textAlign: "center",
  },
});
