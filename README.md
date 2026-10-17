# Tides of Fortune

Tides of Fortune is a 2D pirate-themed sandbox action-adventure prototype inspired by classic side-scrolling exploration games and ocean survival titles.

## Overview

The project aims to deliver a playable island survival and exploration experience with:
- procedural islands and archipelagos
- underwater exploration with oxygen and pressure systems
- crafting, gathering, and shipbuilding progression
- NPC dialogue and quests
- pirate reputation progression and story chapters
- a modular engine designed for iterative development

## Tech stack

This project uses TypeScript + Phaser 3 because it provides a fast and highly suitable workflow for 2D action-platformer prototyping:
- excellent 2D rendering and tilemap support
- strong community and tooling
- fast iteration with Vite
- simple browser-based deployment and rapid playable builds
- TypeScript improves maintainability and long-term scaling for game systems

## Goals of the prototype

This repository begins with a minimal playable prototype focused on:
- generated island terrain
- player movement and jumping
- swimming / oxygen stub
- inventory and pickup flow
- simple HUD and UI shell
- deterministic generator tests

## Project roadmap

See docs/ROADMAP.md for the full phased development plan.

## Quick start

```bash
npm install
npm run dev
```

Then open the local Vite URL printed in the terminal.

## Scripts

```bash
npm run dev
npm run build
npm run test
```

## Project structure

```text
src/
  engine/
  world/
  entities/
  quests/
  ui/
  save/
  data/
  tests/
```

## License

MIT
