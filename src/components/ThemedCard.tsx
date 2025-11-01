// src/components/ThemedCard.tsx
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { colors } from "../constants/Theme";

type Props = {
  children: React.ReactNode;
  style?: any;
};

export const ThemedCard: React.FC<Props> = ({ children, style }) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? colors.dark : colors.light;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
});
