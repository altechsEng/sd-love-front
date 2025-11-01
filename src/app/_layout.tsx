import { Text, View } from "react-native";
import React, { Component } from "react";
import { Stack } from "expo-router";
import "../../global.css";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalVariableProvider } from "../context/global";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const isLoggedIn = false;
  const queryClient = new QueryClient();

  return (
    <React.Fragment>
      <GestureHandlerRootView>
        <GlobalVariableProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <StatusBar style="auto" />
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="protected"
                  options={{ headerShown: false }}
                />
                {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
              </Stack>
            </QueryClientProvider>
          </AuthProvider>
        </GlobalVariableProvider>
      </GestureHandlerRootView>
    </React.Fragment>
  );
}
