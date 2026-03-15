import { Feather, Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("index")}
      >
        <Ionicons
          name="home-outline"
          size={30}
          color={state.index === 0 ? "#16a34a" : "#777"}
        />
        <Text style={state.index === 0 ? styles.navTextActive : styles.navText}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("crops")}
      >
        <Ionicons
          name="leaf-outline"
          size={30}
          color={state.index === 1 ? "#16a34a" : "#777"}
        />
        <Text style={state.index === 1 ? styles.navTextActive : styles.navText}>
          My Crops
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate("camera")}
      >
        <Ionicons name="camera" size={25} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("groups")}
      >
        <Feather
          name="users"
          size={30}
          color={state.index === 3 ? "#16a34a" : "#777"}
        />
        <Text style={state.index === 3 ? styles.navTextActive : styles.navText}>
          Feeds
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("profile")}
      >
        <Feather
          name="user"
          size={30}
          color={state.index === 4 ? "#16a34a" : "#777"}
        />
        <Text style={state.index === 4 ? styles.navTextActive : styles.navText}>
          My Farm
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 10,
    margin: 10,
    height: 100,
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 8,
    color: "#777",
  },

  navTextActive: {
    fontSize: 10,
    color: "#0f6e02",
  },

  cameraButton: {
    backgroundColor: "#0f6e02",
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
