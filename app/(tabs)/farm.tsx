import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Farm() {
  const router = useRouter();

  return (
    <>

      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.hello}>My Farm</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectiontitle}>More about your farm</Text>

          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/farm/1.jpeg")}
              resizeMode="cover"
              style={styles.fieldImage}
            />
          </View>

          <Pressable
            style={styles.fieldButton}
            onPress={() => router.push("/extra/calender")}
          >
            <Text style={styles.fieldButtonText}>
              View Seasonal Planting Calendar
            </Text>
          </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  hello: { fontSize: 20, color: "#fff", fontWeight: "700" },
  scrollContent: { padding: 20 },
  sectiontitle: { fontSize: 14, marginBottom: 5 },
  fieldCard: { marginTop: 15, borderRadius: 20, overflow: "hidden" },
  fieldImage: { width: "100%", height: 160 },
  fieldButton: {
    backgroundColor: "#297904",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "flex-start",
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 20,
  },

  fieldButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
});
