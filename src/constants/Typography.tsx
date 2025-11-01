// typography.ts
import { StyleSheet, TextStyle } from "react-native";
import { scale } from "./Theme";

export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
};

export const fontSize = {
  display: scale(32),
  headline: scale(24),
  title: scale(20),
  subtitle: scale(18),
  body: scale(16),
  bodySmall: scale(14),
  caption: scale(12),
  overline: scale(10),
};

export const lineHeight = {
  display: scale(40),
  headline: scale(32),
  title: scale(28),
  subtitle: scale(26),
  body: scale(24),
  bodySmall: scale(22),
  caption: scale(18),
  overline: scale(14),
};

export const typography = StyleSheet.create({
  display: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    letterSpacing: 0.5,
  } as TextStyle,

  headline: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.headline,
    lineHeight: lineHeight.headline,
  } as TextStyle,

  title: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.title,
    lineHeight: lineHeight.title,
  } as TextStyle,

  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.subtitle,
    lineHeight: lineHeight.subtitle,
  } as TextStyle,

  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodySmall,
    lineHeight: lineHeight.bodySmall,
    color: "#6C6C6C",
  } as TextStyle,

  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    letterSpacing: 0.3,
  } as TextStyle,

  overline: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.overline,
    lineHeight: lineHeight.overline,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  } as TextStyle,

  button: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    lineHeight: scale(20),
    textAlign: "center",
  } as TextStyle,
});
