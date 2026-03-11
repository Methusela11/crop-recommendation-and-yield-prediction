import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { Tabs } from "expo-router";
import { useEffect } from "react";


export default function TabLayout() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#76A7CE"); // match your screen color
    NavigationBar.setButtonStyleAsync("dark"); // dark icons
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 130,
          paddingTop: 15,
          paddingBottom: 10,
          backgroundColor: "#111",
          borderTopWidth: 0,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },

        tabBarIconStyle: {
          marginBottom: 2,
        },

        tabBarActiveTintColor: "#038109",
        tabBarInactiveTintColor: "#a8a7a7",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="recommendation"
        options={{
          title: "Recommendation",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
