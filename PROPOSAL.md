# Proposal: base-oficina-3d

> SDD Proposal — 2026-07-06
> Change: `base-oficina-3d`

## Executive Summary

Create **oficina-3d**, a 3D virtual office where AI agents live as visual avatars with distinct roles, responsibilities, and interactions. Forked from CLAW3D (MIT), stripped of its robotic-gateway layer, and re-purposed as an agent habitat.

## Problem & Opportunity

- **Problem**: AI agents are abstract — you chat with them in a terminal or a chat UI. There's no spatial or visual representation of their presence, roles, or interactions.
- **Opportunity**: A 3D office gives agents a "body" and a "place". You see who's working, who's idle, who's talking to whom. It makes multi-agent systems tangible.
- **Why fork CLAW3D**: It already has a 3D office scene (RetroOffice3D), procedural avatars, grid-based navigation (A*), and a WebSocket proxy layer. We skip the robot-control part and build the agent layer on top.

## Agent Roles (V0)

The office is inhabited by AI agents, not human users. Each agent has:

| Role | Responsibility |
|------|---------------|
| **Architect** | Designs solutions, reviews code, makes architectural decisions |
| **Developer** | Implements features, writes tests, fixes bugs |
| **Reviewer** | Reviews PRs, checks quality, enforces standards |
| **Coordinator** | Delegates tasks, tracks progress, manages workflow |

Agents move around the office based on their current state (working, idle, in conversation), creating a living ecosystem.

## Core Features (V0)

1. **3D Office Scene** — retro 3D office environment (from CLAW3D's RetroOffice3D)
2. **Agent Avatars** — procedural avatars for each agent, positioned in the space
3. **Basic Navigation** — agents move around the office grid (A* pathfinding)
4. **Agent State Visualization** — visual indicators for working/idle/interacting states
5. **Local Mode** — runs on localhost, no auth, no gateway

## Out of Scope (V0)

- ❌ OpenClaw/Hermes gateway
- ❌ Human user authentication
- ❌ Multi-user / multiplayer
- ❌ VPN / remote access
- ❌ Voice interaction
- ❌ External 3D assets (procedural only)

## Technical Approach

### Fork Strategy

1. Fork CLAW3D v0.1.4 into `/Users/mauroociappina/Desktop/oficina-3d`
2. Remove: Gateway client, WS proxy auth layer, OpenClaw integration
3. Add: Agent role system, state machine per agent, interaction triggers
4. Adapt: Avatar system to represent agent states, navigation to support agent behaviors

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js App Router |
| 3D Rendering | Three.js / React Three Fiber + Drei |
| State | Zustand |
| Real-time | Custom WS proxy (Node.js) — stripped of gateway auth |
| Build | Phaser builder (from CLAW3D) |
| Persistence | Local filesystem (`~/.oficina-3d/`) |

### Architecture (adapted from CLAW3D)

```
Browser (R3F) → Studio API → WS Proxy → Agent Layer (replaces Gateway)
                                           ↕
                                    Agent State Machine
```

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| CLAW3D tightly coupled to gateway | Identify gateway boundary early, extract agent layer as drop-in replacement |
| No test suite in base | Add vitest + testing-library for React components |
| Procedural avatars limited expressiveness | Accept constraint for V0; GLB import is a fast follow |
| Agent interaction logic undefined | Start with simple state broadcasting via WS; iterate |

## Delivery Strategy

- **Chained PRs**: force-chained with feature-branch-chain
- **PR 1**: Fork & strip — remove gateway, clean dependencies, verify it runs
- **PR 2**: Agent system — agent roles, state machine, basic presence in scene
- **PR 3**: Agent interaction — agents communicate, respond to each other's state
- **Review budget**: 400 lines max per PR
