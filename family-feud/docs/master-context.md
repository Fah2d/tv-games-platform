# TV Games Platform — Master Context File
# Load this into your Claude Project instructions for consistent output across all developers.
# Last updated: May 14, 2026

---

## 1. PROJECT OVERVIEW

This is a Jackbox-style web platform for Arabic TV-show games. A host runs the game on a main screen (laptop/TV), and players join from their phones using a room code. Phones act as controllers.

- **Business model:** Host buys a paid account. Players join for free via room code.
- **Player count:** 2–10 players per room.
- **Language:** All UI is Arabic. All code (variables, functions, comments, commits) is English.
- **Direction:** RTL layout throughout.
- **Current games:** Game 1 is "حروف" (Horouf). Game 2 is TBD. Up to 8 games planned.
- **Team:** 2 developers. Dev 1 owns hub/auth/infra + Game 1. Dev 2 owns Game 2+.

---

## 2. TECH STACK (LOCKED — DO NOT CHANGE OR SUBSTITUTE)

| Layer         | Tool                          | Version/Notes                    |
|---------------|-------------------------------|----------------------------------|
| Framework     | Next.js (App Router)          | Latest stable. Uses `src/` dir.  |
| Language      | TypeScript                    | Strict mode enabled.             |
| Styling       | Tailwind CSS                  | Utility-first. No custom CSS files unless absolutely necessary. |
| Real-time     | Socket.io                     | Custom server.ts at project root runs Next.js + Socket.io together. |
| Auth          | Firebase Auth                 | Email/password only for now.     |
| Database      | MongoDB Atlas                 | Free tier. Mongoose for ODM.     |
| Font          | IBM Plex Sans Arabic          | Loaded via Google Fonts in layout.tsx. |
| Package mgr   | npm                           | Do NOT use yarn, pnpm, or bun.  |

### What you CANNOT do:
- Do NOT add, swap, or suggest alternative frameworks, styling libraries, databases, or auth providers.
- Do NOT install UI component libraries (no shadcn, no MUI, no Chakra, no Ant Design). Build components from scratch with Tailwind.
- Do NOT add any CSS-in-JS library (no styled-components, no emotion).
- Do NOT add any state management library (no Redux, no Zustand, no Jotai). Use React context + useState/useReducer.
- Do NOT use any ORM other than Mongoose.
- Do NOT switch to Pages Router. App Router only.
- Do NOT create API routes for socket logic — socket logic lives in server.ts and shared socket files.

### What you CAN do:
- Install small utility packages (e.g., nanoid for room codes, clsx for class merging).
- Install type packages (@types/*).
- Add animation libraries only if explicitly requested (framer-motion is pre-approved if needed).

---

## 3. PROJECT STRUCTURE (LOCKED — DO NOT REORGANIZE)

```
tv-games-platform/
├── server.ts                      # Custom server: Next.js + Socket.io. DO NOT SPLIT.
├── .env.local                     # Firebase + MongoDB secrets. Never commit.
├── .env.local.example             # Template showing required env vars.
├── docs/
│   ├── claude-rules.md            # Coding conventions (committed to repo)
│   └── master-context.md          # This file (committed to repo)
├── public/                        # Static assets, fonts, images, sounds
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout: RTL, Arabic font, dark theme, AuthProvider
│   │   ├── page.tsx               # Hub page: game selection grid
│   │   ├── auth/
│   │   │   └── page.tsx           # Login / signup page
│   │   ├── lobby/
│   │   │   ├── page.tsx           # Host lobby: room code display, player list, start button
│   │   │   └── join/
│   │   │       └── page.tsx       # Player join: enter room code + name
│   │   └── games/
│   │       ├── game1-horouf/      # DEV 1 ONLY. All Game 1 code lives here.
│   │       │   ├── page.tsx       # Main screen entry point
│   │       │   ├── components/    # Game-specific components
│   │       │   ├── types.ts       # Game-specific types
│   │       │   ├── hooks/         # Game-specific hooks
│   │       │   └── utils/         # Game-specific helpers
│   │       └── game2-tbd/         # DEV 2 ONLY. All Game 2 code lives here.
│   │           ├── page.tsx
│   │           ├── components/
│   │           ├── types.ts
│   │           ├── hooks/
│   │           └── utils/
│   ├── controller/                # Phone controller views
│   │   ├── page.tsx               # Controller router: detects active game, loads correct controller
│   │   ├── game1-horouf/          # DEV 1 ONLY. Phone UI for Game 1.
│   │   └── game2-tbd/             # DEV 2 ONLY. Phone UI for Game 2.
│   └── shared/                    # Shared across all games. Changes here need both devs' awareness.
│       ├── types/                 # Shared TypeScript types (Room, Player, GameState, etc.)
│       ├── utils/                 # Helpers (firebase.ts, room-code generator, etc.)
│       ├── socket/                # Socket event definitions and client/server helpers
│       │   └── events.ts          # Single source of truth for ALL socket event names
│       ├── components/            # Shared UI components (Button, Card, Modal, Input, etc.)
│       └── hooks/                 # Shared hooks (useAuth, useSocket, useRoom, etc.)
```

### Folder Rules — STRICTLY ENFORCED:
- **NEVER create files outside this structure.** No new top-level folders. No reorganizing.
- **NEVER edit another dev's game folder.** Dev 1 touches game1-horouf only. Dev 2 touches game2-tbd only.
- **NEVER move, rename, or delete files in `src/shared/` without explicit instruction.** This is shared territory.
- **NEVER create `src/lib/`, `src/services/`, `src/store/`, `src/config/`, `src/middleware/` or any folder not listed above.**
- Each game is fully self-contained in its folder. No game imports from another game's folder.
- New games follow the exact same structure: `src/app/games/game<N>-<name>/` and `src/controller/game<N>-<name>/`.

---

## 4. DESIGN SYSTEM

### 4.1 Philosophy
- **Minimalist.** Clean, spacious, intentional. Every element earns its place.
- **Dark-first.** Dark backgrounds, light text, subtle accents.
- **Professional.** Must NOT look vibe-coded, AI-generated, or like a hackathon project.
- **Arabic-native.** RTL isn't an afterthought — it's the default. No LTR patterns flipped.
- **TV-readable.** Main screen UI must be legible from 3 meters away. Large text, high contrast, no clutter.
- **Phone-friendly.** Controller UI must work on small screens with big tap targets.

### 4.2 Color Palette (LOCKED — use these exact values)

```css
/* CSS custom properties — defined in globals.css or tailwind config */

/* Backgrounds */
--bg-primary: #0A0A0F;        /* Main background — near black with slight blue */
--bg-secondary: #12121A;      /* Cards, panels, elevated surfaces */
--bg-tertiary: #1A1A25;       /* Hover states, subtle highlights */
--bg-surface: #22222F;        /* Input fields, interactive surfaces */

/* Text */
--text-primary: #F0F0F5;      /* Main text — off-white */
--text-secondary: #9090A0;    /* Subtitles, descriptions, muted text */
--text-muted: #606070;        /* Placeholders, disabled states */

/* Accent — Gold/Amber (used sparingly for CTAs, highlights, active states) */
--accent-primary: #E8A838;    /* Primary accent — warm gold */
--accent-hover: #F0B848;      /* Accent hover state */
--accent-muted: #E8A83820;    /* Accent at 12% opacity for subtle backgrounds */

/* Status */
--success: #34D399;           /* Connected, correct, good state */
--error: #F87171;             /* Error, wrong answer, disconnected */
--warning: #FBBF24;           /* Waiting, caution */

/* Borders */
--border-default: #2A2A38;    /* Default borders */
--border-hover: #3A3A4A;      /* Borders on hover */
--border-accent: #E8A83850;   /* Accent border at 30% opacity */
```

### Tailwind Config Extension
Add these colors to `tailwind.config.ts` under `theme.extend.colors`. Reference them as `bg-primary`, `text-primary`, `border-default`, etc.

### Color Rules:
- **Backgrounds:** Always use `bg-primary` for page, `bg-secondary` for cards, `bg-tertiary` for hover. NEVER use pure black (#000) or pure white (#FFF).
- **Accent gold:** Used ONLY for primary buttons, active states, room codes, and important highlights. Never for large background areas. Sparingly.
- **Text:** `text-primary` for headings and important text. `text-secondary` for descriptions. `text-muted` for placeholders.
- **No gradients** on backgrounds. Flat colors only.
- **No shadows** unless on modals or floating elements. Use border separation instead.
- **No colored backgrounds** on cards. Cards are `bg-secondary` with `border-default` border.

### 4.3 Typography

```
Font family: 'IBM Plex Sans Arabic', sans-serif
```

| Element           | Size (Tailwind)      | Weight        | Color            |
|-------------------|----------------------|---------------|------------------|
| Page title        | text-3xl (or text-4xl on TV) | font-bold (700) | text-primary   |
| Section heading   | text-xl              | font-semibold (600) | text-primary  |
| Card title        | text-lg              | font-semibold (600) | text-primary  |
| Body text         | text-base            | font-normal (400)   | text-secondary |
| Small/caption     | text-sm              | font-normal (400)   | text-muted     |
| Room code display | text-6xl (or text-8xl on TV) | font-bold (700) | accent-primary |
| Button text       | text-base            | font-semibold (600) | depends on variant |

### Typography Rules:
- ONE font family only. No mixing fonts. No decorative fonts.
- Arabic text uses the same font — IBM Plex Sans Arabic handles both Arabic and Latin.
- No italic text anywhere. Arabic doesn't use italics.
- Letter spacing: default (tracking-normal). Never adjust.
- Line height: default Tailwind values (leading-normal or leading-relaxed for body).

### 4.4 Spacing & Layout

- Page padding: `px-6 py-8` on desktop, `px-4 py-6` on mobile.
- Card padding: `p-6` on desktop, `p-4` on mobile.
- Gap between cards/grid items: `gap-4` or `gap-6`.
- Section spacing: `space-y-8` between major sections.
- Max content width: `max-w-6xl mx-auto` for hub. `max-w-md mx-auto` for auth/join pages.
- Game grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`.

### 4.5 Component Specs

#### Buttons
```
Primary:   bg-accent-primary text-bg-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors
Secondary: bg-transparent border border-border-default text-text-primary px-6 py-3 rounded-lg hover:border-border-hover hover:bg-bg-tertiary transition-colors
Danger:    bg-error/10 text-error border border-error/20 px-6 py-3 rounded-lg hover:bg-error/20 transition-colors
Disabled:  opacity-50 cursor-not-allowed (add to any variant)
```
- Minimum tap target: 44px height on mobile (controller).
- Full width on mobile controller: `w-full`.
- No icon-only buttons without a label. Accessibility matters.

#### Cards (Game Selection)
```
bg-secondary border border-border-default rounded-xl p-6 hover:border-border-hover hover:bg-bg-tertiary transition-all cursor-pointer
```
- Each card shows: game name (Arabic), placeholder image area, player count badge, status (available / coming soon).
- Coming soon cards: reduced opacity (opacity-60), no hover effect, no click action.

#### Input Fields
```
bg-bg-surface border border-border-default rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors w-full text-right
```
- Always `text-right` for Arabic input.
- Labels above inputs, not floating or inside.

#### Room Code Display (Lobby — TV screen)
```
text-8xl font-bold text-accent-primary tracking-widest text-center font-mono
```
- Must be the dominant element on the lobby screen.
- Below it: "اطلب من اللاعبين إدخال هذا الرمز" (Ask players to enter this code).

#### Player List (Lobby)
- Simple vertical list with player avatar placeholder (circle with initial), name, and connected status dot (green = connected, red = disconnected).
- Animate new players joining with a subtle fade-in.

### 4.6 Animation Rules
- Transitions: ONLY `transition-colors` and `transition-all` with default Tailwind duration (150ms).
- Page transitions: none. Instant navigation.
- Allowed animations: fade-in for new elements (players joining), subtle scale on button press.
- NO parallax, no scroll animations, no particle effects, no loading spinners with complex animations.
- Loading states: simple pulsing dot or text "جاري التحميل..." (Loading...).

### 4.7 Icons
- Use simple inline SVGs or Lucide React icons ONLY.
- Size: 20px (w-5 h-5) for inline, 24px (w-6 h-6) for standalone.
- Color: `currentColor` always — inherits from text color.
- No emoji as icons. No Font Awesome. No icon images.

---

## 5. SOCKET.IO CONVENTIONS

### Event Naming
All events are defined in ONE file: `src/shared/socket/events.ts`. No string literals anywhere else.

```typescript
// Pattern: CATEGORY_ACTION
// Shared events (no prefix):
export const ROOM_CREATE = 'ROOM_CREATE'
export const ROOM_JOIN = 'ROOM_JOIN'
export const ROOM_LEAVE = 'ROOM_LEAVE'
export const ROOM_STATE = 'ROOM_STATE'
export const PLAYER_JOINED = 'PLAYER_JOINED'
export const PLAYER_LEFT = 'PLAYER_LEFT'
export const GAME_START = 'GAME_START'
export const GAME_END = 'GAME_END'
export const ROOM_ERROR = 'ROOM_ERROR'

// Game-specific events (prefixed with game name):
export const HOROUF_ROUND_START = 'HOROUF_ROUND_START'
export const HOROUF_LETTER_SELECTED = 'HOROUF_LETTER_SELECTED'
// ... etc
```

### Event Payload Typing
Every event has a typed payload defined in `src/shared/types/`:

```typescript
// Example
interface RoomCreatePayload {
  hostId: string
  gameId: string
}

interface RoomJoinPayload {
  roomCode: string
  playerName: string
}
```

### Room Code Format
- 4 uppercase English characters (A-Z). No numbers. No ambiguous chars (O, I, L removed).
- Generated server-side only.
- Displayed in monospace font on main screen.

---

## 6. CODING CONVENTIONS

### File Naming
- All files: `kebab-case.ts` or `kebab-case.tsx`
- Components: file is `game-board.tsx`, export is `export default function GameBoard()`
- Types: file is `room-types.ts`, types are `PascalCase` (e.g., `RoomState`, `PlayerInfo`)
- Hooks: file is `use-room.ts`, export is `export function useRoom()`

### Code Style
- Functional components only. No class components.
- Named exports for utilities and hooks. Default exports for page components.
- `const` over `let`. Never `var`.
- Arrow functions for callbacks. Named functions for components.
- Explicit return types on all exported functions.
- No `any` type. Use `unknown` if truly unknown, then narrow.
- Destructure props in function signature: `function GameCard({ title, status }: GameCardProps)`
- No barrel exports (no `index.ts` files that re-export everything).

### Import Order
```typescript
// 1. React/Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party
import { io } from 'socket.io-client'

// 3. Shared (absolute imports from @/shared/...)
import { useAuth } from '@/shared/hooks/use-auth'
import { ROOM_CREATE } from '@/shared/socket/events'

// 4. Local (relative imports)
import { GameBoard } from './components/game-board'
import type { GameState } from './types'
```

### Comments
- English only. No Arabic in code comments.
- No obvious comments: `// increment counter` above `counter++` is useless.
- Comment WHY, not WHAT.
- TODO format: `// TODO(dev-name): description`

---

## 7. GIT WORKFLOW

### Branches
- `main` — production-ready code. Never push directly.
- `game1-horouf` — Dev 1's working branch.
- `game2-tbd` — Dev 2's working branch.
- Feature branches off your game branch if needed: `game1-horouf/add-scoring`

### Commits
- English, present tense, short: "add lobby player list", "fix room code display", "set up firebase auth"
- No prefixes (no "feat:", "fix:", "chore:"). Keep it simple.
- Commit often. Small commits. One logical change per commit.

### Merging
- When your feature is done: push your branch, open a Pull Request to `main`.
- The other dev reviews (or at minimum, you self-review the diff).
- Squash merge into main.

### What to NEVER commit
- `.env.local` (contains secrets)
- `node_modules/`
- `.next/`
- Any API keys, tokens, or passwords in any file

---

## 8. DEPLOYMENT RULES (FOR LATER)

- Deployment target: TBD (likely Vercel or a VPS).
- Do NOT add deployment configs, Docker files, CI/CD pipelines, or GitHub Actions until explicitly asked.
- Do NOT add environment-specific code (no `if (process.env.NODE_ENV === 'production')` branching unless required for a specific bug).
- The custom server.ts means standard Vercel deployment won't work — we'll handle this later.

---

## 9. WHAT CLAUDE MUST NEVER DO

Read this section carefully. These are hard constraints.

1. **Never reorganize the folder structure.** Files go where the structure says. Period.
2. **Never add new dependencies without being asked.** If a task seems to need a new package, ASK first. Don't install it.
3. **Never create new top-level folders** (no `src/lib/`, `src/services/`, `src/middleware/`, `src/config/`, etc.).
4. **Never swap the tech stack.** No suggesting "you could use Prisma instead of Mongoose" or "consider using Zustand."
5. **Never write CSS files.** Tailwind utilities only. The only CSS file is `globals.css` for CSS variables and base resets.
6. **Never use inline styles** (`style={{}}`) in React components.
7. **Never add authentication providers** beyond email/password unless asked.
8. **Never create mock data files or seed scripts** unless asked.
9. **Never add analytics, logging services, error tracking, or monitoring** unless asked.
10. **Never add internationalization (i18n) libraries.** The app is Arabic-only. Strings are hardcoded in Arabic in the components.
11. **Never use `"use client"` on every file.** Only add it when the component actually needs client-side features (hooks, event handlers, browser APIs). Server components by default.
12. **Never create utility functions that already exist** in the shared folder. Check first.
13. **Never put game-specific code in shared/.** If it's only used by one game, it stays in that game's folder.
14. **Never use English text in the UI.** All user-facing text is Arabic. Code and comments remain English.

---

## 10. WHAT CLAUDE MUST ALWAYS DO

1. **Follow the color palette exactly.** Use the CSS variables / Tailwind classes defined above. No ad-hoc colors.
2. **Keep components small.** If a component exceeds 150 lines, split it.
3. **Type everything.** No implicit any. No untyped props. No untyped event payloads.
4. **Test that code compiles** before presenting it — no syntax errors, no missing imports.
5. **Match the existing code style.** Before writing new code, look at what's already there and match it.
6. **Ask before touching shared/ files.** If a task requires modifying shared code, confirm first.
7. **Keep the hub page updated.** When a new game is added, its card must appear on the hub.
8. **Use semantic HTML.** `<button>` for actions, `<a>` for navigation, `<input>` for inputs. No div-buttons.
9. **Ensure all interactive elements are keyboard accessible.**
10. **Keep the main screen and controller screen as separate concerns.** The main screen (page.tsx in the game folder) shows the game on TV. The controller (in controller/ folder) shows on the phone. They communicate ONLY through Socket.io.

---

## 11. PLAYER FLOW (REFERENCE)

This is how the app works end-to-end. All code must support this flow.

```
HOST FLOW:
1. Opens site → redirected to /auth (login page)
2. Logs in with email/password → redirected to / (hub page)
3. Sees game grid → clicks on a game card
4. Redirected to /lobby → room is created, 4-char room code displayed on screen
5. Waits for players to join (sees player list update in real-time)
6. Clicks "ابدأ اللعبة" (Start Game) → game begins
7. Main screen shows the game UI (TV view)

PLAYER FLOW:
1. Opens site on phone → goes to /lobby/join
2. Enters room code + their display name
3. Joins the room → sees "في انتظار بدء اللعبة" (Waiting for game to start)
4. Host starts game → phone automatically switches to controller view
5. Phone shows game-specific controls (buttons, inputs, buzzers, etc.)
```

---

## 12. ARABIC UI TEXT REFERENCE

Use these exact strings. Do not rephrase or use different Arabic wording.

| Context              | Arabic Text                          |
|----------------------|--------------------------------------|
| Login page title     | تسجيل الدخول                         |
| Sign up              | إنشاء حساب                           |
| Email label          | البريد الإلكتروني                     |
| Password label       | كلمة المرور                           |
| Login button         | دخول                                 |
| Sign up button       | تسجيل                                |
| Logout button        | خروج                                 |
| Hub page title       | اختر لعبة                            |
| Players count        | ٢-١٠ لاعبين                          |
| Coming soon          | قريباً                               |
| Room code label      | رمز الغرفة                           |
| Enter room code      | أدخل رمز الغرفة                      |
| Player name label    | اسم اللاعب                           |
| Join button          | انضمام                               |
| Start game button    | ابدأ اللعبة                          |
| Waiting for start    | في انتظار بدء اللعبة                  |
| Waiting for players  | في انتظار انضمام اللاعبين             |
| Players in room      | اللاعبون في الغرفة                   |
| Loading              | جاري التحميل...                      |
| Error occurred       | حدث خطأ                              |
| Try again            | حاول مرة أخرى                        |
| Go back              | رجوع                                 |
| No account           | ليس لديك حساب؟                       |
| Have account         | لديك حساب بالفعل؟                    |
| Player joined        | انضم لاعب جديد                       |
| Player left          | غادر لاعب                            |
| Room full            | الغرفة ممتلئة                        |
| Invalid room code    | رمز الغرفة غير صحيح                  |
| Connection lost      | انقطع الاتصال                        |
| Reconnecting         | جاري إعادة الاتصال...                |
