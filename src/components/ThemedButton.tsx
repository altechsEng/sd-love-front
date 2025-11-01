// src/components/ThemedButton.tsx
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { colors } from "../constants/Theme";
import { typography } from "../constants/Typography";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: "filled" | "outlined" | "text";
  isLoading?: boolean;
  borderRadius?: number;
}

export const ThemedButton: React.FC<Props> = ({
  label,
  onPress,
  variant = "filled",
  isLoading,
  borderRadius= 10
}) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? colors.dark : colors.light;

  const isFilled = variant === "filled";
  const isOutlined = variant === "outlined";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: isFilled ? theme.main : "transparent",
          borderColor: isOutlined ? theme.main : "transparent",
          borderWidth: isOutlined ? 1 : 0,
          borderRadius: borderRadius,
        },
      ]}
      activeOpacity={0.8}
    >
      {isLoading === true ? (
        <ActivityIndicator color={theme.textPrimary} />
      ) : (
        <Text
          style={[
            typography.button,
            { color: isFilled ? "#FFFFFF" : theme.main },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    // borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
