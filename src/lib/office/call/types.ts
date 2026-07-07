// V0 stub — phone call types
export type MockPhoneCallScenario = {
  id: string;
  callerName: string;
  status: "ringing" | "connected" | "ended";
  dialNumber: string;
  spokenText: string;
  recipientReply: string;
};
