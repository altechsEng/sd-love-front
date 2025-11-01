import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

interface LockProps {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  filled?: boolean;
}

export const Lock: React.FC<LockProps> = ({
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
        d="M4 13C4 11.114 4 10.172 4.586 9.586C5.172 9 6.114 9 8 9H16C17.886 9 18.828 9 19.414 9.586C20 10.172 20 11.114 20 13V15C20 17.828 20 19.243 19.121 20.121C18.243 21 16.828 21 14 21H10C7.172 21 5.757 21 4.879 20.121C4 19.243 4 17.828 4 15V13Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 8V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z"
        fill={color}
      />
    </Svg>
  );
};

export default Lock;
