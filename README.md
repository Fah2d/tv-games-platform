[README (1).md](https://github.com/user-attachments/files/27806022/README.1.md)

![Horouf Gameplay](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExejV3M3Q2YjdlbHBianNtY3NqZTBuNDBnZ3Ryc2tkdTE5dmJxZ2t4YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0fz5uNPHnoVHLEhAW2/giphy.gif)
# 🎮 TV Games Platform

A Jackbox-style web platform where a host runs TV-show games on a main screen and players join from their phones as controllers.

## Concept

- **Host** creates a room from their paid account
- **Players** join via room code on their phones
- **Main screen** (laptop/TV) displays the game
- **Phones** act as controllers (buttons, inputs, buzzer, etc.)

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS (RTL-first, Arabic UI) |
| Real-time | Socket.io |
| Auth | Firebase Auth |
| Database | MongoDB Atlas |
| Language | TypeScript |

## Project Structure

```
src/
├── app/
│   ├── auth/              # Login, signup, account management
│   ├── lobby/             # Room creation, room code, waiting room
│   └── games/
│       ├── game1-horouf/  # حروف مع عزيز (Dev 1)
│       └── game2-tbd/     # TBD (Dev 2)
├── controller/            # Phone controller views per game
├── shared/
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Helper functions
│   ├── socket/            # Socket.io events & logic
│   ├── components/        # Shared UI components
│   └── hooks/             # Shared React hooks
public/                    # Static assets, fonts, images
docs/                      # Rules file, design docs
```

## Games

| # | Game | Status |
|---|------|--------|
| 1 | حروف (Horouf) | 🔧 In Development |
| 2 | TBD | ⏳ Not Started |
| 3-8 | Future games | 📋 Planned |

## How It Works

1. Host logs in → creates a game room
2. Room code appears on the main screen
3. Players open the link on their phones → enter room code
4. Phones become controllers, main screen shows the game
5. Game runs in real-time via Socket.io

## Dev Workflow

1. Clone the repo
2. Create your branch: `git checkout -b game1-horouf` or `git checkout -b game2-tbd`
3. Work ONLY inside your assigned folder
4. Load `docs/claude-rules.md` into your Claude project
5. Push your branch, open a PR to merge into `main`

## Getting Started

```bash
# Clone
git clone <repo-url>
cd tv-games-platform

# Install
npm install

# Run dev server
npm run dev
```

## Rules

See `docs/claude-rules.md` for coding conventions, naming rules, and folder boundaries.

## Team

- **Dev 1** — Hub, Auth, Socket infra, Game 1 (حروف)
- **Dev 2** — Game 2 (TBD)
