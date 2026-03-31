import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Crop, crops } from "../../data/crops";

export default function Advice() {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const router = useRouter();

  const getAdvice = (crop: Crop) => {
    let fertilizers = "";
    let pesticides = "";
    let warnings: string[] = [];
    let schedule: string[] = [];

    if (crop.category.includes("Legume")) {
      fertilizers =
        "Apply DAP (phosphorus) at planting. Avoid nitrogen since this crop fixes its own nitrogen.";
    } else if (
      crop.label.includes("potato") ||
      crop.label.includes("cassava")
    ) {
      fertilizers =
        "Apply high potassium (K) fertilizers for root development. Avoid excess nitrogen.";
    } else if (crop.category.includes("Vegetable")) {
      fertilizers =
        "Apply compost + balanced NPK (e.g., 17:17:17) for continuous growth.";
    } else if (crop.category.includes("Cash Crop")) {
      fertilizers =
        "Use controlled NPK + organic manure. Split application for best results.";
    } else {
      fertilizers =
        "Apply DAP at planting and top-dress with Urea after 3–4 weeks.";
    }

    if (crop.humidity_max > 80) {
      pesticides =
        "High humidity risk: Use fungicides regularly to prevent fungal diseases (blight, mildew).";
    } else if (crop.humidity_min < 40) {
      pesticides =
        "Dry conditions: Watch for pests like aphids and mites. Use insecticides if needed.";
    } else {
      pesticides =
        "Moderate risk: Monitor regularly and apply pesticides only when necessary.";
    }

    if (crop.ph_min < 5.5) {
      warnings.push("Soil may be too acidic → apply lime.");
    }
    if (crop.ph_max > 7.5) {
      warnings.push("Soil may be too alkaline → add organic matter.");
    }

    schedule = [
      `Week 1: Plant ${crop.label} in well-prepared soil`,
      `Week 2: Ensure moisture (Rainfall: ${crop.rainfall_min}-${crop.rainfall_max} mm)`,
      "Week 3: First weeding + apply base fertilizer",
      "Week 4: Monitor pests and spray if necessary",
      "Week 5: Top dressing / nutrient boost",
      "Week 6+: Continue weeding and disease control",
    ];

    warnings.push(
      `Optimal temperature: ${crop.temp_min}°C - ${crop.temp_max}°C`,
    );

    return { fertilizers, pesticides, schedule, warnings };
  };

  const advice = selectedCrop ? getAdvice(selectedCrop) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.hello}>Crop Advice</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subTitle}>View Crop-specific Advice</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCrop?.label || ""}
            onValueChange={(value) => {
              const crop = crops.find((c) => c.label === value) || null;
              setSelectedCrop(crop);
            }}
          >
            <Picker.Item label="-- Select Crop --" value="" />
            {crops.map((crop) => (
              <Picker.Item
                key={crop.label}
                label={crop.label}
                value={crop.label}
              />
            ))}
          </Picker>
        </View>

        {selectedCrop && advice && (
          <>
            <Text style={styles.cropHeader}>
              {selectedCrop.label.toUpperCase()} ({selectedCrop.category})
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Fertilizers</Text>
              <Text style={styles.cardText}>{advice.fertilizers}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Pesticides</Text>
              <Text style={styles.cardText}>{advice.pesticides}</Text>
            </View>

            {advice.warnings.length > 0 && (
              <>
                <Text style={styles.subTitle}>Warnings</Text>
                {advice.warnings.map((warn, i) => (
                  <View key={i} style={styles.warningCard}>
                    <Text style={styles.warningText}>{warn}</Text>
                  </View>
                ))}
              </>
            )}

            <Text style={styles.subTitle}>Weekly Schedule</Text>

            {advice.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleCard}>
                <Text style={styles.scheduleText}>{item}</Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.generalTips}>
          <Text style={styles.subTitle}>General Tips</Text>

          <Text style={styles.listItem}>• Maintain balanced NPK nutrients</Text>
          <Text style={styles.listItem}>• Avoid over-fertilization</Text>
          <Text style={styles.listItem}>• Weed regularly</Text>
          <Text style={styles.listItem}>• Monitor pests early</Text>
        </View>

        <Text style={styles.sectiontitle}>More on Crop Advice</Text>
        <View style={styles.commodityCard}>
          <Text style={styles.sectionTitle}>Crop Disease Analysis</Text>
          <Text style={styles.sectiontitle}>Crop Diseases</Text>
          <Pressable
            style={styles.fieldButton}
            onPress={() => router.push("/extra/diseases")}
          >
            <Text style={styles.fieldButtonText}>
              View Crop Diseases Analysis
            </Text>
          </Pressable>
        </View>

        <View style={styles.commodityCard}>
          <Text style={styles.sectionTitle}>Crop Pests Analysis</Text>
          <Text style={styles.sectiontitle}>Pests</Text>
          <Pressable
            style={styles.fieldButton}
            onPress={() => router.push("/extra/pests")}
          >
            <Text style={styles.fieldButtonText}>View Crop Pests Analysis</Text>
          </Pressable>
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
  backButton: {
    marginRight: 15,
  },

  backArrow: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },

  hello: { fontSize: 20, color: "#fff", fontWeight: "700" },

  scrollContent: { paddingBottom: 150, padding: 20 },

  fieldImage: {
    width: "100%",
    height: 180,
  },

  subTitle: {
    marginTop: 20,
    fontWeight: "700",
    fontSize: 15,
  },

  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
  },

  cropHeader: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#297904",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  cardTitle: {
    fontWeight: "700",
    marginBottom: 5,
  },

  cardText: {
    fontSize: 13,
    color: "#444",
  },

  scheduleCard: {
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },

  scheduleText: {
    fontSize: 13,
  },

  listItem: {
    fontSize: 13,
    marginTop: 6,
  },
  generalTips: {
    marginBottom: 20,
  },

  warningCard: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },

  warningText: {
    fontSize: 13,
    color: "#856404",
  },
  commodityCard: {
    backgroundColor: "#def3ea",
    padding: 5,
    borderRadius: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: "100%",
    alignSelf: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 10,
    fontWeight: "700",
    alignSelf: "center",
    fontSize: 18,
  },
  sectiontitle: {
    fontSize: 14,
    alignSelf: "center",
  },
  fieldCard: {
    marginTop: 5,
    borderRadius: 20,
    overflow: "hidden",
  },
  farmFieldImage: { width: "100%", height: 180 },
  fieldButton: {
    backgroundColor: "#297904",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "flex-start",
    width: "90%",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 20,
  },

  fieldButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
});
