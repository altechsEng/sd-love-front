// src/components/ThemedView.tsx
import React from "react";
import { View, useColorScheme } from "react-native";
import { colors } from "../constants/Theme";

type Props = React.ComponentProps<typeof View>;

export const ThemedView: React.FC<Props> = ({ style, ...rest }) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? colors.dark : colors.light;

  return <View style={[{ backgroundColor: theme.background }, style]} {...rest} />;
};
