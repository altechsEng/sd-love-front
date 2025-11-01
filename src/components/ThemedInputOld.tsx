// src/components/ThemedInput.tsx
import React from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    useColorScheme,
} from "react-native";
import { colors } from "../constants/Theme";
import { typography } from "../constants/Typography";

type props = {
  name: string;
  placeholder: string;
  onChangeText: () => void;
  state: any;
  value: any;
  secure: boolean;
};

export const ThemedInputOld: React.FC<TextInputProps> = (props) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? colors.dark : colors.light;
  const { placeholder} = props;

  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      style={[
        typography.body,
        styles.input,
        {
          color: theme.textPrimary,
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
      placeholder={placeholder}
    //   onChangeText={onChangeText}
    //   name={name}
    //   value={state}
    //   secureTextEntry={secure}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    width: "100%",
  },
});
