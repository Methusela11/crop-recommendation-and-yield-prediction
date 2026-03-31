import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Soil() {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.hello}>Soil Analysis</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectiontitle}></Text>
          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/soil/1.png")}
              resizeMode="cover"
              style={styles.fieldImage}
            />
          </View>

          <Text style={[styles.sectiontitle, { marginTop: 20 }]}>
            Soil Analysis
          </Text>
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
