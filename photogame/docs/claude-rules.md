# Claude Rules — TV Games Platform

## Language & Direction
- All UI text is Arabic
- All code (variables, functions, comments) is in English
- Layout is RTL-first (use `dir="rtl"` and Tailwind RTL utilities)

## Tech Stack (Do Not Change)
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Socket.io for real-time
- Firebase Auth
- MongoDB Atlas

## Folder Rules
- Game 1 code goes ONLY in `src/app/games/game1-horouf/`
- Game 2 code goes ONLY in `src/app/games/game2-tbd/`
- Phone controller views go in `src/controller/<game-name>/`
- Shared code (types, utils, hooks, components) goes in `src/shared/`
- NEVER edit another dev's game folder

## Naming Conventions
- Files: `kebab-case.ts` / `kebab-case.tsx`
- Components: `PascalCase` (e.g., `GameBoard.tsx` → `export default function GameBoard()`)
- Types/Interfaces: `PascalCase` with prefix (e.g., `GameState`, `PlayerAction`)
- Socket events: `SCREAMING_SNAKE_CASE` (e.g., `PLAYER_JOINED`, `ROUND_START`)
- CSS classes: Tailwind utilities only, no custom CSS files unless necessary

## Component Rules
- Use functional components + hooks only
- Each game exports a `MainScreen` component (for TV/laptop) and a `Controller` component (for phone)
- Shared components go in `src/shared/components/`
- Game-specific components stay inside the game folder

## Socket.io Rules
- All socket event names are defined in `src/shared/socket/events.ts`
- Each game registers its own events prefixed with game name: `HOROUF_LETTER_SELECTED`, `GAME2_ANSWER_SUBMITTED`
- Room management events are shared: `ROOM_CREATE`, `ROOM_JOIN`, `ROOM_LEAVE`

## Type Rules
- Shared types in `src/shared/types/`
- Game-specific types in `src/app/games/<game>/types.ts`
- Always type socket event payloads

## Git Rules
- Branch per dev: `game1-horouf`, `game2-tbd`
- Commit messages in English, short and clear
- Never push directly to `main` — always PR

## Game Structure Template
Each game folder should contain:
```
game<N>-<name>/
├── page.tsx          # Main screen entry
├── components/       # Game-specific components
├── types.ts          # Game-specific types
├── hooks/            # Game-specific hooks
└── utils/            # Game-specific helpers
```

## Player Limits
- Min 2, max 10 players per room
- Host counts as a player if the game requires it
