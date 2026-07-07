// V0 stub — task board types
export type TaskBoardSource = "local" | "github" | "gitlab" | "jira" | "linear" | "claw3d_manual";
export type TaskBoardStatus = "todo" | "in_progress" | "blocked" | "review" | "done";
export type TaskBoardCard = {
  id: string;
  title: string;
  description?: string;
  status: TaskBoardStatus;
  assignee?: string;
};

export function isTaskBoardSource(v: unknown): v is TaskBoardSource {
  return typeof v === "string" && ["local", "github", "gitlab", "jira", "linear", "claw3d_manual"].includes(v);
}

export function isTaskBoardStatus(v: unknown): v is TaskBoardStatus {
  return typeof v === "string" && ["todo", "in_progress", "blocked", "review", "done"].includes(v);
}
