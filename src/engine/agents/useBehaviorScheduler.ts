// === V0 — BehaviorScheduler React hook ===
// Mounts the autonomy loop when the 3D scene is active.

import { useEffect, useRef } from "react";
import { BehaviorScheduler } from "./BehaviorScheduler";
import type { InteractionEvent } from "./BehaviorScheduler";
import type { SchedulerConfig } from "./BehaviorScheduler";
import { GridMap } from "@/engine/navigation/GridMap";

const DEFAULT_MEETING_POINTS = [
  { x: 10, z: 10 }, // Center
  { x: 3, z: 3 },   // Break room corner
  { x: 17, z: 3 },  // East wing
  { x: 3, z: 17 },  // South area
  { x: 10, z: 3 },  // North center
];

export function useBehaviorScheduler(
  config?: Partial<SchedulerConfig> & {
    gridWidth?: number;
    gridDepth?: number;
    onInteraction?: (event: InteractionEvent) => void;
  },
): void {
  const ref = useRef<BehaviorScheduler | null>(null);

  useEffect(() => {
    if (ref.current) return;

    const grid = new GridMap(
      config?.gridWidth ?? 20,
      config?.gridDepth ?? 20,
    );

    const instance = new BehaviorScheduler(
      grid,
      {
        meetingPoints: DEFAULT_MEETING_POINTS,
        ...config,
      },
      config?.onInteraction,
    );

    instance.start();
    ref.current = instance;

    return () => {
      instance.stop();
      ref.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
