// V0 stub — desk monitor types (expanded for MonitorImmersiveContent compat)
export type OfficeDeskMonitorEntry = {
  id: string;
  text: string;
  ts: number;
  kind?: string;
  live?: boolean;
};

export type OfficeDeskMonitorEditor = {
  fileName: string;
  cursorColumn: number;
  cursorLine: number;
  language: string;
  lines: string[];
  terminalLines: string[];
};

export type OfficeDeskMonitor = {
  agentId: string;
  agentName: string;
  label: string;
  title?: string;
  subtitle?: string;
  url?: string;
  browserUrl?: string;
  live: boolean;
  editor?: OfficeDeskMonitorEditor;
  mode?: "log" | "stream" | "terminal" | "browser";
  entries: OfficeDeskMonitorEntry[];
};
export type OfficeDeskMonitorMap = Record<string, OfficeDeskMonitor>;
