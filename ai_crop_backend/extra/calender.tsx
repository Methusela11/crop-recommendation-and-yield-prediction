import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const crops = [
  {
    name: "Maize",
    calendar: ["", "", "🌱", "🌿", "🌿", "🌾", "", "", "🌱", "🌿", "🌿", "🌾"],
  },
  {
    name: "Beans",
    calendar: ["", "", "🌱", "🌿", "🌾", "", "", "🌱", "🌿", "🌾", "", ""],
  },
  {
    name: "Tomatoes",
    calendar: ["🌱", "🌿", "🌿", "🌾", "", "", "🌱", "🌿", "🌿", "🌾", "", ""],
  },
  {
    name: "Carrots",
    calendar: ["", "🌱", "🌿", "🌿", "🌾", "", "🌱", "🌿", "🌿", "🌾", "", ""],
  },
  {
    name: "Lettuce",
    calendar: ["🌱", "🌿", "🌾", "", "", "", "🌱", "🌿", "🌾", "🌿", "🌾", ""],
  },
  {
    name: "Potatoes",
    calendar: [
      "",
      "🌱",
      "🌿",
      "🌿",
      "🌿",
      "🌾",
      "",
      "🌱",
      "🌿",
      "🌿",
      "🌾",
      "",
    ],
  },
  {
    name: "Onions",
    calendar: [
      "🌱",
      "🌿",
      "🌿",
      "🌿",
      "🌿",
      "🌾",
      "🌾",
      "",
      "",
      "🌱",
      "🌿",
      "🌿",
    ],
  },
  {
    name: "Peppers",
    calendar: ["", "", "🌱", "🌿", "🌿", "🌿", "🌾", "🌾", "🌾", "", "", ""],
  },
  {
    name: "Spinach",
    calendar: ["🌱", "🌿", "🌾", "", "", "", "🌱", "🌿", "🌿", "🌾", "", ""],
  },
  {
    name: "Squash",
    calendar: ["", "", "", "🌱", "🌿", "🌿", "🌾", "🌾", "", "", "", ""],
  },
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Calender() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.hello}>My Farm</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectiontitle}></Text>
        <View style={styles.fieldCard}>
          <Image
            source={require("../../assets/images/farm/1.jpeg")}
            resizeMode="cover"
            style={styles.fieldImage}
          />
        </View>

        <Text style={[styles.sectiontitle, { marginTop: 20 }]}>
          Seasonal Planting Calendar
        </Text>
        <ScrollView horizontal>
          <View>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.cropCell]}>Crop</Text>
              {months.map((month) => (
                <Text key={month} style={styles.cell}>
                  {month}
                </Text>
              ))}
            </View>

            {crops.map((crop) => (
              <View key={crop.name} style={styles.row}>
                <Text style={[styles.cell, styles.cropCell]}>{crop.name}</Text>
                {crop.calendar.map((phase, idx) => (
                  <Text key={idx} style={styles.cell}>
                    {phase}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={{ marginTop: 10 }}>
          <Text>🌱 Planting 🌿 Growing 🌾 Harvesting</Text>
        </View>
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
  hello: { fontSize: 20, color: "#fff", fontWeight: "700" },
  scrollContent: { padding: 20 },
  sectiontitle: { fontSize: 14, marginBottom: 15, fontWeight: "600" },
  fieldCard: { marginTop: 15, borderRadius: 20, overflow: "hidden" },
  fieldImage: { width: "100%", height: 160 },
  row: { flexDirection: "row" },
  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    textAlign: "center",
    minWidth: 40,
  },
  cropCell: { fontWeight: "600", backgroundColor: "#e3f2c1" },
});
