import React from 'react';
import { Canvas } from '@react-three/fiber';
import { RetroOffice3D } from '@/features/retro-office/RetroOffice3D';
import { AgentLayer } from '@/components/agents/AgentLayer';
import type { OfficeAgent } from '@/features/retro-office/core/types';
import { useAgentStore } from '@/stores/agentStore';

interface OfficeSceneProps {
  officeAgents: OfficeAgent[];
  officeTitle: string;
  officeTitleLoaded: boolean;
}

export const OfficeScene: React.FC<OfficeSceneProps> = ({
  officeAgents,
  officeTitle,
  officeTitleLoaded,
}) => {
  // In V0, we are transitioning to the new agent store.
  // For now, we'll use the passed officeAgents for compatibility with RetroOffice3D
  // while we work on full integration.
  
  return (
    <Canvas shadows camera={{ position: [0, 10, 15], fov: 50 }}>
      <color attach="background" args={['#120e08']} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />

      <RetroOffice3D
        agents={officeAgents}
        officeTitle={officeTitle}
        officeTitleLoaded={officeTitleLoaded}
      />

      {/* The new AgentLayer will be added here, but it needs to be 
          integrated with the existing RetroOffice3D scene. 
          For now, we'll just leave it as a placeholder. */}
      {/* <AgentLayer /> */}
    </Canvas>
  );
};
