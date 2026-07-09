// === V0 — Agent Layer with smooth A* movement ===
// Reads agent state from store, renders 3D avatars, and interpolates
// along A* paths when BehaviorScheduler writes new positions.

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAgentStore } from '@/stores/agentStore';
import { AgentAvatar } from './AgentAvatar';
import { GridMap } from '@/engine/navigation/GridMap';
import { AStarPathfinder } from '@/engine/navigation/AStarPathfinder';
import type { GridCoordinate } from '@/engine/navigation/GridMap';
import * as THREE from 'three';

const WALK_SPEED = 2; // world units per second
const SNAP_DISTANCE = 0.1; // snap to waypoint when this close
const GRID_SIZE = 20;

// ── Movement state per agent ──────────────────────────────────────
interface AgentAnimState {
  /** Path of grid cells to traverse (cell coordinates, path[0] = start) */
  path: GridCoordinate[];
  /** Index into path — the NEXT waypoint to move toward */
  pathIndex: number;
}

function worldToCell(wx: number, wz: number): GridCoordinate {
  return {
    x: Math.max(0, Math.min(GRID_SIZE - 1, Math.round(wx))),
    z: Math.max(0, Math.min(GRID_SIZE - 1, Math.round(wz))),
  };
}

export const AgentLayer: React.FC = () => {
  const agents = useAgentStore((s) => s.agents);
  const groupRefs = useRef<Map<string, THREE.Group>>(new Map());
  const animStates = useRef<Map<string, AgentAnimState>>(new Map());
  const lastPositions = useRef<Map<string, string>>(new Map());

  const grid = useMemo(() => new GridMap(GRID_SIZE, GRID_SIZE), []);
  const pathfinder = useMemo(() => new AStarPathfinder(), []);

  // ── Per-frame animation loop ─────────────────────────────────
  useFrame((_, delta) => {
    // Prune maps for agents removed from store
    const activeIds = new Set(agents.map((a) => a.spec.id));
    for (const id of groupRefs.current.keys()) {
      if (!activeIds.has(id)) {
        groupRefs.current.delete(id);
        animStates.current.delete(id);
        lastPositions.current.delete(id);
      }
    }

    for (const agent of agents) {
      const group = groupRefs.current.get(agent.spec.id);
      if (!group) continue;

      // Detect store position change
      const posKey = `${agent.position.x},${agent.position.z}`;
      const lastKey = lastPositions.current.get(agent.spec.id) ?? '';

      if (posKey !== lastKey) {
        lastPositions.current.set(agent.spec.id, posKey);

        const startCell = worldToCell(group.position.x, group.position.z);
        const endCell = worldToCell(agent.position.x, agent.position.z);

        if (startCell.x === endCell.x && startCell.z === endCell.z) {
          // Same cell — ensure exact position
          group.position.set(agent.position.x, 0, agent.position.z);
          animStates.current.delete(agent.spec.id);
        } else {
          const path = pathfinder.findPath(grid, startCell, endCell);
          if (path && path.length > 1) {
            animStates.current.set(agent.spec.id, { path, pathIndex: 1 });
          } else {
            // No valid path — teleport the rest of the way
            group.position.set(agent.position.x, 0, agent.position.z);
            animStates.current.delete(agent.spec.id);
          }
        }
      }

      // Step along active path
      const state = animStates.current.get(agent.spec.id);
      if (!state || state.pathIndex >= state.path.length) continue;

      const waypoint = state.path[state.pathIndex];
      const dx = waypoint.x - group.position.x;
      const dz = waypoint.z - group.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= SNAP_DISTANCE) {
        // Arrived at this waypoint — snap and advance
        group.position.set(waypoint.x, 0, waypoint.z);
        state.pathIndex++;
        if (state.pathIndex >= state.path.length) {
          animStates.current.delete(agent.spec.id);
        }
      } else {
        const step = Math.min(WALK_SPEED * delta, dist);
        group.position.x += (dx / dist) * step;
        group.position.z += (dz / dist) * step;
      }
    }
  });

  // ── Render ─────────────────────────────────────────────────
  return (
    <group>
      {agents.map((agent) => (
        <group
          key={agent.spec.id}
          ref={(ref) => {
            if (ref) {
              // Initialize position on first render only
              if (!groupRefs.current.has(agent.spec.id)) {
                ref.position.set(agent.position.x, 0, agent.position.z);
                groupRefs.current.set(agent.spec.id, ref);
              }
            } else {
              // Clean up on unmount — guards against Strict Mode double-fire
              groupRefs.current.delete(agent.spec.id);
            }
          }}
        >
          <AgentAvatar agent={agent} status={agent.status} />
        </group>
      ))}
    </group>
  );
};
