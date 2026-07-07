// V0 stub — text message types
export type MockTextMessageScenario = {
  id: string;
  senderName: string;
  messages: { text: string; from: "me" | "them" }[];
  recipient?: string;
  messageText?: string;
  confirmationText?: string;
};
