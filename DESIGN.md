# Design: base-oficina-3d

> SDD Technical Design — 2026-07-06
> Derived from: `sdd/base-oficina-3d/proposal`, `sdd/base-oficina-3d/spec`

---

## 1. Architecture Overview

Adapted from CLAW3D's 4-layer architecture, with the Gateway layer replaced by a lightweight Agent Layer.

```
┌─────────────────────────────────────────────────────┐
│                   Browser (R3F)                     │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐   │
│  │  Scene   │ │  Agents  │ │  UI Overlay        │   │
│  │ (R3F)    │ │ (R3F)    │ │ (React)            │   │
│  └────┬─────┘ └────┬─────┘ └────────┬───────────┘   │
│       └────────────┼────────────────┘               │
│                    ▼                                │
│              Zustand Store                          │
│         (agents, scene, settings)                   │
└────────────────────┬────────────────────────────────┘
                     │ WebSocket (JSON messages)
                     ▼
┌─────────────────────────────────────────────────────┐
│               WS Proxy (Node.js)                    │
│  - Gateway removed (no auth)                        │
│  - Agent state broadcast                            │
│  - Binds to 127.0.0.1 only                          │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Agent Layer (in-process)                │
│  - Agent Registry (config-driven)                   │
│  - State Machine (per agent)                        │
│  - Behavior Scheduler (move, work, interact)        │
│  - Persistence (~/.oficina-3d/)                     │
└─────────────────────────────────────────────────────┘
```

### Key Differences from CLAW3D

| Aspect | CLAW3D | oficina-3d |
|--------|--------|------------|
| Gateway | OpenClaw/Hermes auth | Removed entirely |
| Agents | Remote robot control | In-process AI agent simulation |
| WS Proxy | Auth token injection | No auth, state broadcast only |
| Avatars | Robot arm representation | Procedural human-like agents |
| Persistence | ~/.openclaw/claw3d/ | ~/.oficina-3d/ |

---

## 2. Component Tree

```
<App>
  <ThreeCanvas>                          // R3F Canvas
    <OfficeScene>                        // FR-01: 3D environment
      <Floor />
      <Walls />
      <Desks />
      <AmbientLighting />
    </OfficeScene>
    <AgentLayer>                         // FR-02: Agent rendering
      <AgentAvatar                        // One per agent
        role={agent.role}
        position={agent.position}
        state={agent.state}
        color={agent.color}
      />
    </AgentLayer>
  </ThreeCanvas>
  <AgentDebugPanel />                    // Dev: see agent states
</App>
```

### AgentAvatar Sub-components

```
<AgentAvatar>
  <Body geometry={proceduralBody} />
  <Head geometry={proceduralHead} />
  <StateIndicator type={state} />        // FR-04: working/idle/interacting
  <RoleLabel text={role} />
  <NavigationPath />                     // FR-03: A* path visualization
</AgentAvatar>
```

---

## 3. Data Flow

### Zustand Stores

```typescript
// Store: scene
interface SceneStore {
  camera: { position, target }
  lighting: AmbientLight
  // No gateway/connection state
}

// Store: agents (core)
interface AgentStore {
  agents: Map<AgentId, Agent>
  moveAgent(id, position): void
  setAgentState(id, state): void
  registerAgent(config): void
}

// Store: settings
interface SettingsStore {
  officeLayout: LayoutConfig
  agentConfigs: AgentConfig[]
}
```

### WebSocket Messages (WS Proxy → Browser)

```typescript
// Outgoing (server → client)
type ServerMessage =
  | { type: "agent:state_change"; agentId: string; state: AgentState }
  | { type: "agent:moved"; agentId: string; position: Position }
  | { type: "agent:interacted"; from: string; to: string }

// Incoming (client → server) — minimal, no auth
type ClientMessage =
  | { type: "agent:request_move"; agentId: string; target: Position }
```

No authentication messages. No token exchange. No gateway handshake.

---

## 4. Agent System Design

### Agent Data Model

```typescript
interface AgentConfig {
  id: AgentId
  name: string
  role: "architect" | "developer" | "reviewer" | "coordinator"
  color: string
  spawnPosition: Position
}

interface Agent {
  config: AgentConfig
  state: AgentState
  position: Position
  path: Position[]    // Current A* path
  target: Position | null
}

type AgentState = "idle" | "working" | "interacting"
```

### State Machine

```
         ┌──────────────────────────────────┐
         │                                  │
         ▼    task_completed                │
  ┌──────────┐     ┌──────────┐             │
  │  IDLE    │────►│ WORKING  │             │
  │          │     │          │             │
  └────┬─────┘     └────┬─────┘             │
       │                │    idle_timeout    │
       │   ┌────────────┘                   │
       │   ▼                                │
       │  ┌──────────┐                      │
       └──│INTERACT  │                      │
          │ (with X) │──────────────────────┘
          └──────────┘
```

Transitions:
- `idle → working`: Agent picks a task
- `working → idle`: Task completed, no next task
- `idle → interacting`: Another agent nearby initiates interaction
- `interacting → idle`: Interaction ends
- `working → interacting`: Higher-priority interaction (optional in V0)

### Agent Registry

Config-driven, loaded from `~/.oficina-3d/agents.json`:

```json
{
  "agents": [
    { "id": "arch-1", "name": "Architect Alpha", "role": "architect",
      "color": "#4A90D9", "spawnPosition": { "x": 2, "z": 3 } },
    { "id": "dev-1", "name": "Dev Delta", "role": "developer",
      "color": "#7B68EE", "spawnPosition": { "x": 5, "z": 3 } }
  ]
}
```

---

## 5. Scene Layout

Top-down view of the office:

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────────┐         ┌──────────┐          │
│  │Architect │         │Developer │          │
│  │ Zone     │         │ Zone     │          │
│  │  [desk]  │         │  [desk]  │          │
│  └──────────┘         └──────────┘          │
│                                             │
│         ┌────────────────────┐              │
│         │   Meeting Area     │              │
│         │   (interaction)    │              │
│         └────────────────────┘              │
│                                             │
│  ┌──────────└         ┌──────────┐          │
│  │Reviewer  │         │Coordinator│         │
│  │ Zone     │         │ Zone     │          │
│  │  [desk]  │         │  [desk]  │          │
│  └──────────┘         └──────────┘          │
│                                             │
└─────────────────────────────────────────────┘
```

Walkable tiles cover the entire floor. Desks are obstacles. The meeting area is where agents go to "interact".

---

## 6. Module / File Structure

```
oficina-3d/
├── package.json
├── next.config.js
├── tsconfig.json
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          // Next.js root layout
│   │   ├── page.tsx            // Main page (mounts canvas)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── ThreeCanvas.tsx      // R3F Canvas wrapper
│   │   │   ├── OfficeScene.tsx      // FR-01: scene composition
│   │   │   ├── Floor.tsx
│   │   │   ├── Desk.tsx
│   │   │   └── MeetingArea.tsx
│   │   │
│   │   ├── agents/
│   │   │   ├── AgentLayer.tsx       // FR-02: agent container
│   │   │   ├── AgentAvatar.tsx      // Procedural avatar
│   │   │   ├── StateIndicator.tsx   // FR-04: state visual
│   │   │   └── NavigationPath.tsx   // FR-03: path viz
│   │   │
│   │   └── ui/
│   │       └── AgentDebugPanel.tsx  // Dev panel
│   │
│   ├── engine/
│   │   ├── agents/
│   │   │   ├── AgentRegistry.ts     // Agent data + lifecycle
│   │   │   ├── AgentStateMachine.ts // State transitions
│   │   │   └── BehaviorScheduler.ts // Autonomy loop
│   │   │
│   │   ├── navigation/
│   │   │   ├── GridMap.ts           // Walkable grid
│   │   │   └── AStarPathfinder.ts   // FR-03: A* algorithm
│   │   │
│   │   └── scene/
│   │       ├── OfficeLayout.ts      // Scene config
│   │       └── Lighting.ts
│   │
│   ├── stores/
│   │   ├── agentStore.ts            // Zustand: agents
│   │   ├── sceneStore.ts            // Zustand: scene state
│   │   └── settingsStore.ts         // Zustand: settings
│   │
│   ├── server/
│   │   └── proxy.ts                 // WS proxy (no auth)
│   │
│   └── config/
│       ├── agents.default.json      // Default agent config
│       └── office.layout.json       // Default layout
│
├── public/
│   └── (no 3D assets — procedural only)
│
└── scripts/
    └── dev.js                       // Dev launcher
```

---

## 7. WS Proxy Design (Simplified)

### Without Gateway

CLAW3D's proxy injects auth tokens from OpenClaw. Our version strips all of that:

```typescript
// proxy.ts (simplified)
import { WebSocketServer } from "ws"

const wss = new WebSocketServer({ port: 3001, host: "127.0.0.1" })

wss.on("connection", (ws) => {
  // No auth check
  // No token exchange
  // Just register and start broadcasting state

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString())
    // Route to agent layer
    agentLayer.handleMessage(msg)
  })

  // Broadcast agent states to all connected clients
  agentLayer.on("stateChange", (change) => {
    ws.send(JSON.stringify(change))
  })
})
```

### Messages

| Direction | Type | Purpose |
|-----------|------|---------|
| Server → Client | `agent:state_change` | Agent state updated |
| Server → Client | `agent:moved` | Agent position changed |
| Server → Client | `agent:interacted` | Two agents interacting |
| Client → Server | `agent:request_move` | Request agent to move |

---

## 8. Fork Migration Plan

### Phase 1: Strip Gateway (PR 1)

**Files to REMOVE from CLAW3D:**
- `src/gateway/` — entire directory
- Any `GatewayClient`, `OpenClaw` related files
- Auth middleware in WS proxy
- Gateway-related Zustand stores

**Files to MODIFY:**
- WS proxy → remove auth, bind to 127.0.0.1
- `package.json` → remove OpenClaw SDK deps
- Next.js config → remove gateway env vars
- Scene → remove gateway UI elements

**Files to ADD:**
- `src/config/agents.default.json`
- `src/engine/agents/AgentRegistry.ts`
- `src/engine/navigation/GridMap.ts`
- `src/engine/navigation/AStarPathfinder.ts`

### Phase 2: Agent System (PR 2)

**Files to ADD:**
- `src/components/agents/AgentLayer.tsx`
- `src/components/agents/AgentAvatar.tsx`
- `src/components/agents/StateIndicator.tsx`
- `src/stores/agentStore.ts`
- `src/engine/agents/AgentStateMachine.ts`
- `src/engine/agents/BehaviorScheduler.ts`

### Phase 3: Interaction (PR 3)

**Files to ADD/MODIFY:**
- `src/engine/agents/BehaviorScheduler.ts` — add interaction triggers
- `src/server/proxy.ts` — add interaction messages
- Agent state machine → `interacting` state

---

## 9. Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | Zustand | Same as CLAW3D, lightweight |
| WS proxy | Custom Node.js | Already in CLAW3D, just strip auth |
| Avatars | Procedural geometry | No asset pipeline needed for V0 |
| Navigation | A* grid-based | Already in CLAW3D |
| Persistence | Local JSON files | Simple, no DB needed for V0 |
| Agent config | JSON file | Data-driven, easy to add agents |
