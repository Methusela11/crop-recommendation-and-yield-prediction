import * as NavigationBar from "expo-navigation-bar";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import CustomTabBar from "../../components/CustomTabBar";

export default function TabLayout() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#ffffff");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="crops" />
      <Tabs.Screen name="camera" />
      <Tabs.Screen name="groups" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

