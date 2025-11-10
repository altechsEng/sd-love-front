import { useAuth } from "@/src/context/AuthContext";
import { Redirect, Stack } from "expo-router";


export default function AuthLayout() {
  const { isAuthenticated, user } = useAuth();
  const hasOnboarded = true;

  if (isAuthenticated) {
    return <Redirect href={'/protected/(tabs)'} />
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      <Stack.Screen name="account-created" options={{ headerShown: false }} />
      <Stack.Screen name="account-deleted" options={{ headerShown: false }} />
      <Stack.Screen name="register-step-1" options={{ headerShown: false }} />
      <Stack.Screen name="register-step-2" options={{ headerShown: false }} />
      <Stack.Screen name="register-step-3" />
      <Stack.Screen name="register-step-4" />
      <Stack.Screen name="questionaire" options={{ headerShown: false }} />
    

    </Stack>
  );
}
