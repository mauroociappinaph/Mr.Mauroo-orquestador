import React from 'react';
import { useAgentStore } from '@/stores/agentStore';
import { AgentAvatar } from './AgentAvatar';

export const AgentLayer: React.FC = () => {
  const agents = useAgentStore((state) => state.agents);

  return (
    <group>
      {agents.map((agent) => (
        <group key={agent.spec.id} position={[agent.position.x, 0, agent.position.z]}>
           <AgentAvatar agent={agent} status={agent.status} />
        </group>
      ))}
    </group>
  );
};
