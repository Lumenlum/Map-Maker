# Map Maker

Map Maker is a browser-based workspace for creating custom interactive game maps. The long-term product will let users upload a map, add categorized markers with notes and images, manage overlays and layers, save maps, and share live view-only links.

## Current status

The project is at `v0.2.0 — Map creation and viewer`. The app now provides a usable map workspace with image upload and drag-and-drop, map title/game metadata, zoom controls, and the fixed rainbow accent themes with light and dark modes.

## Planned features

- Map creation with optional title, game association, and cover image
- Base-map upload with pan and zoom
- Item boxes, item spawns, boss spawns, locked doors, and secret caches
- Marker notes and image attachments
- Transparent region/border overlays
- Independent layers and category filters
- Autosave after five meaningful edits with five recoverable checkpoints
- Undo/Redo and a ten-change history menu
- Account-based saved maps and view-only share links
- Account-required copying into independent snapshots

## Development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run build
npm test
npm run format:check
```

The project deliberately does not commit or push changes automatically. Review local changes before deciding whether to commit or publish them.

## Project roadmap

The versioned implementation plan is maintained in the GitHub [Map Maker Roadmap project](https://github.com/users/Lumenlum/projects/1). The local roadmap will stay aligned with that project as features evolve.
