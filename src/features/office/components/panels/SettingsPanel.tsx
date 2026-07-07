// V0 stub — settings panel, no gateway
"use client";

import type { StudioGatewayAdapterType } from "@/lib/studio/settings";
import { X } from "lucide-react";

// V0 stub — all known props
type SettingsPanelProps = {
  gatewayStatus?: string;
  gatewayUrl?: string;
  gatewayToken?: string;
  selectedAdapterType?: StudioGatewayAdapterType;
  activeAdapterType?: StudioGatewayAdapterType;
  onGatewayDisconnect?: () => void;
  onGatewayConnect?: () => void;
  onGatewayUrlChange?: (value: string) => void;
  onGatewayTokenChange?: (value: string) => void;
  onGatewayAdapterTypeChange?: (value: StudioGatewayAdapterType) => void;
  onOpenOnboarding?: () => void;
  officeTitle: string;
  officeTitleLoaded: boolean;
  onOfficeTitleChange?: (title: string) => void;
  onClose?: () => void;
  remoteOfficeEnabled?: boolean;
  remoteOfficeSourceKind?: "presence_endpoint" | "openclaw_gateway";
  remoteOfficeLabel?: string;
  remoteOfficePresenceUrl?: string;
  remoteOfficeGatewayUrl?: string;
  remoteOfficeTokenConfigured?: boolean;
  onRemoteOfficeEnabledChange?: (enabled: boolean) => void;
  onRemoteOfficeSourceKindChange?: (kind: "presence_endpoint" | "openclaw_gateway") => void;
  onRemoteOfficeLabelChange?: (label: string) => void;
  onRemoteOfficePresenceUrlChange?: (url: string) => void;
  onRemoteOfficeGatewayUrlChange?: (url: string) => void;
  onRemoteOfficeTokenChange?: (token: string) => void;
  voiceRepliesEnabled?: boolean;
  voiceRepliesVoiceId?: string | null;
  voiceRepliesSpeed?: number;
  voiceRepliesLoaded?: boolean;
  onVoiceRepliesToggle?: (enabled: boolean) => void;
  onVoiceRepliesVoiceChange?: (voiceId: string) => void;
  onVoiceRepliesSpeedChange?: (speed: number) => void;
  onVoiceRepliesPreview?: (voiceId: string, voiceName: string) => void;
};

export function SettingsPanel(_props: SettingsPanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Settings</h2>
        <div>
          <X size={18} className="text-muted-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Office Title</label>
        <input
          className="rounded border bg-background px-3 py-2 text-sm"
          value=""
          disabled
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
