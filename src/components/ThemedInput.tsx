import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
// import { useTheme } from "../context/ThemeContext";
import { colors } from "../constants/Theme";
import Eye from "./icons/Eye";
import EyeOff from "./icons/EyeOff";

interface ThemedInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  passwordToggle?: boolean;
  borderRadius?: number;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  style,
  containerStyle,
  passwordToggle = false,
  secureTextEntry,
  value,
  onChangeText,
  borderRadius = 10,
  ...props
}) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? colors.dark : colors.light;
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isControlled = value !== undefined;
  const isSecureField = passwordToggle || secureTextEntry;

  // keep internal value synced when controlled
  useEffect(() => {
    if (isControlled) setInternalValue(value ?? "");
  }, [value, isControlled]);

  const handleChangeText = (text: string) => {
    if (!isControlled) setInternalValue(text);
    if (onChangeText) onChangeText(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: borderRadius,
        },
        containerStyle,
      ]}
    >
      {/* Left Icon */}
      {leftIcon && (
        <TouchableOpacity
          onPress={onLeftIconPress}
          disabled={!onLeftIconPress}
          style={styles.iconWrapper}
        >
          {leftIcon}
        </TouchableOpacity>
      )}

      {/* Text Input */}
      <TextInput
        value={internalValue}
        onChangeText={handleChangeText}
        placeholderTextColor={theme.muted}
        style={[
          styles.input,
          {
            color: theme.text,
          },
          style,
        ]}
        secureTextEntry={isSecureField && !isPasswordVisible}
        {...props}
      />

      {/* Password Toggle or Right Icon */}
      {isSecureField ? (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconWrapper}
        >
          {isPasswordVisible ? (
            <EyeOff color={theme.textSecondary} />
          ) : (
            <Eye color={theme.textSecondary} />
          )}
        </TouchableOpacity>
      ) : (
        rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.iconWrapper}
          >
            {rightIcon}
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    // borderRadius: 10,
    paddingHorizontal: 10,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconWrapper: {
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
