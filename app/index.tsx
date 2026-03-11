import { router } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    image: require("../assets/images/icon.png"),
    title: "Next generation of farming",
    subtitle: "We provide data that enables the goals of global farming.",
  },
  {
    image: require("../assets/images/img/smart.png"),
    title: "Smart farming for farmers",
    subtitle: "Use AI powered insights to predict crop yield.",
  },
  {
    image: require("../assets/images/img/11.png"),
    title: "Grow more with less effort",
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
        resizeMode="cover"
      />

      {/* Bottom Card */}
      <View style={styles.card}>
        <FlatList
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <Image
                source={item.image}
                style={styles.slideImage}
                resizeMode="contain"
              />
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
    backgroundColor: "#7FB2D6",
  },

  image: {
    width: "100%",
    height: "60%",
  },

  card: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    marginTop: -80,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
    paddingTop: 30,
  },

  slide: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  slideImage: {
    width: 260,
    height: 180,
    overflow: "hidden",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#222",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    color: "#777",
    lineHeight: 22,
  },

  dots: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
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
    backgroundColor: "#CFCFCF",
    marginHorizontal: 4,
  },

  button: {
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: "#0f6e02",
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 40,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
