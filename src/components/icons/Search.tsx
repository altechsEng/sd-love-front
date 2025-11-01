import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SearchIconProps {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  filled?: boolean;
}

export const SearchIcon: React.FC<SearchIconProps> = ({
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
        d="M15.0258 13.8476L18.595 17.4159L17.4158 18.5951L13.8475 15.0259C12.5198 16.0903 10.8683 16.6692 9.16666 16.6667C5.02666 16.6667 1.66666 13.3067 1.66666 9.16675C1.66666 5.02675 5.02666 1.66675 9.16666 1.66675C13.3067 1.66675 16.6667 5.02675 16.6667 9.16675C16.6691 10.8684 16.0902 12.5199 15.0258 13.8476ZM13.3542 13.2292C14.4115 12.1415 15.0021 10.6837 15 9.16675C15 5.94425 12.3892 3.33341 9.16666 3.33341C5.94416 3.33341 3.33333 5.94425 3.33333 9.16675C3.33333 12.3892 5.94416 15.0001 9.16666 15.0001C10.6836 15.0022 12.1414 14.4116 13.2292 13.3542L13.3542 13.2292Z"
        fill={color}
      />
    </Svg>
  );
};

export default SearchIcon;
