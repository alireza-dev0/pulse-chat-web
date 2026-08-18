# Pulse Chat — Web

Real-time chat frontend for Pulse Chat. Persian (RTL) UI built with Next.js, shadcn/ui, Socket.IO, and cookie-based auth.

**Backend:** [pulse-chat-api](https://github.com/alireza-dev0/pulse-chat-api)

---

## Features

- **Auth** — sign in and sign up (Persian UI)
- **Rooms** — live list, create and delete (delete button for room owners only)
- **Chat** — live messages, history, typing indicators, and online presence
- **Responsive** — desktop: sidebar + chat body; mobile: room list and full-screen chat (Telegram-style)
- **Theme** — light / dark toggle (`d` key when not typing)

---

## Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Framework  | Next.js 16 (App Router)       |
| UI         | shadcn/ui + Tailwind CSS 4    |
| State      | Zustand                       |
| HTTP       | Axios (`/api` + server rewrite) |
| Real-time  | socket.io-client              |
| Forms      | react-hook-form               |
| Toast      | sonner                        |

---

## Prerequisites

- **Node.js** 20+
- **pnpm**
- **Pulse Chat API** running (PostgreSQL + Redis) — see the [API README](https://github.com/alireza-dev0/pulse-chat-api)

---

## Quick Start

```bash
git clone https://github.com/alireza-dev0/pulse-chat-web.git
cd pulse-chat-web
pnpm install
cp .env.example .env.development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Default `.env.development`:

```env
API_URL="http://localhost:7700"
NEXT_PUBLIC_API_URL="http://localhost:7700"
```

---

## Environment Variables

| Variable                | Scope   | Description |
| ----------------------- | ------- | ----------- |
| `API_URL`               | Server  | Backend URL for Next.js rewrite (`/api/*` → backend) |
| `NEXT_PUBLIC_API_URL`   | Browser | **Optional.** Direct Socket.IO connection to the API |

### How requests work

- **REST** — always goes to `/api` on the frontend origin. Next rewrites to `API_URL`. Auth cookies are set on the frontend domain.
- **WebSocket**
  - If `NEXT_PUBLIC_API_URL` is **set** — connects directly to the API (same page hostname + API port). Good for local dev and testing on a phone on the same LAN.
  - If **unset** — uses `path: /api/socket.io` on the frontend origin (recommended for production).

---

## Testing on a phone (same Wi‑Fi)

1. Run the API and Next dev server on your laptop.
2. Set both `API_URL` and `NEXT_PUBLIC_API_URL` in `.env.development`.
3. Add your laptop IP to `allowedDevOrigins` in `next.config.ts` if needed.
4. On your phone, open `http://<laptop-ip>:3000`.

---

## Deployment (e.g. Vercel)

**Frontend**

```env
API_URL=https://your-api.example.com
# Do not set NEXT_PUBLIC_API_URL — socket uses /api/socket.io on the frontend origin
```

**Backend** — see [pulse-chat-api](https://github.com/alireza-dev0/pulse-chat-api) and `api/.env.production.example`:

```env
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
DATABASE_URL=...
REDIS_URL=...
JWT_SECRET=...
```

> WebSocket over Vercel rewrites can be unreliable. If live updates fail, host the frontend on a VPS with nginx (WebSocket proxy) or use a direct socket + CORS setup on the API.

---

## Scripts

| Command          | Description        |
| ---------------- | ------------------ |
| `pnpm dev`       | Development server |
| `pnpm build`     | Production build   |
| `pnpm start`     | Run production build |
| `pnpm lint`      | ESLint             |
| `pnpm typecheck` | TypeScript check   |
| `pnpm format`    | Prettier           |

---

## Project Structure

```text
app/
  (auth)/           # Sign in / sign up
  (app)/            # Main app shell
    _components/    # Room list, create room dialog
    _hooks/         # Session, rooms, socket sync
    room/[id]/      # Chat page + use-room-chat
lib/
  api.ts            # Axios → /api
  socket.ts         # Socket.IO client
stores/             # Zustand (auth, rooms)
components/ui/      # shadcn components
types/chat.ts       # Shared types
```

---

## Adding UI components

```bash
npx shadcn@latest add button
```

Components live in `components/ui`.

```tsx
import { Button } from "@/components/ui"
```

---

## Code conventions

See [`.cursorrules`](.cursorrules): page logic in local `_hooks`, Persian RTL UI, no unnecessary abstractions.

---

## License

UNLICENSED — private project.
