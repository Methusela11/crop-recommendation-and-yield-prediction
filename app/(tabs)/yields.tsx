import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Crop, crops } from "../../data/crops";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Yields() {
  const [farmSize, setFarmSize] = useState("");
  const [crop, setCrop] = useState("maize");
  const [period, setPeriod] = useState("3");
  const [result, setResult] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const handlePrediction = () => {
    const size = parseFloat(farmSize);

    if (isNaN(size) || size <= 0) {
      setShowAlert(true);
      return;
    }
    if (!size) return;

    const selectedCrop = crops.find((c) => c.label === crop) as
      | Crop
      | undefined;
    if (!selectedCrop) return;

    const currentTemp = 25;
    const currentHumidity = 65;
    const currentRainfall = 900;
    const soilPH = 6.5;

    let score = 0;

    if (
      currentTemp >= selectedCrop.temp_min &&
      currentTemp <= selectedCrop.temp_max
    )
      score += 25;

    if (
      currentHumidity >= selectedCrop.humidity_min &&
      currentHumidity <= selectedCrop.humidity_max
    )
      score += 25;

    if (
      currentRainfall >= selectedCrop.rainfall_min &&
      currentRainfall <= selectedCrop.rainfall_max
    )
      score += 25;

    if (soilPH >= selectedCrop.ph_min && soilPH <= selectedCrop.ph_max)
      score += 25;

    let multiplier = 1;
    if (period === "2") multiplier = 0.6;
    if (period === "3") multiplier = 0.85;
    if (period === "4") multiplier = 1;

    const baseYield = 20;

    const predicted = size * baseYield * (score / 100) * multiplier;

    setResult(predicted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.hello}>Yields Prediction</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectiontitle}>Gauge your produce</Text>

        <Text style={styles.label}>Farm Size (Acres)</Text>
        <TextInput
          style={styles.input}
          placeholder=" Enter farm size"
          keyboardType="numeric"
          value={farmSize}
          onChangeText={setFarmSize}
        />

        <Text style={styles.label}>Select Crop</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={crop}
            onValueChange={(itemValue) => setCrop(itemValue)}
          >
            {crops.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.label.replace(/_/g, " ").toUpperCase()}
                value={item.label}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Growth Period (Calculated from Today)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={period}
            onValueChange={(itemValue) => setPeriod(itemValue)}
          >
            <Picker.Item label="2 Months" value="2" />
            <Picker.Item label="3 Months" value="3" />
            <Picker.Item label="4 Months" value="4" />
          </Picker>
        </View>

        <Pressable style={styles.button} onPress={handlePrediction}>
          <Text style={styles.buttonText}>Predict Yields</Text>
        </Pressable>

        {result !== null && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Estimated Yield: {result.toFixed(0)} bags
            </Text>
            <Text style={{ marginTop: 5 }}>
              Suitability Score:{" "}
              {((result / (parseFloat(farmSize || "1") * 20)) * 100).toFixed(0)}
              %
            </Text>
            <View style={styles.reminderBox}>
              <Text style={styles.Label}>
                To achieve Higher Yields, you can view{" "}
                {crop.replace(/_/g, " ").toUpperCase()} planting advices in the
                Advice Tab
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      {showAlert && (
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>⚠️</Text>
            <Text style={styles.alertMessage}>
              Farm Size (Acres) field is empty!
            </Text>

            <Pressable
              style={styles.alertButton}
              onPress={() => setShowAlert(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      )}
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  hello: { fontSize: 20, color: "#fff", fontWeight: "700" },
  scrollContent: { padding: 20, paddingBottom: 200 },
  sectiontitle: { fontSize: 20 },
  fieldCard: {
    marginTop: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  fieldImage: { width: "100%", height: 120 },
  label: {
    marginTop: 15,
    fontWeight: "600",
  },
  Label: {
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 5,
  },

  button: {
    backgroundColor: "#297904",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#d3eed5",
    borderRadius: 10,
  },

  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  reminderBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#daf3bf",
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#D32F2F",
  },

  alertMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  alertButton: {
    backgroundColor: "#d3eed5",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  alertButtonText: {
    color: "#000",
    fontWeight: "600",
  },
});
