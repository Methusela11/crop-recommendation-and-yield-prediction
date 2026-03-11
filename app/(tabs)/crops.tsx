import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Crops() {
  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search your crops" style={styles.searchInput} />
        <Ionicons name="mic-outline" size={18} color="#888" />
      </View>

      {/* YOUR CROPS HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Your crops</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={18} color="#333" />
        </TouchableOpacity>
      </View>

      {/* CROPS LIST */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.cropItemActive}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/766/766020.png",
            }}
            style={styles.cropImage}
          />
          <Text style={styles.cropText}>Rice</Text>
        </View>

        <View style={styles.cropItem}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2909/2909764.png",
            }}
            style={styles.cropImage}
          />
          <Text style={styles.cropText}>Beans</Text>
        </View>

        <View style={styles.cropItem}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1041/1041357.png",
            }}
            style={styles.cropImage}
          />
          <Text style={styles.cropText}>Cotton</Text>
        </View>

        <View style={styles.cropItem}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/766/766027.png",
            }}
            style={styles.cropImage}
          />
          <Text style={styles.cropText}>Millets</Text>
        </View>
      </ScrollView>

      {/* DETAILS CARD */}
      <ScrollView style={styles.card}>
        <Text style={styles.cropTitle}>Rice</Text>

        <Text style={styles.description}>
          Rice is a cereal grain, and in its domesticated form is the staple
          food for over half of the global human population, particularly in
          Asia and Africa, due to the vast amount of soil that is able to grow
          rice.
        </Text>

        <Text style={styles.subtitle}>Conditions and requirements</Text>

        <Text style={styles.bullet}>
          • Warm climates with abundant sunlight and water.
        </Text>
        <Text style={styles.bullet}>
          • Optimal temperature range: 20°C to 35°C (68°F to 95°F).
        </Text>
        <Text style={styles.bullet}>
          • Requires flooded or irrigated fields.
        </Text>
        <Text style={styles.bullet}>
          • Thrives in fertile, well-drained soil rich in organic matter.
        </Text>
        <Text style={styles.bullet}>
          • Needs plenty of sunlight for photosynthesis.
        </Text>
        <Text style={styles.bullet}>
          • Adaptable to various climatic conditions with high humidity.
        </Text>
        <Text style={styles.bullet}>
          • Cultivation techniques vary based on local environmental factors.
        </Text>

        <Text style={styles.subtitle}>Suggested pesticides</Text>

        <Text style={styles.subtitleSmall}>Herbicides:</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2ea44f",
    paddingTop: 50,
    paddingHorizontal: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    marginBottom: 15,
    justifyContent: "space-between",
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
  },

  addButton: {
    backgroundColor: "#fff",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  cropItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    width: 70,
  },

  cropItemActive: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    width: 70,
    borderBottomWidth: 3,
    borderBottomColor: "#16a34a",
  },

  cropImage: {
    width: 30,
    height: 30,
    marginBottom: 4,
  },

  cropText: {
    fontSize: 12,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 15,
    borderRadius: 20,
    padding: 18,
    flex: 1,
  },

  cropTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    color: "#555",
    marginBottom: 15,
  },

  subtitle: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
  },

  subtitleSmall: {
    fontWeight: "600",
    marginTop: 5,
  },

  bullet: {
    fontSize: 13,
    marginBottom: 4,
    color: "#444",
  },
});
