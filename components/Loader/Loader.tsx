import type { CSSProperties } from "react";
import styles from "./Loader.module.css";

interface LoaderProps {
  size?: number;
  label?: string;
  className?: string;
}

export default function Loader({
  size = 64,
  label = "Loading, please wait...",
  className,
}: LoaderProps) {
  const customStyle = {
    "--loader-size": `${size}px`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.loading} ${className ?? ""}`.trim()}
      role="status"
      aria-live="polite"
    >
      <div className={styles.loader} style={customStyle} aria-hidden="true" />
      {label && <p className={styles.text}>{label}</p>}
    </div>
  );
}
