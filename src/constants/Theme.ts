import { Dimensions } from "react-native";

// Responsive scaling helper
const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375; // reference iPhone 12 width
const scale = (size: number) => (width / guidelineBaseWidth) * size;

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export const colors = {
  light: {
    text: '#000',
    white: '#FFFFFF',
    background: "#FFFFFF",
    surface: "#F8F8F8",
    textPrimary: "#111111",
    textSecondary: "#6C6C6C",
    main: "#D7A898",
    mainAccent: "#ECF3E3",
    mainTint: "#ECF3E3",
    muted: "#9D9D9C",
    danger: "#E50000",
    dangerTint: "#FFBCBC",
    warning: "#D27400",
    warningTint: "#D27400",
    accent: "#007AFF",
    border: "#E5E5E5",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    white: '#FFFFFF',
    background: "#121212",
    surface: "#1A1A1A",
    textPrimary: "#FFFFFF",
    textSecondary: "#B3B3B3",
    // main: "#21653C",
    main: '#D7A898',
    mainTint: "#2A322B",
    muted: "#9D9D9C",
    danger: "#D72323",
    dangerTint: "#392927",
    warning: "#D98000",
    warningTint: "#D98000",
    accent: "#0A84FF",
    border: "#2A2A2A",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

// Export responsive function
export { scale };

