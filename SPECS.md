# Specs: base-oficina-3d

> SDD Specs — 2026-07-06
> Derived from: `sdd/base-oficina-3d/proposal`

## Overview

Fork CLAW3D v0.1.4 and transform it into a 3D virtual office inhabited by AI agents. Each agent has a role, a visual avatar, and a state machine driving its behavior in the 3D space.

---

## Functional Requirements

### FR-01: 3D Office Scene

The application loads a 3D office environment on startup without requiring authentication.

**Acceptance Criteria:**
- AC-01.1: Given the app starts at localhost, When the page loads, Then a 3D office scene is rendered via R3F
- AC-01.2: Given the office scene is loaded, When the user views it, Then it contains at least: floor, walls, desks, and ambient lighting
- AC-01.3: Given the CLAW3D RetroOffice3D scene exists, When forked, Then all gateway-specific elements (auth UI, robot connection panels) are removed
- AC-01.4: Given the scene renders, When the window is resized, Then the viewport adapts proportionally

### FR-02: Agent Avatars

The system spawns procedural avatars representing AI agents in the 3D space. Each avatar corresponds to an agent role.

**Acceptance Criteria:**
- AC-02.1: Given the office is loaded, When the agent registry initializes, Then one procedural avatar per configured agent appears in the scene
- AC-02.2: Given agents are defined, When an agent has role "architect", Then its avatar uses a distinct visual cue (e.g. color/label) different from "developer" or "reviewer"
- AC-02.3: Given no external 3D assets are available, When the avatar is created, Then it is built purely from procedural geometry (no GLB/OBJ imports)
- AC-02.4: Given the app starts, When no agents are configured, Then the office renders empty (no crash)

### FR-03: Grid Navigation (A*)

Agents move autonomously across a grid-based floor using A* pathfinding.

**Acceptance Criteria:**
- AC-03.1: Given an agent is at position A, When it needs to reach position B, Then it computes an A* path and traverses it
- AC-03.2: Given an agent is walking a path, When an obstacle blocks the direct route, Then it finds an alternative path
- AC-03.3: Given the grid has defined walkable tiles, When an agent reaches a non-walkable tile boundary, Then it stops or recalculates

### FR-04: Agent State Visualization

Each agent visually communicates its current state: working, idle, or interacting.

**Acceptance Criteria:**
- AC-04.1: Given an agent is in "working" state, When observed in the scene, Then a visual indicator (e.g. color pulse, icon) shows "working"
- AC-04.2: Given an agent transitions from "working" to "idle", When the state changes, Then the visual indicator updates within 500ms
- AC-04.3: Given an agent is "interacting" with another agent, When both agents are nearby, Then both show the "interacting" indicator

### FR-05: Local Mode (No Auth)

The application runs entirely on localhost with no authentication, no gateway, and no remote connections.

**Acceptance Criteria:**
- AC-05.1: Given the app starts, When loaded, Then no login screen, auth token, or gateway connection is required
- AC-05.2: Given the CLAW3D fork, When building, Then all OpenClaw/gateway dependencies are removed from package.json
- AC-05.3: Given the app runs locally, When the WS proxy starts, Then it binds only to 127.0.0.1 (no external network exposure)

---

## Non-Functional Requirements

### NFR-01: Performance

- **NFR-01.1**: The 3D scene must maintain at least 30 FPS on a mid-range MacBook (M1 or better) with 4 agents visible
- **NFR-01.2**: Initial load time must not exceed 5s on localhost (excluding first compile)
- **NFR-01.3**: Avatar animations must update at consistent tick rate, not frame-bound

### NFR-02: Persistence

- **NFR-02.1**: Agent configurations (roles, names, states) persist to local filesystem at `~/.oficina-3d/`
- **NFR-02.2**: Office layout customizations persist across sessions

### NFR-03: Maintainability

- **NFR-03.1**: Agent role definitions are data-driven (config file), not hardcoded
- **NFR-03.2**: The gateway removal is clean (no dead code, no stubs)

---

## Out of Scope (Reaffirmed)

- Human user login/auth
- Multi-user / multiplayer
- VPN / remote access (deferred)
- Voice or text chat
- External 3D assets or animations
- OpenClaw/Hermes integration
- Real agent LLM integration (agents are simulated in V0)

---

## Dependencies

| Dependency | Required For | Notes |
|-----------|-------------|-------|
| CLAW3D v0.1.4 fork | All FRs | Must be forked first; MIT license |
| Node.js 18+ | Development | Runtime requirement for Next.js |
| npm/yarn/pnpm | Build | Package management |

---

## Traceability Matrix

| FR | ACs | NFRs | Priority |
|----|-----|------|----------|
| FR-01 | AC-01.1–4 | NFR-01.1–2 | P0 |
| FR-02 | AC-02.1–4 | NFR-01.3, NFR-03.1 | P0 |
| FR-03 | AC-03.1–3 | — | P1 |
| FR-04 | AC-04.1–3 | — | P1 |
| FR-05 | AC-05.1–3 | NFR-03.2 | P0 |
