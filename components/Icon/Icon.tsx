import * as React from "react";
import iconlib from "./iconlib";

interface IconProps {
  icon: keyof typeof iconlib;
  size?: 16 | 24 | 32;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 24,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {iconlib[icon]}
    </svg>
  );
};
