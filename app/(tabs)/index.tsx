import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = width / 2 - 30;

export default function Home() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      }}
      style={styles.background}
      blurRadius={3}
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Crop Prediction Model</Text>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => router.push("/(tabs)/recommendation")}
          >
            <Text style={styles.mainButtonText}>Get Crop Recommendation</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="leaf" size={24} color="green" />
            <Text style={styles.statValue}>Calculating...</Text>
            <Text style={styles.statLabel}>Harvest</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="water" size={24} color="skyblue" />
            <Text style={styles.statValue}>Analysing...</Text>
            <Text style={styles.statLabel}>Fertilizer</Text>
          </View>
        </View>

        {/* Spacer pushes cards down */}
        <View style={{ flex: 1 }} />

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() => router.push("/(tabs)/recommendation")}
          >
            <Ionicons name="leaf-outline" size={32} color="green" />
            <Text style={styles.cardText}>Crop Advice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { width: cardWidth }]}>
            <Ionicons name="rainy-outline" size={32} color="blue" />
            <Text style={styles.cardText}>Weather</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { width: cardWidth }]}>
            <Ionicons name="analytics-outline" size={32} color="orange" />
            <Text style={styles.cardText}>Soil Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { width: cardWidth }]}>
            <Ionicons name="bug-outline" size={32} color="red" />
            <Text style={styles.cardText}>Pest Control</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    padding: 15,
  },

  header: {
    marginBottom: 30,
    marginTop: 50,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },

  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#038109",
    padding: 15,
    borderRadius: 30,
    justifyContent: "space-between",
    marginTop: 20,
  },

  mainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statBox: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    borderRadius: 15,
    width: "48%",
    alignItems: "center",
  },

  statValue: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 5,
  },

  statLabel: {
    color: "#ddd",
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "white",
    height: 120,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  cardText: {
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});
