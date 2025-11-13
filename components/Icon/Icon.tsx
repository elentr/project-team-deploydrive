import React from "react";
import cn from "classnames";
import styles from "./Icon.module.css";

interface IconProps {
  name: string;     
  className?: string; 
  size?: number; 
  width?: number;
  height?: number;     
  onClick?: (e: React.MouseEvent<SVGElement>) => void;
}

export default function Icon({ 
  name, 
  className, 
  size,
  width,
  height, 
  onClick, 
}: IconProps) {

  const finalWidth = width ?? size ?? 24;
  const finalHeight = height ?? size ?? 24;


  return (
    <svg
      width={finalWidth}
      height={finalHeight}
      onClick={onClick}
      className={cn(styles.icon, className)}
      aria-hidden="true"
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
}
