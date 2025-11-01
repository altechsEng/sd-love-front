import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

interface PhoneProps {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  filled?: boolean;
}

export const Phone: React.FC<PhoneProps> = ({
  color = "#000",
  size = 24,
  style,
  filled = false,
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <Path
        d="M15.25 2.75H8.75C7.09315 2.75 5.75 4.09315 5.75 5.75V18.25C5.75 19.9069 7.09315 21.25 8.75 21.25H15.25C16.9069 21.25 18.25 19.9069 18.25 18.25V5.75C18.25 4.09315 16.9069 2.75 15.25 2.75Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 17.75H13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Phone;
