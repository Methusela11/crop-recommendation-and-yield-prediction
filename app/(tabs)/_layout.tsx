import * as NavigationBar from "expo-navigation-bar";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";

export default function TabLayout() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#ffffff");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#def3ea",
          height: 100,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,

          position: "absolute",
          elevation: 10,
        },

        tabBarActiveTintColor: "#159105",
        tabBarInactiveTintColor: "#000000",

        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          marginTop: 10,
        },

        tabBarIcon: ({ focused }) => {
          let iconImage;

          switch (route.name) {
            case "index":
              iconImage = require("../../assets/images/icons/1111.png");
              break;
            case "farm":
              iconImage = require("../../assets/images/icons/1.png");
              break;
            case "advice":
              iconImage = require("../../assets/images/icons/11111.png");
              break;
            case "yields":
              iconImage = require("../../assets/images/icons/11.png");
              break;
            case "statistics":
              iconImage = require("../../assets/images/icons/111.png");
              break;
            default:
              iconImage = require("../../assets/images/icons/111111.png");
          }

          if (focused) {
            return (
              <View
                style={{
                  width: 50,
                  height: 35,
                  borderRadius: 30,
                  backgroundColor: "#159105",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Image
                  source={iconImage}
                  style={{ width: 35, height: 33, resizeMode: "contain" }}
                />
              </View>
            );
          }

          return (
            <Image
              source={iconImage}
              style={{ width: 35, height: 32, resizeMode: "contain" }}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="yields" options={{ title: "Yields" }} />
      <Tabs.Screen name="advice" options={{ title: "Advice" }} />
      <Tabs.Screen name="statistics" options={{ title: "Stats" }} />
      <Tabs.Screen name="farm" options={{ title: "Farm" }} />
    </Tabs>
  );
}
