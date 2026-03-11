import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
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
