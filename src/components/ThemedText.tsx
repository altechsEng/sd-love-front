// src/components/ThemedText.tsx
import React from "react";
import { Text, TextStyle, useColorScheme } from "react-native";
import { colors } from "../constants/Theme";
import { typography } from "../constants/Typography";

interface Props {
  variant?: keyof typeof typography;
  color?: keyof typeof colors.light;
  children: React.ReactNode;
  style?: TextStyle;
}

export const ThemedText: React.FC<Props> = ({ variant = "body", color = "textPrimary", style, children }) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? colors.dark : colors.light;

  return <Text style={[typography[variant], { color: theme[color] }, style]}>{children}</Text>;
};
