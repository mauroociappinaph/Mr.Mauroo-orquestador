// V0 stub — GitHub immersive
"use client";

import { Github } from "lucide-react";

// V0 stub type
export type SkillStatusEntry = Record<string, unknown>;

export type GithubImmersiveScreenProps = {
  agentName: string | null;
  githubSkill: SkillStatusEntry | null;
  onOpenSetup: (() => void) | undefined;
};

export function GithubImmersiveScreen({ agentName, githubSkill, onOpenSetup }: GithubImmersiveScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <Github size={48} className="text-muted-foreground" />
      <p className="text-muted-foreground">GitHub — V0 placeholder</p>
    </div>
  );
}
