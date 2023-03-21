import * as React from "react";
import { Icon } from "./Icon/Icon";
import iconlib from "./Icon/iconlib";

interface IconButtonProps {
  id?: string;
  size: 16 | 24 | 32;
  icon: keyof typeof iconlib;
  onClick: () => void;
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  id,
  onClick,
  label,
  size = 24,
  icon,
}) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className="bg-gray-900 relative hover:bg-gray-800 group w-8 h-8 flex items-center justify-center"
    >
      <div className="left-full pointer-events-none absolute opacity-0 whitespace-nowrap -translate-x-24 group-hover:opacity-100 group-hover:translate-x-2">
        {label}
      </div>
      <Icon icon={icon} size={size} />
    </button>
  );
};
