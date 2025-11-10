import { useAuth } from "@/src/context/AuthContext";
import axios from "axios";
import { Redirect, Stack } from "expo-router";
import React from "react";

axios.defaults.baseURL = "https://sdlove-api.altechs.africa";
// axios.defaults.baseURL = "http://192.168.1.103:8000";
axios.defaults.headers.post["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default function DatingLayout() {

//   if (!isAuthenticated) {
//     return <Redirect href={'/login'} />
//   }

  return (
    <React.Fragment>
      <Stack>
        <Stack.Screen name="engagement-request-sent" options={{ headerShown: false }} />
        <Stack.Screen name="match-connection" options={{ headerShown: false }} />
        <Stack.Screen name="match-profile" options={{ headerShown: false }} />
        <Stack.Screen name="match-screen-box" options={{ headerShown: false }} />
        <Stack.Screen name="match-screen-grid" options={{ headerShown: false }} />
        <Stack.Screen name="match-screen-side" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </React.Fragment>
  );
}
