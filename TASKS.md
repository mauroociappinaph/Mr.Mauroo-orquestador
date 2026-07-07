# Tasks: base-oficina-3d

> SDD Implementation Tasks — 2026-07-06
> Delivery: force-chained PRs via feature-branch-chain

## Review Workload Forecast

- **Estimated changed lines**: ~1200 (across 3 PRs)
- **400-line budget risk**: High
- **Chained PRs recommended**: Yes (3 PRs)
- **Decision needed before apply**: No (force-chained already approved)

---

## PR 1 — Fork & Strip

> Branch: `pr/1-fork-strip`
> Target: `main`

### T1.1 — Create remote GitHub repository

Create the remote repo and configure origin.

**Files:**
- (git config)

**Acceptance:**
- `gh repo create` succeeds for `oficina-3d`
- `git remote -v` shows origin pointing to GitHub
- Initial push of `main` branch succeeds

**Commit**: `chore: init oficina-3d repo with README`

---

### T1.2 — Scaffold from CLAW3D fork

Copy CLAW3D source, remove gateway/OpenClaw dependencies, clean package.json.

**Files:**
- `package.json` — remove `@openclaw/*` deps, `openclaw-sdk`, gateway config
- `next.config.js` — remove gateway env vars
- `tsconfig.json` — adjust paths
- Remove `src/gateway/` entirely
- Remove gateway-related Zustand stores
- Remove gateway UI components from scene

**Acceptance:**
- `npm install` completes without errors
- `npm run dev` starts without crashing
- Scene renders with no gateway elements visible
- No OpenClaw/gateway imports remain in the codebase

**Commit**: `refactor: scaffold from CLAW3D, strip gateway and OpenClaw deps`

---

### T1.3 — Simplify WS proxy (no auth)

Strip auth from the WebSocket proxy and bind to 127.0.0.1.

**Files:**
- `src/server/proxy.ts` — remove auth token injection, remove gateway handshake messages
- Remove auth middleware files

**Acceptance:**
- WS proxy starts on `127.0.0.1:3001` (no external binding)
- Client connects without sending any auth token
- `server:state` messages flow without authentication

**Commit**: `refactor: strip auth from WS proxy, bind localhost only`

---

### T1.4 — Add base agents config and engine scaffold

Create the agent configuration file and empty engine modules.

**Files:**
- `src/config/agents.default.json` — 4 default agents (architect, developer, reviewer, coordinator)
- `src/engine/agents/AgentRegistry.ts` — class with `register`, `getAll`, `getById`
- `src/engine/navigation/GridMap.ts` — grid definition from scene layout
- `src/engine/navigation/AStarPathfinder.ts` — A* implementation
- `src/stores/agentStore.ts` — Zustand store skeleton

**Acceptance:**
- `AgentRegistry` can register and retrieve agents from config
- `AStarPathfinder.findPath(start, end, grid)` returns valid path array
- `agentStore` is importable with default state

**Commit**: `feat: add agent registry, grid map, A* pathfinder, and Zustand store`

---

### T1.5 — Create PR #1

Push branch and open PR.

**Commands:**
- `git checkout -b pr/1-fork-strip`
- Commit all T1.x changes atomically (4 commits)
- `git push origin pr/1-fork-strip`
- `gh pr create --title "PR 1: Fork CLAW3D and strip gateway"`

---

## PR 2 — Agent System

> Branch: `pr/2-agent-system`
> Target: `main`

### T2.1 — Implement AgentStateMachine

Create the state machine with transitions: idle ↔ working ↔ interacting.

**Files:**
- `src/engine/agents/AgentStateMachine.ts`

**Acceptance:**
- `AgentStateMachine` starts in `idle`
- Can transition: `idle → working`, `working → idle`, `idle → interacting`, `interacting → idle`
- Invalid transitions are no-ops (logged)
- State change emits an event/callback

**Commit**: `feat: add agent state machine with idle/working/interacting`

---

### T2.2 — Implement BehaviorScheduler

Create the autonomy loop that drives agent behavior over time.

**Files:**
- `src/engine/agents/BehaviorScheduler.ts`

**Acceptance:**
- Scheduler picks a random "work" destination for each idle agent periodically
- Agent transitions `idle → working` when moving
- Agent arrives at destination → starts "working" for a random duration
- After work duration → transitions back to `idle`
- Scheduler runs at configurable tick interval (default: 5s)

**Commit**: `feat: add behavior scheduler for agent autonomy loop`

---

### T2.3 — Implement AgentAvatar (3D component)

Create the procedural 3D avatar that renders in the office scene.

**Files:**
- `src/components/agents/AgentLayer.tsx`
- `src/components/agents/AgentAvatar.tsx`
- `src/components/agents/StateIndicator.tsx`

**Acceptance:**
- `AgentAvatar` renders a procedural body + head per agent
- Avatar color matches `agent.config.color`
- `StateIndicator` shows different visuals for idle/working/interacting
- Agents appear at their `spawnPosition` on scene load
- No external 3D assets loaded

**Commit**: `feat: add procedural agent avatars with state indicators`

---

### T2.4 — Wire agents into scene

Connect AgentRegistry + Zustand store + AgentLayer in the main scene.

**Files:**
- `src/app/page.tsx` — mount scene with agents
- `src/components/canvas/OfficeScene.tsx` — integrate AgentLayer
- `src/stores/agentStore.ts` — connect to AgentRegistry

**Acceptance:**
- Scene loads and shows 4 agents at their spawn positions
- Each agent shows its role color and state indicator
- Agents start in `idle` state
- No console errors on load

**Commit**: `feat: wire agents into office scene`

---

### T2.5 — Create PR #2

- `git checkout main && git pull`
- `git checkout -b pr/2-agent-system`
- Commit all T2.x changes (4 commits)
- `git push origin pr/2-agent-system`
- `gh pr create --title "PR 2: Agent system with state machine and avatars"`

---

## PR 3 — Agent Interaction

> Branch: `pr/3-agent-interaction`
> Target: `main`

### T3.1 — Implement interaction triggers in BehaviorScheduler

Add proximity-based interaction logic to the scheduler.

**Files:**
- `src/engine/agents/BehaviorScheduler.ts`

**Acceptance:**
- When two agents are within `INTERACTION_DISTANCE`, both transition to `interacting`
- Interaction lasts a configurable duration (default: 8s)
- After interaction ends, both return to `idle`
- Agents can be scheduled to meet (walk to meeting area)
- Interaction state broadcasts via WS

**Commit**: `feat: add proximity-based agent interaction triggers`

---

### T3.2 — Add agent movement with A* to scene

Connect the A* pathfinder to agent movement in the 3D scene.

**Files:**
- `src/components/agents/NavigationPath.tsx` — optional path visualization
- `src/components/agents/AgentAvatar.tsx` — animate position along path

**Acceptance:**
- Agent moves smoothly along computed A* path when given a target
- Movement is frame-interpolated (not teleport)
- Path recalculates if blocked
- Optional: debug path line visible in dev mode

**Commit**: `feat: add A* navigation with smooth agent movement`

---

### T3.3 — Wire WS proxy for agent state broadcast

Connect the WS proxy to broadcast state changes to browser.

**Files:**
- `src/server/proxy.ts` — add `agent:state_change`, `agent:moved`, `agent:interacted` messages
- Browser-side WS handler

**Acceptance:**
- When agent state changes, WS proxy broadcasts `agent:state_change` to all clients
- When agent moves, `agent:moved` is sent
- When agents interact, `agent:interacted` is sent with `from` and `to`
- Client updates Zustand store on receiving messages

**Commit**: `feat: wire WS proxy for agent state broadcast`

---

### T3.4 — Create PR #3

- `git checkout main && git pull`
- `git checkout -b pr/3-agent-interaction`
- Commit all T3.x changes
- `git push origin pr/3-agent-interaction`
- `gh pr create --title "PR 3: Agent interaction and A* navigation"`
