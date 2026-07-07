// V0 stub — no gateway, simple loader
import type { CSSProperties } from "react";

export function RunningAvatarLoader({
  size = 24,
  trackWidth = 60,
  label,
  labelClassName,
  inline,
}: {
  size?: number;
  trackWidth?: number;
  label?: string;
  labelClassName?: string;
  inline?: boolean;
}) {
  if (inline) {
    return (
      <div
        className="inline-flex animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      />
    );
  }
  return (
    <div
      style={
        { "--size": `${size}px`, "--track": `${trackWidth}%` } as CSSProperties
      }
      className="flex flex-col items-center gap-2"
    >
      <div
        className="h-(--size) w-(--size) animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ width: size, height: size }}
      />
      {label && <span className={labelClassName ?? ""}>{label}</span>}
    </div>
  );
}
