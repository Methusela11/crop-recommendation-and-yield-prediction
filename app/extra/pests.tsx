import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Pests() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const pickImage = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !galleryPermission.granted) {
      alert("Permission required");
      return;
    }

    setModalVisible(true);
  };

  const openCamera = async () => {
    setModalVisible(false);

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      detectDisease(uri);
    }
  };

  const openGallery = async () => {
    setModalVisible(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      detectDisease(uri);
    }
  };

  const detectDisease = async (uri: string) => {
    setLoading(true);

    setTimeout(() => {
      const diseases = [
        {
          name: "Leaf Blight",
          confidence: "92%",
          prevention:
            "Use resistant varieties, avoid overcrowding, rotate crops.",
          pesticide: "Spray Mancozeb or Chlorothalonil.",
        },
        {
          name: "Powdery Mildew",
          confidence: "89%",
          prevention: "Ensure proper spacing and air circulation.",
          pesticide: "Use Sulfur-based fungicides.",
        },
        {
          name: "Bacterial Wilt",
          confidence: "85%",
          prevention: "Use clean planting materials and proper drainage.",
          pesticide: "Apply copper-based bactericides.",
        },
      ];

      const detected = diseases[Math.floor(Math.random() * diseases.length)];
      setResult(detected);
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.hello}>Crop Pests Detection</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Info */}
          <Text style={styles.sectionTitle}>How Detection Works</Text>
          <Text style={styles.text}>
            This system uses image-based AI to analyze pests and suggests
            control measures.
          </Text>

          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/pests/11.png")}
              resizeMode="contain"
              style={styles.fieldImage}
            />
          </View>

          <Text style={styles.sectionTitlee}>Detect Pests</Text>

          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </Pressable>

          {image && <Image source={{ uri: image }} style={styles.preview} />}

          {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

          {result && !loading && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>
                {result.name} ({result.confidence})
              </Text>

              <Text style={styles.resultText}>
                Prevention: {result.prevention}
              </Text>

              <Text style={styles.resultText}>
                Pesticide: {result.pesticide}
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Prevention Tips</Text>

          <View style={styles.tipCard}>
            <Text style={styles.tip}>• Regularly inspect crops</Text>
            <Text style={styles.tip}>• Practice crop rotation</Text>
            <Text style={styles.tip}>• Use pest-resistant crop varieties</Text>
            <Text style={styles.tip}>• Keep farm clean (remove weeds)</Text>
            <Text style={styles.tip}>
              • Encourage natural predators (birds, insects)
            </Text>
            <Text style={styles.tip}>• Use organic pesticides like neem</Text>
            <Text style={styles.tip}>
              • Apply pesticides only when infestation is detected
            </Text>
          </View>

          <Text style={styles.sectionMore}>
            You can also view Crop Diseases Analysis
          </Text>

          <View style={styles.commodityCard}>
            <Text style={styles.sectionTitlee}>Crop Diseases Analysis</Text>

            <Pressable
              style={styles.fieldButton}
              onPress={() => router.push("/extra/diseases")}
            >
              <Text style={styles.fieldButtonText}>
                View Crop Diseases Analysis
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Image Source</Text>

              <Pressable style={styles.modalBtn} onPress={openCamera}>
                <Text style={styles.modalText}>📷 Take Photo</Text>
              </Pressable>

              <Pressable style={styles.modalBtn} onPress={openGallery}>
                <Text style={styles.modalText}>🖼️ Choose from Gallery</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#def3ea" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#333" }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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

  backArrow: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },

  hello: { fontSize: 20, color: "#fff", fontWeight: "700" },

  scrollContent: { padding: 20, paddingBottom: 100 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
  },

  sectionTitlee: {
    fontSize: 16,
    alignSelf: "center",
    fontWeight: "700",
    marginTop: 20,
  },

  text: {
    fontSize: 13,
    marginTop: 5,
    lineHeight: 20,
    color: "#333",
  },

  button: {
    backgroundColor: "#297904",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: { color: "#fff", fontWeight: "700" },

  preview: {
    width: "100%",
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },

  resultCard: {
    backgroundColor: "#def3ea",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },

  resultTitle: { fontWeight: "700", marginBottom: 10 },

  resultText: { fontSize: 13, marginTop: 5 },

  tipCard: {
    backgroundColor: "#def3ea",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  tip: { fontSize: 13, marginTop: 5 },

  sectionMore: {
    fontSize: 13,
    marginTop: 40,
    color: "#555",
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

  fieldButton: {
    backgroundColor: "#297904",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  fieldButtonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },

  fieldCard: {
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
  },

  fieldImage: { width: "100%", height: 200 },

  // 🔥 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "80%",
  },

  modalTitle: {
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },

  modalBtn: {
    backgroundColor: "#297904",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  modalText: {
    color: "#fff",
    fontWeight: "600",
  },
});
