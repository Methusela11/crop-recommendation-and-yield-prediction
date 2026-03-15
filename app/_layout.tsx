//app/_layout.tsx
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#76A7CE"); // match your screen color
    NavigationBar.setButtonStyleAsync("dark"); // dark icons
  }, []);
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Start / onboarding screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="soil" options={{ headerShown: false }} />

        {/* Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modal */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
