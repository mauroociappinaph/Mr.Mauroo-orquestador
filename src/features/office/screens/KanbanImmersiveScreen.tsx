// V0 stub — Kanban immersive
"use client";

import { Columns3 } from "lucide-react";
import type { AgentState } from "@/features/agents/state/store";
import type { TaskBoardCard, TaskBoardStatus } from "@/features/office/tasks/types";
import type { CronJobSummary } from "@/lib/cron/types";

export type KanbanImmersiveScreenProps = {
  agents?: AgentState[];
  cardsByStatus?: Record<TaskBoardStatus, TaskBoardCard[]>;
  selectedCard?: TaskBoardCard | null;
  activeRuns?: Array<{ runId: string; agentId: string; label: string }>;
  cronJobs?: CronJobSummary[];
  cronLoading?: boolean;
  cronError?: string | null;
  taskCaptureDebug?: string | null;
  onCreateCard?: () => void;
  onMoveCard?: (cardId: string, status: TaskBoardStatus) => void;
  onSelectCard?: (cardId: string | null) => void;
  onUpdateCard?: (cardId: string, patch: Partial<TaskBoardCard>) => void;
  onDeleteCard?: (cardId: string) => void;
  onRefreshCronJobs?: () => void;
  onClose?: () => void;
};

export function KanbanImmersiveScreen(_props: KanbanImmersiveScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <Columns3 size={48} className="text-muted-foreground" />
      <p className="text-muted-foreground">Task Board — V0 placeholder</p>
    </div>
  );
}
