// V0 — oficina-3d office page with RetroOffice3D + engine store
"use client";

import { RetroOffice3D } from "@/features/retro-office/RetroOffice3D";
import { useAgentStore } from "@/stores/agentStore";
import { useBehaviorScheduler } from "@/engine/agents/useBehaviorScheduler";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { InteractionEvent } from "@/engine/agents/BehaviorScheduler";
import type { OfficeAgent } from "@/features/retro-office/core/types";

export default function OfficePage() {
  const agents = useAgentStore((s) => s.agents);
  const wsRef = useRef<WebSocket | null>(null);

  // V0 — connect to the local WS relay for interaction broadcasts
  useEffect(() => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${location.host}/ws`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      console.info("[OfficePage] WS connected");
    });
    ws.addEventListener("close", () => {
      console.info("[OfficePage] WS disconnected");
    });
    ws.addEventListener("error", (err) => {
      console.warn("[OfficePage] WS error:", err);
    });

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  // V0 — broadcast interaction events over the WS relay
  const onInteraction = useCallback((event: InteractionEvent) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(
      JSON.stringify({
        type: "broadcast",
        payload: {
          type: "interaction",
          from: event.from,
          to: event.to,
          kind: event.type,
        },
      }),
    );
  }, []);

  // V0 — starts the agent autonomy loop (proximity interactions, work scheduling)
  useBehaviorScheduler({ onInteraction });

  const officeAgents: OfficeAgent[] = useMemo(
    () =>
      agents.map((a) => ({
        id: a.spec.id,
        name: a.spec.name,
        subtitle: a.spec.role,
        status: a.status === "error" ? "error" : a.status === "idle" ? "idle" : "working",
        color: a.spec.color,
        item: a.spec.emoji,
      })),
    [agents],
  );

  return (
    <div className="h-dvh w-full">
      <RetroOffice3D
        agents={officeAgents}
        officeTitle="oficina-3d V0"
        officeTitleLoaded={true}
      />
    </div>
  );
}
