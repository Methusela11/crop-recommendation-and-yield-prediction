import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ForecastMonth {
  month: string;
  temp: number;
  rainfall: number;
  humidity: number;
}

interface WeatherData {
  temperature: number | null;
  humidity: number | null;
  wind_speed: number | null;
  precipitation: number | null;
  weather_icon: string | null;
  soil_temperature: number | null;
  soil_ph: number | null;
  city: string;

  forecast_4_months?: ForecastMonth[];

  recommended_crops: {
    label: string;
    category: string;
    score: number;
    percentage?: number;
  }[];
}

export default function Home() {
  const cropIcons: { [key: string]: ImageSourcePropType } = {
    kale: require("../../assets/images/crop/kale/11.png"),
    ginger: require("../../assets/images/crop/ginger/11.png"),
    orange: require("../../assets/images/crop/orange/11.png"),
    pumpkin: require("../../assets/images/crop/pumkin/11.png"),
    broccoli: require("../../assets/images/crop/broccoli/11.png"),
    green_grams: require("../../assets/images/crop/greengrams/11.png"),
    cowpeas: require("../../assets/images/crop/cowpeas/11.png"),
    banana: require("../../assets/images/crop/banana/11.png"),
    cassava: require("../../assets/images/crop/cassava/11.png"),
    pawpaw: require("../../assets/images/crop/pawpaw/11.png"),
    guava: require("../../assets/images/crop/guava/11.png"),

    beans: require("../../assets/images/crop/beans/11.jpg"),
    amaranth: require("../../assets/images/crop/aramanth/11.jpg"),
    lablab: require("../../assets/images/crop/lablab/11.jpg"),
    passion: require("../../assets/images/crop/passion/11.jpg"),
    lettuce: require("../../assets/images/crop/lettuce/11.jpg"),
    carrots: require("../../assets/images/crop/carrots/11.jpg"),
    coffee: require("../../assets/images/crop/coffee/11.jpg"),
    irish_potato: require("../../assets/images/crop/irish/11.jpg"),
    turmeric: require("../../assets/images/crop/tumeric/11.jpg"),
    arrowroot: require("../../assets/images/crop/arrowroots/11.jpg"),
    onions: require("../../assets/images/crop/onion/11.jpg"),
    canola: require("../../assets/images/crop/canola/11.jpg"),
    tea: require("../../assets/images/crop/tea/11.jpg"),

    maize: require("../../assets/images/crop/maize/11.jpeg"),
    sisal: require("../../assets/images/crop/sisal/11.jpeg"),
    tomato: require("../../assets/images/crop/tomato/11.jpeg"),
    avocado: require("../../assets/images/crop/avocado/11.jpeg"),
    eggplant: require("../../assets/images/crop/eggplant/11.jpeg"),
    capsicum: require("../../assets/images/crop/capsicum/11.jpeg"),
    garlic: require("../../assets/images/crop/garlic/11.jpeg"),
    pyrethrum: require("../../assets/images/crop/pyrethrum/11.jpeg"),
    lentils: require("../../assets/images/crop/lentils/11.jpeg"),
    apple: require("../../assets/images/crop/apple/11.jpeg"),
    macadamia: require("../../assets/images/crop/macadamia/11.jpeg"),
    cabbage: require("../../assets/images/crop/cabbage/11.jpeg"),
    okra: require("../../assets/images/crop/okra/11.jpeg"),
    rice: require("../../assets/images/crop/rice/11.jpeg"),
    sesame: require("../../assets/images/crop/sesame/11.jpeg"),
    soybeans: require("../../assets/images/crop/soya/11.jpeg"),

    spinach: require("../../assets/images/crop/spinach/11.webp"),
    mango: require("../../assets/images/crop/mango/11.webp"),
    cotton: require("../../assets/images/crop/cotton/11.webp"),
    pineapple: require("../../assets/images/crop/pineapple/11.webp"),
    sugarcane: require("../../assets/images/crop/sugarcane/11.webp"),
    millet: require("../../assets/images/crop/millet/11.webp"),
    coriander: require("../../assets/images/crop/coriander/11.webp"),
    sunflower: require("../../assets/images/crop/sunflower/11.webp"),
    groundnuts: require("../../assets/images/crop/groundnuts/11.webp"),
    sorghum: require("../../assets/images/crop/sorghum/11.webp"),

    tobacco: require("../../assets/images/crop/tobacco/11.avif"),
    yam: require("../../assets/images/crop/yam/11.jpeg"),
  };

  const swahiliNames: { [key: string]: string } = {
    maize: "mahindi",
    banana: "ndizi",
    beans: "maharagwe",
    sorghum: "mtama",
    millet: "wimbi",
    cassava: "muhogo",
    sweet_potato: "viazi tamu",
    irish_potato: "viazi",
    rice: "mchele",
    arrowroot: "Nduma",
    yam: "viazi vikuu",
    green_grams: "Pojo / Ndengu",
    cowpeas: "kunde",
    soybeans: "soya",
    pawpaw: "paipai",
    pigeon_peas: "Mbaazi",
    chickpeas: "dengu",
    lablab: "Mfiwi",
    groundnuts: "Njugu",
    lentils: "Kamande",
    tomato: "nyanya",
    kale: "Sukuma wiki",
    cabbage: "kabeji",
    carrots: "karoti",
    onions: "kitunguu",
    coriander: "Dania",
    capsicum: "pilipili hoho",
    eggplant: "biringanya",
    okra: "Mabenda / bamia",
    lettuce: "saladi",
    broccoli: "brokoli",
    cauliflower: "kalifula",
    pumpkin_leaves: "Misheveve",
    amaranth: "mchicha",
    coffee: "kahawa",
    tea: "chai",
    sugarcane: "miwa",
    guava: "mapera",
    cotton: "pamba",
    cashew_nuts: "korosho",
    sisal: "sisal",
    sesame: "Simsim / ufuta",
    ginger: " Tangawizi",
    garlic: "kitunguu saumu",
    "chili pepper": "pilipili",
  };

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const router = useRouter();

  const fetchWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      console.log("Device location:", lat, lon);

      const BASE_URL =
        "https://57cb-41-220-233-110.ngrok-free.app/api/live-data/";
      const url = `${BASE_URL}?lat=${lat}&lon=${lon}`;
      console.log("Fetching weather from URL:", url);

      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        console.log("Backend returned error:", res.status, text);
        throw new Error(`Backend error: ${text}`);
      }

      const data: WeatherData = await res.json();
      console.log("Weather data received:", data);

      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      console.log("Error fetching weather data:", err.message || err);
      setError("Failed to fetch weather data");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/photo.jpeg")}
        style={styles.header}
        resizeMode="cover"
      >
        <View>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.hello}>
                Hello, <Text style={styles.bold}>Farmers</Text>
              </Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                {"\n"}
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <View style={styles.profileCircle}>
              <Ionicons name="person-outline" size={20} color="#000" />
            </View>
          </View>

          <View style={styles.search}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#ec0e0e" />
              <Text style={styles.location}>
                {loading ? "Fetching..." : error ? "Error" : weatherData?.city}
              </Text>
            </View>

            <Pressable onPress={fetchWeather}>
              <Ionicons
                name="reload"
                size={18}
                color="#020000"
                style={{ opacity: loading ? 0.5 : 1 }}
              />
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              try {
                await fetchWeather();
              } finally {
                setRefreshing(false);
              }
            }}
          />
        }
      >
        <View style={styles.weatherCard}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color="#ec0e0e" />
            <Text style={styles.Location}>
              {loading ? "Fetching..." : error ? "Error" : weatherData?.city}
            </Text>
          </View>

          <View style={styles.weatherTop}>
            {loading ? (
              <Text>Loading...</Text>
            ) : error ? (
              <Text>{error}</Text>
            ) : (
              <>
                <Image
                  source={{
                    uri:
                      weatherData?.weather_icon ||
                      "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
                  }}
                  style={styles.cloud}
                />
                <Text style={styles.temp}>
                  {weatherData?.temperature != null
                    ? `${weatherData.temperature}°C`
                    : "N/A"}
                </Text>
              </>
            )}
          </View>

          {!loading && !error && weatherData && (
            <View style={styles.weatherStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {weatherData.soil_temperature != null
                    ? `${weatherData.soil_temperature}°C`
                    : "N/A"}
                </Text>
                <Text style={styles.statLabel}>Soil Temp</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {weatherData.humidity != null
                    ? `${weatherData.humidity}%`
                    : "N/A"}
                </Text>
                <Text style={styles.statLabel}>Humidity</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {weatherData.wind_speed != null
                    ? `${weatherData.wind_speed} m/s`
                    : "N/A"}
                </Text>
                <Text style={styles.statLabel}>Wind</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {weatherData.precipitation != null
                    ? `${weatherData.precipitation} mm`
                    : "0 mm"}
                </Text>
                <Text style={styles.statLabel}>Precipitation</Text>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          Recommended Crops for this Season in{" "}
          {loading ? "Fetching..." : error ? "Error" : weatherData?.city}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.commodities}
        >
          {loading ? (
            <Text style={{ marginLeft: 20, color: "#666" }}>
              Please wait, fetching location and weather...
            </Text>
          ) : error ? (
            <Text style={{ marginLeft: 20, color: "#666" }}>
              Failed to load crops
            </Text>
          ) : weatherData && weatherData.recommended_crops.length > 0 ? (
            weatherData.recommended_crops.map((crop, i) => {
              const cropName = crop.label.split("_")[0].toLowerCase();
              const swahili = swahiliNames[cropName];

              return (
                <Pressable
                  key={i}
                  style={styles.commodity}
                  onPress={() =>
                    router.push({
                      pathname: "/extra/cropsdetails",
                      params: {
                        name: crop.label,
                        category: crop.category,
                        score: crop.score,
                      },
                    })
                  }
                >
                  {cropIcons[cropName] && (
                    <Image
                      source={cropIcons[cropName]}
                      style={styles.commodityImg}
                    />
                  )}

                  <Text style={styles.commodityText}>
                    {crop.label.replace(/_/g, " ")}
                  </Text>

                  {swahili && (
                    <Text style={styles.commodityText}>({swahili})</Text>
                  )}

                  <Text
                    style={{ fontSize: 10, color: "#777", marginBottom: 5 }}
                  >
                    {crop.percentage ?? crop.score}%
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <Text style={{ marginLeft: 20, color: "#666" }}>
              No recommended crops available
            </Text>
          )}
        </ScrollView>

        <Text style={styles.sectionTiTle}>More on Crops Recommendation</Text>

        <View style={styles.commodityCard}>
          <Text style={styles.sectionTiTle}>Yields Prediction</Text>
          <Text style={styles.sectiontitle}>Gauge your produce</Text>
          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/yields/11.png")}
              resizeMode="contain"
              style={styles.fieldImage}
            />
          </View>
          <Pressable
            style={styles.fieldButton}
            onPress={() => navigation.navigate("yields")}
          >
            <Text style={styles.fieldButtonText}>
              More about Yields Prediction
            </Text>
          </Pressable>
        </View>

        <View style={styles.commodityCard}>
          <Text style={styles.sectionTiTle}>Statistics</Text>
          <Text style={styles.sectiontitle}>Weather & Soil Analysis</Text>
          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/statistics/11.png")}
              resizeMode="contain"
              style={styles.fieldImage}
            />
          </View>
          <Pressable
            style={styles.fieldButton}
            onPress={() => navigation.navigate("statistics")}
          >
            <Text style={styles.fieldButtonText}>More about Statistics</Text>
          </Pressable>
        </View>

        <View style={styles.commodityCard}>
          <Text style={styles.sectionTiTle}>Crops Advise</Text>
          <Text style={styles.sectiontitle}>Fertilizers</Text>
          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/advice/11.gif")}
              resizeMode="contain"
              style={styles.fieldImage}
            />
          </View>
          <Pressable
            style={styles.fieldButton}
            onPress={() => navigation.navigate("advice")}
          >
            <Text style={styles.fieldButtonText}>More about Crop Advise</Text>
          </Pressable>

          <Text style={styles.sectiontitle}>Diseases</Text>
          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/diseases/11.png")}
              resizeMode="contain"
              style={styles.fieldImage}
            />
          </View>
          <Pressable
            style={styles.fieldButton}
            onPress={() => router.push("/extra/diseases")}
          >
            <Text style={styles.fieldButtonText}>
              View Crop Diseases Analysis
            </Text>
          </Pressable>

          <Text style={styles.sectiontitle}>Pests</Text>
          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/pests/11.png")}
              resizeMode="contain"
              style={styles.fieldImage}
            />
          </View>
          <Pressable
            style={styles.fieldButton}
            onPress={() => router.push("/extra/pests")}
          >
            <Text style={styles.fieldButtonText}>View Crop Pests Analysis</Text>
          </Pressable>
        </View>

        <View style={styles.commodityCard}>
          <Text style={styles.sectionTiTle}>My Farm</Text>
          <Text style={styles.sectiontitle}>More about crops</Text>
          <View style={styles.fieldCard}>
            <Image
              source={require("../../assets/images/farm/1.jpeg")}
              resizeMode="cover"
              style={styles.farmFieldImage}
            />
          </View>
          <Pressable
            style={styles.fieldButton}
            onPress={() => navigation.navigate("farm")}
          >
            <Text style={styles.fieldButtonText}>More about My Farm</Text>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F3E8" },

  image: {
    width: "100%",
    height: "60%",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hello: { fontSize: 20, color: "#fff" },
  bold: { fontWeight: "700" },
  date: { color: "#DCE7C8", marginTop: 4 },
  profileCircle: {
    width: 36,
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#c0b6aabd",
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 45,
  },

  commodityCard: {
    backgroundColor: "#def3ea",
    padding: 5,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: "96%",
    alignSelf: "center",
    marginBottom: 20,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  location: {
    fontSize: 20,
    color: "#000000",
  },
  searchInput: { flex: 1, marginLeft: 10, color: "#fff" },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 120 },
  weatherCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -40,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  locationRow: { flexDirection: "row", alignItems: "center" },
  Location: { marginLeft: 5, color: "#666", fontSize: 14 },
  weatherTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cloud: { width: 60, height: 60 },
  temp: { fontSize: 28, fontWeight: "700" },
  weatherStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  stat: { alignItems: "center" },
  statValue: { fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#777" },

  sectionTiTle: {
    marginTop: 10,
    alignSelf: "center",
    fontWeight: "700",
    fontSize: 18,
  },
  sectionTitle: {
    marginTop: 40,
    alignSelf: "center",
    fontWeight: "700",
    fontSize: 18,
    padding: 20,
  },
  sectiontitle: {
    marginTop: 5,
    alignSelf: "center",
    fontSize: 14,
  },
  commodities: { paddingLeft: 8, marginTop: 15 },
  commodity: {
    backgroundColor: "#fff",
    width: 155,
    height: 170,
    marginRight: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  commodityImg: {
    width: 120,
    height: 100,
    marginTop: 10,
    marginBottom: 5,
    resizeMode: "contain",
  },
  commodityText: { fontSize: 12 },
  fieldCard: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  fieldImage: { width: "100%", height: 160 },
  farmFieldImage: { width: "100%", height: 160 },
  fieldButton: {
    backgroundColor: "#297904",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "flex-start",
    width: "90%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
  },

  fieldButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  forecastCard: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
  },
});
