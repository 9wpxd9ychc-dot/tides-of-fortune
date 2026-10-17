# Roadmap

## Project
Tides of Fortune

## Vision
A 2D pirate sandbox action-adventure with procedural islands, underwater exploration, crafting, ship progression, NPCs, quests, and multiple story endings.

## Core pillars
1. Exploration and survival
2. Crafting and progression
3. Pirate narrative and reputation
4. Procedural world generation
5. Multiplayer-free but story-rich single-player loop

## Iteration plan

### Iteration 0 — repository and foundation
- initialize repo and documentation
- set up TypeScript + Vite + Phaser 3
- create base project structure
- add rules for CI and testing
- define roadmap and design notes

### Iteration 1 — minimal playable prototype
- procedural island generation
- tilemap and collisions
- camera follow
- player movement and jumping
- simple swimming / oxygen stub
- inventory and item pickup
- basic HUD
- smoke tests for generation and inventory

### Iteration 2 — world expansion and save systems
- archipelago generation
- cave generation and underwater exploration zones
- world save/load system
- ECS-lite entity separation
- resource nodes and enemy placeholders
- deterministic generator tests

### Iteration 3 — crafting, NPCs, and dialogue
- item recipes and crafting UI
- merchant and tavern NPCs
- JSON dialogue system
- quest stubs and progression hooks
- inventory and recipe tests

### Iteration 4 — combat and enemies
- melee, ranged, and projectile systems
- enemy AI and damage logic
- loot drops and enemy health system
- battle encounter tuning

### Iteration 5 — ships and sea travel
- ship construction and upgrade chain
- docks and shipyards
- ocean travel and new biome transitions
- sailing mechanics and stamina/rum use

### Iteration 6 — narrative chapters and endings
- story quests and chapter progression
- pirate / trader / admiral reputation routes
- final quest and ending choices

### Iteration 7 — polish and release candidate
- sound, animations, UI polish
- tuning, bug fixes, optimization
- final QA pass and release documentation

## Deliverables by iteration
- a working branch per iteration
- a PR with description and run instructions
- tests for critical systems
- CHANGELOG update at the end of each iteration

## Notes
The prototype intentionally starts small and expands iteratively. The first milestone is a playable island traversal loop with inventory and generated terrain.
