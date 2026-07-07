import React from 'react';
import { useAgentStore } from '@/stores/agentStore';
import { AgentAvatar } from './AgentAvatar';

export const AgentLayer: React.FC = () => {
  const agents = useAgentStore((state) => state.agents);

  return (
    <group>
      {agents.map((agent) => (
        <group key={agent.spec.id} position={[agent.deskId ? 0 : 0, 0, 0] /* TODO: Actual desk position */}>
           <AgentAvatar agent={agent} status={agent.status} />
        </group>
      ))}
    </group>
  );
};
