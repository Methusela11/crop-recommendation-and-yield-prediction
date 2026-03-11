import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const slides = [
  {
    title: "The next generation\nof farming",
    subtitle: "We provide data that enables the goals of global agriculture.",
  },
  {
    title: "Smart agriculture\nfor farmers",
    subtitle: "Use AI powered insights to improve crop yield and soil health.",
  },
  {
    title: "Grow more with\nless effort",
    subtitle: "Track weather, soil moisture and farm productivity easily.",
  },
];

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Bottom Card */}
      <View style={styles.card}>
        <FlatList
          data={slides}
          horizontal
          pagingEnabled
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.y / 180);
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          )}
        />

        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={activeIndex === i ? styles.activeDot : styles.dot}
            />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../(tabs)")}
        >
          <Text style={styles.buttonText}>Get Started →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#76A7CE",
  },

  image: {
    width: "100%",
    height: 380,
    marginTop: 40,
  },

  card: {
    backgroundColor: "#F3F3F3",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -60,
    paddingTop: 30,
    paddingHorizontal: 30,
    alignItems: "center",
    flex: 1,
  },

  slide: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#6e6e6e",
  },

  dots: {
    flexDirection: "row",
    marginTop: 10,
  },

  activeDot: {
    width: 22,
    height: 6,
    borderRadius: 10,
    backgroundColor: "#2E7D32",
    marginHorizontal: 4,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#4A2E08",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 40,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
