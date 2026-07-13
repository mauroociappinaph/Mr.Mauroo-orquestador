# TASK-016a: Composition Root — Replacement Map

> Branch: `task/016a-composition-map`
> Source file: `src/features/retro-office/RetroOffice3D.tsx` (7250 lines, 276 KB)
> Goal: Map every inline state/effect/callback to the corresponding module hook/provider

---

## 1. State to Module Mapping

Each inline `useState` in the monolithic `RetroOffice3D.tsx` maps to exactly one module.

### 1.1 Furniture Module (`useFurniture`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `const [furniture, setFurniture]` (2505) | `useFurniture().furniture` | Zustand store with persist |
| `const [editMode, setEditMode]` (2547) | `useFurniture().editMode` / `useEditMode().editMode` | Conflict: furniture owns editMode flag too |
| `const [selectedUid, setSelectedUid]` (2548) | `useEditMode().selectedUid` | Belongs to edit-mode module |
| `const [hoverUid, setHoverUid]` (2549) | `useEditMode().hoverUid` | |
| `const [drag, setDrag]` (2550) | `useEditMode().drag` | |
| `const [ghostPos, setGhostPos]` (2552) | `useEditMode().ghostPos` | |
| `const [wallDrawStart, setWallDrawStart]` (2555) | `useEditMode().wallDrawStart` | |
| `const [deskActionUid, setDeskActionUid]` (2576) | `useEditMode().deskActionUid` | |
| `const [deskAssignPickerOpen, setDeskAssignPickerOpen]` (2577) | `useEditMode().deskAssignPickerOpen` | |
| `const [drawerOpen, setDrawerOpen]` (2551) | `useEditMode().drawerOpen` | Not in original design; add to useEditMode |
| `buildInitialFurnitureLayout(...)` (2505) | `useFurniture().addFurniture` / provider init | |
| `defaultRemoteLayoutFurniture` useMemo (2510) | `useRemoteOffice().defaultRemoteLayoutFurniture` | |
| `remoteLayoutFurniture` useMemo (2521) | `useRemoteOffice().remoteLayoutFurniture` | |
| `useEffect` layout change reset (2534) | `useFurniture()` handles storage namespace changes | |
| `useEffect` saveFurniture 300ms debounce (3126) | `useFurniture()` internal debounced persist | |
| `useEffect` /api/office/layout sync (3134) | `useFurniture()` internal API sync | |
| `useEffect` migration markers (2750+) | `useFurniture()` handles migration effects | |
| `handleFurniturePointerDown` (4393) | `useEditMode().onItemClick` / `useEditMode().onItemDragStart` | |
| `handleFloorMove` (around 4700) | `useEditMode().onFloorMove` | |
| `handleFloorClick` (around 4720) | `useEditMode().onFloorClick` | |
| `startPlacing` | `useEditMode().onPlaceItem` | |
| `closeSelectedEditor` | `useEditMode().setSelectedUid(null)` | |
| `updateSelectedItem` | `useEditMode().onUpdateItem` (new callback) | |
| `moveSelectedItem` | `useEditMode().onMoveItem` (new callback) | |
| `rotateSelectedItem` | `useEditMode().onRotateItem` (new callback) | |
| `handleDelete` | `useEditMode().onDeleteItem` / `useFurniture().deleteFurniture` | |
| `handleReset` | `useFurniture().resetLayout` | |
| `toggleEdit` | `useEditMode().setEditMode` | |
| `kanbanDeskTaskCount` (2475) | Passthrough prop => overlays module | |

### 1.2 Agent Navigation Module (`useAgentNavigation`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| All agent tick logic (~849-2194) | `useAgentNavigation().tick`, `planPath`, refs | The biggest extraction |
| `renderAgentsRef` | `useAgentNavigation().renderAgentsRef` | |
| `renderAgentLookupRef` | `useAgentNavigation().renderAgentLookupRef` | |
| `deskByAgentRef` | `useAgentNavigation().deskByAgentRef` | |
| `planPath` | `useAgentNavigation().planPath` | |
| `sceneAgents` (2754+) | `useAgentNavigation()` internal | |
| `agentColorMap` (2755) | `useVisualEffects()` or nav module | |
| `getNavGrid` (888) | `NavGrid` class in navigation module | |
| `pickRoamPoint` (902) | `useAgentNavigation()` internal | |
| `pickSpawnPoint` (910) | `useAgentNavigation()` internal | |
| `resolveMeetingTarget` (930) | `useAgentNavigation()` internal | |
| `resolveDeskIndexForItem` | `useAgentNavigation()` internal | |
| `sendAssignedAgentToDesk` | `useAgentNavigation()` internal | |
| `handleGoToDesk` | `useAgentNavigation()` internal | |
| `resolveAgentIdForDeskItem` | `useAgentNavigation()` internal | |
| `worldToCanvas` | Keep in scene-runtime or edit-mode | |

### 1.3 Camera Module (`useCamera`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `cameraPresetRef` (around 2630) | `useCamera().cameraPresetRef` | |
| `orbitRef` (around 2660) | `useCamera().orbitRef` | |
| `followAgentId, setFollowAgentId` (2664) | `useCamera().followAgentId` | |
| `followAgentIdRef` (2666) | `useCamera().followAgentIdRef` | |
| `CAM_POS` useMemo (2619) | `useCamera().CAM_POS` (or camera preset) | |
| `cameraTarget` | `useCamera().cameraTarget` | |
| `cameraZoom` | `useCamera().cameraZoom` | |
| `overviewPreset` (2634) | `useCamera().overviewPreset` | |
| `canvasResetKey` (2638) | `useCamera().canvasResetKey` | |
| `LOCAL_CAMERA_TARGET` (2614) | `useCamera().LOCAL_CAMERA_TARGET` | |
| Camera preset buttons | `useCamera().CAMERA_PRESET_MAP` | |
| `CameraPresetAnimator` | `useCamera().CameraAnimator` | |
| `FollowCamSystem` | `useCamera().FollowCamController` | |
| `CameraRig` | `useCamera().CameraRig` | |
| `OrbitControls` | `useCamera()` configures via ref | |

### 1.4 Overlays Module (`useOverlays`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `standupBoardOpen, setStandupBoardOpen` (2561) | `useOverlays().openStandup / closeStandup` | |
| `activeKanbanUid, setActiveKanbanUid` (2562) | `useOverlays().openKanban / closeKanban` | |
| `monitorImmersiveReady` (2673) | `useOverlays()` internal | |
| `activeAtmUid` (2674) | `useOverlays().openAtm / closeAtm` | |
| `atmImmersiveReady` (2675) | `useOverlays()` internal | |
| `phoneBoothCommandArrived` (2676) | `useOverlays()` internal | |
| `phoneBoothImmersiveReady` (2678) | `useOverlays()` internal | |
| `phoneBoothDoorOpen` (2680) | `useOverlays()` internal | |
| `phoneCallStep` (2681) | `useOverlays()` internal | |
| `dialedDigits` (2682) | `useOverlays()` internal | |
| `smsBoothCommandArrived` (2683) | `useOverlays()` internal | |
| `smsBoothImmersiveReady` (2684) | `useOverlays()` internal | |
| `smsBoothDoorOpen` (2685) | `useOverlays()` internal | |
| `textMessageStep` (2686) | `useOverlays()` internal | |
| `typedMessageText` (2688) | `useOverlays()` internal | |
| `activeTextKey` (2689) | `useOverlays()` internal | |
| `textContacts` (2690) | `useOverlays()` internal | |
| `activeTextContactIndex` (2691) | `useOverlays()` internal | |
| `manualPhoneBoothOpen` (2694) | `useOverlays()` internal | |
| `manualSmsBoothOpen` (2697) | `useOverlays()` internal | |
| `activeGithubTerminalUid` (2717) | `useOverlays().openGithubTerminal / closeGithubTerminal` | |
| `activeQaTerminalUid` (2720) | `useOverlays().openQaTerminal / closeQaTerminal` | |
| `githubImmersiveReady` (2723) | `useOverlays()` internal | |
| `qaImmersiveReady` (2724) | `useOverlays()` internal | |
| All overlay pre/post refs (prevMonitorAgentIdRef etc.) | `useOverlays()` internal | |
| All overlay ready-flags (900ms delay) | `useOverlays()` internal effects | |
| All overlay mutual exclusion effects (30+ effects) | `useOverlays()` enforces mutual exclusion | |
| All overlay camera preset effects | `useOverlays().getOverlayCameraPreset()` | |
| `closeManualPhoneBoothView` | `useOverlays().closePhoneBooth` | |
| `closeManualSmsBoothView` | `useOverlays().closeSmsBooth` | |
| `closeStandupBoard` | `useOverlays().closeStandup` | |
| `openKanbanBoard` | `useOverlays().openKanban` | |
| SMS booth flow effect (typing animation) | `useOverlays()` internal | |
| Phone booth flow effect (dialing animation) | `useOverlays()` internal | |

### 1.5 Agent Roster Module (`useAgentRoster`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `agentRosterOpen` (2563) | `useAgentRoster().agentRosterOpen` | |
| `hoveredAgentId` (2566) | `useAgentRoster().hoveredAgentId` | |
| `renderAgentUiById` (2567) | `useAgentRoster()` internal | Synced from renderAgentLookupRef |
| `contextMenu` (2571) | `useInput().contextMenu` | Shared with input module |
| `moodByAgentId` (2653) | `useVisualEffects()` or keep separate | |
| `spotlightAgentId` (2659) | `useVisualEffects().spotlightAgentId` | |

### 1.6 Speech Module (`useSpeech`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `speechAgentIds` (2579) | `useSpeech().speechAgentIds` | |
| `statusFeedEvents` (2580) | `useSpeech().statusFeedEvents` | |
| `speechTextByAgentId` (2584) | `useSpeech().speechTextByAgentId` | |
| `speechImageUrlByAgentId` (2584) | `useSpeech().speechImageUrlByAgentId` | |
| `standupSpeechTextByAgentId` (2596) | `useSpeech().standupSpeechTextByAgentId` | |
| `suppressSceneSpeechBubbles` (around 2610) | `useSpeech().suppressSceneSpeechBubbles` | |

### 1.7 Audio Module (`useAudio`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `boothAudioCtxRef` | `useAudio().getBoothAudioContext` | |
| `getBoothAudioContext` | `useAudio().getBoothAudioContext` | |
| `playPhoneKeyTone` | `useAudio().playPhoneKeyTone` | |
| `playTextKeyTone` | `useAudio().playTextKeyTone` | |
| `playPhoneRingTone` | `useAudio().playPhoneRingTone` | |
| `playBoothVoice` | `useAudio().playBoothVoice` | |

### 1.8 Visual Effects Module (`useVisualEffects`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `heatmapMode` (2649) | `useVisualEffects().heatmapMode` | |
| `trailMode` (2650) | `useVisualEffects().trailMode` | |
| `heatGridRef` (2651) | `useVisualEffects()` internal | |
| `spotlightAgentId` (2659) | `useVisualEffects().spotlightAgentId` | |
| `agentColorMap` (2755) | `useVisualEffects()` internal | |
| `SceneSpotlightEffect` | `useVisualEffects().SpotlightEffect` | |
| `AgentHeatmapSystem` | `useVisualEffects().HeatmapSystem` | |
| `AgentTrailSystem` | `useVisualEffects().TrailSystem` | |

### 1.9 Janitor Module (`useJanitor`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `janitorActors` (2656) | `useJanitor().janitorActors` | |
| `seenCleaningCueIdsRef` (2657) | `useJanitor()` internal | |

### 1.10 Scene Runtime Module (`useSceneRuntime`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `AdaptiveDprController` | `useSceneRuntime().AdaptiveDprController` | |
| `SceneGameLoop` (calls `tick()`) | `useSceneRuntime().GameLoop` | |
| `ScenePingPongBall` | `useSceneRuntime().PingPongBall` | |
| `SceneFloorRaycaster` | `useSceneRuntime().FloorRaycaster` | |

### 1.11 Input Module (`useInput`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `spaceDown` (2559) | `useInput().spaceDown` | |
| `spaceDragging` (2560) | `useInput().spaceDragging` | |
| `contextMenu` (2571) | `useInput().contextMenu` | |
| Keyboard event handler (Escape, Delete, arrows) | `useInput().handleKeyDown` | |
| Space key handlers | `useInput().handleKeyDown / handleKeyUp` | |
| Context menu handler | `useInput().handleContextMenu` | |
| Cursor style effect (furniture hover) | `useInput()` internal | |

### 1.12 Config Module (`useConfig`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `settingsModalOpen` (2660) | `useConfig().settingsModalOpen` | |
| All passthrough config values | `useConfig()` | |
| `SettingsPanel` render | Driven by `useConfig()` | |

### 1.13 Remote Office Module (`useRemoteOffice`)

| Inline State (lines) | Replaced by | Notes |
|---|---|---|
| `defaultRemoteLayoutFurniture` (2510) | `useRemoteOffice().defaultRemoteLayoutFurniture` | |
| `remoteLayoutFurniture` (2521) | `useRemoteOffice().remoteLayoutFurniture` | |
| `ReadOnlyFurnitureClone` | `useRemoteOffice()` | |

---

## 2. Props to Module Mapping

All 90+ props flow like this:

| Prop Group | Routes to | Notes |
|---|---|---|
| `agents, readOnly, storageNamespace, layoutPreset` | ConfigProvider -> all modules | Shared context |
| `deskAssignment*, animationState*` | AgentNavigationProvider | |
| `cleaningCues` | JanitorProvider | |
| `deskHoldByAgentId, gymHoldByAgentId, ...` | AgentNavigationProvider | |
| `phoneBoothAgentId, smsBoothAgentId, ...` | OverlayProvider | |
| `monitorAgentId, monitorByAgentId` | OverlayProvider | |
| `standupMeeting, standupAutoOpenBoard` | OverlayProvider + SpeechProvider | |
| `feedEvents` | SpeechProvider | |
| `officeTitle, remoteOffice*, voiceReplies*` | ConfigProvider | |
| `gateway*, selectedAdapterType, activeAdapterType` | ConfigProvider | |
| `onOfficeTitleChange, on*` callbacks | ConfigProvider | |
| `onMonitorSelect, onAgentChatSelect` | OverlayProvider + InputProvider | |
| `onDeskAssignmentChange, ...` | AgentNavigationProvider | |
| `onPhoneCallComplete, onPhoneCallSpeak` | AudioProvider + OverlayProvider | |
| `onTextMessageComplete` | OverlayProvider | |
| `onGithubReviewDismiss, onQaLabDismiss` | OverlayProvider | |
| `taskBoard*` props | Rendered inside KanbanImmersive | |
| `atmAnalytics` | Rendered inside AtmImmersive | |

---

## 3. Canvas Content → RetroOfficeCanvas.tsx

Everything inside the `<Canvas>` tag (lines ~5200-5800) moves to `RetroOfficeCanvas.tsx`:

| Canvas Content | Became | Notes |
|---|---|---|
| `<Canvas>` with camera/orthographic props | `<RetroOfficeCanvas>` | Consumer of all hooks |
| `<CameraRig>` | `<CameraAnimator>` from useCamera | |
| `<AdaptiveDprController>` | `useSceneRuntime().AdaptiveDprController` | |
| `<OrbitControls>` | Controlled by useCamera | |
| `<SceneGameLoop tick={tick}>` | `useSceneRuntime().GameLoop` | |
| `<CameraPresetAnimator>` | `useCamera().CameraAnimator` | |
| `<FollowCamSystem>` | `useCamera().FollowCamController` | |
| `<SceneSpotlightEffect>` | `useVisualEffects().SpotlightEffect` | |
| Lights (ambient, directional) | Static in RetroOfficeCanvas | |
| `<SceneFloorAndWalls>` | Scene utility (unchanged) | |
| `<SceneWallPictures>` | Scene utility (unchanged) | |
| `<Environment>` | Scene utility (unchanged) | |
| All furniture models (~20 types) | Kept in RetroOfficeCanvas, reads from useFurniture | |
| `<ReadOnlyFurnitureClone>` | From useRemoteOffice | |
| Agent objects (sceneAgents.map) | Reads from useAgentNavigation refs | |
| `<ScenePingPongBall>` | `useSceneRuntime().PingPongBall` | |
| `<AgentTrailSystem>` | `useVisualEffects().TrailSystem` | |
| `<AgentHeatmapSystem>` | `useVisualEffects().HeatmapSystem` | |
| `<FurniturePlacementGhost>` | From useEditMode | |
| `<SceneFloorRaycaster>` | `useSceneRuntime().FloorRaycaster` | |
| `<AgentLayer>` | External component | |

---

## 4. Non-Canvas JSX → Composition Root

Everything outside `<Canvas>` stays in the composition root `RetroOffice3D.tsx`:

| UI Section | Module Source |
|---|---|
| Camera preset buttons (top-left) | useCamera |
| Standup/Kanban quick buttons | useOverlays |
| Office title (top-center) | useConfig |
| Agent roster (top center with expandable panel) | useAgentRoster |
| Agent tooltip (hovered agent) | useAgentRoster |
| Speech bubble image overlay | useSpeech |
| Context menu | useInput |
| Desk actions modal | useEditMode / useAgentRoster |
| Follow cam HUD | useCamera |
| Agent walking status indicators | useOverlays / useAgentNavigation |
| All immersive screens (monitor, standup, kanban, github, qa, sms, phone, atm) | useOverlays |
| Edit mode badge + selected item editor + object drawer | useEditMode |
| Toolbar (top-right) | useConfig / useEditMode |
| Settings modal | useConfig |
| Status bar (bottom-left) | useSpeech / useAgentRoster |

---

## 5. Effects to Module Mapping (~50 effects → 14 modules)

| Effect | Module | Lines in RetroOffice3D.tsx |
|---|---|---|
| Layout reset on storageNamespace change | useFurniture(provider) | 2534 |
| Furniture persist debounce (300ms) | useFurniture | 3126 |
| API layout sync (500ms) | useFurniture | 3134 |
| Follow cam ↔ monitor/overlay mutual exclusion | useOverlays | ~5 effects |
| Manual SMS/Phone booth mutual exclusion | useOverlays | ~2 effects |
| Ref syncing for callbacks | useOverlays / useAudio | 1 effect |
| Arrival sync interval (150ms) | useOverlays | 1 large effect |
| SMS booth ready flag (900ms) | useOverlays | ~2 effects |
| SMS booth typing animation | useOverlays | 1 large effect |
| SMS booth camera preset | useOverlays | 1 effect |
| Phone booth ready flag (900ms) | useOverlays | ~2 effects |
| Phone booth dialing animation | useOverlays | 1 large effect |
| Phone booth camera preset | useOverlays | 1 effect |
| Monitor ready flag (900ms) | useOverlays | 1 effect |
| ATM ready flag (900ms) | useOverlays | 1 effect |
| GitHub ready flag (900ms) | useOverlays | 1 effect |
| QA ready flag (900ms) | useOverlays | 1 effect |
| Standup auto-open | useOverlays | 1 effect |
| Monitor camera preset | useOverlays | 1 effect |
| Overlay stale UID cleanup (5 effects) | useOverlays | 5 effects |
| Overlay camera presets (4 effects) | useOverlays | 4 effects |
| Kanban ref tracking | useOverlays | 1 effect |
| Cursor style on furniture hover | useInput | 1 effect |
| Keyboard handler (Escape, Delete, arrows) | useInput | 1 effect |
| Space key listeners | useInput | 1 effect |
| Context menu dismiss | useInput | 1 effect |
| Desk action dismiss | useInput | 1 effect |
| Speech bubble lifecycle | useSpeech | 1 effect |
| Mood emoji lifecycle | useVisualEffects | 1 effect |
| Spotlight auto-clear (2s) | useVisualEffects | 1 effect |
| Camera reset on overview change | useCamera | 1 effect |
| Camera reset on officeCenterSignal | useCamera | 1 effect |
| Overlay camera preset on overview | useCamera | used in many overlay effects |
| Cleanup auto-pan | useCamera | |
| Janitor prune interval (1s) | useJanitor | 1 effect |
| Migration effects (5 effects: atm, phone, sms, server, gym) | useFurniture | 5 effects |

---

## 6. Things NOT Covered by Existing Modules

These inline elements must remain in the composition root or need new module entries:

1. **Agent roster UI** (JSX for badges, tooltip, expanded panel) — `useAgentRoster` is just a hook, needs actual components
2. **Immersive overlay UI containers** (monitor borders, github frame, QA lab frame) — `useOverlays` controls state; UI containers are in JSX
3. **SettingsPanel render** — uses `useConfig` for state, but the Panel component is external
4. **Desk actions modal** — inline JSX, uses edit-mode state and roster state
5. **Status bar** — bottom-left UI, reads from multiple modules
6. **Toolbar buttons** — top-right, reads from multiple modules
7. **Camera preset buttons** — small UI, uses useCamera presets
8. **Edit mode editor panel** — selected item, placement, delete
9. **Object drawer** (PALETTE list) — furniture type selection UI

These are UI concerns that belong in the composition root's JSX, NOT in module hooks.

---

## 7. Execution Order for TASK-016b → TASK-016e

### 016b: Provider Tree + RetroOfficeCanvas
1. Create provider hierarchy (14 nested providers)
2. Create RetroOfficeCanvas.tsx with Canvas content
3. Import all module hooks via barrel
4. Verify `npm run typecheck + lint` passes

### 016c: Rewrite State
1. Remove all 50+ `useState` declarations
2. Wire: `const furniture = useFurniture()`, `const nav = useAgentNavigation()`, etc.
3. Wire: `const overlays = useOverlays()`, `const camera = useCamera()`, etc.
4. Replace all inline callbacks with module callbacks
5. Delete all ~50 `useEffect` that are now inside modules
6. Verify `npm run typecheck` passes

### 016d: Integration Test
1. `provider-tree.test.tsx` — full tree render + hook accessibility

### 016e: Verify
1. `npm run lint`
2. `npm run typecheck`
3. `npm run test -- --run`
4. Manual smoke test

---

*End of Task-016a Mapping Document*
