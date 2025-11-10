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

export default function ProtectedLayout() {
  const { isAuthenticated, user } = useAuth();
  const hasOnboarded = true;
  //  console.log(isAuthenticated, user, user.firstname, user.user_infos);

//   if (!isAuthenticated) {
//     return <Redirect href={'/login'} />
//   }

  return (
    <React.Fragment>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dating" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="posts" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </React.Fragment>
  );
}
