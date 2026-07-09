import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import { AgentInstance, AgentStatus } from '@/engine/agent-types';
import { StateIndicator } from './StateIndicator';
import * as THREE from 'three';

interface AgentAvatarProps {
  agent: AgentInstance;
  status: AgentStatus;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({ agent, status }) => {
  const { color, emoji } = agent.spec;
  
  // Simple floating animation
  const meshRef = React.useRef<THREE.Group>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <Box args={[0.6, 0.8, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Head */}
      <Sphere args={[0.3, 32, 32]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={color} />
      </Sphere>

      {/* Status Indicator (rendered as a sprite/billboard for visibility) */}
      <group position={[0, 1.2, 0]}>
        {/* In a real R3F app, we might use a sprite or a plane with a texture for the indicator */}
        {/* For simplicity here, we'll use a small sphere that follows the head */}
        <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
          <meshBasicMaterial color={status === 'working' ? '#10b981' : (status === 'thinking' ? '#60a5fa' : '#9ca3af')} />
        </Sphere>
      </group>
    </group>
  );
};
