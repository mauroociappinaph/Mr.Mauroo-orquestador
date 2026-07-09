import React from 'react';
import { AgentStatus } from '@/engine/agent-types';

interface StateIndicatorProps {
  status: AgentStatus;
}

export const StateIndicator: React.FC<StateIndicatorProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'idle': return '#9ca3af'; // Gray
      case 'thinking': return '#60a5fa'; // Blue
      case 'working': return '#10b981'; // Green
      case 'error': return '#ef4444'; // Red
      default: return '#9ca3af';
    }
  };

  return (
    <div 
      style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: getStatusColor(),
        border: '2px solid white',
        boxShadow: '0 0 4px rgba(0,0,0,0.5)'
      }}
    />
  );
};
