import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import next from 'next'
import {
  ROOM_CREATE,
  ROOM_JOIN,
  ROOM_LEAVE,
  ROOM_STATE,
  PLAYER_JOINED,
  PLAYER_LEFT,
  ROOM_ERROR,
  PHOTO_CREATE,
  PHOTO_HOST_RECONNECT,
  PHOTO_RECONNECT,
  PHOTO_STATE,
  PHOTO_ERROR,
  PHOTO_YOUR_PHOTO,
  PHOTO_REVEAL_PHOTO,
  PHOTO_START,
  PHOTO_HOST_REVEAL,
  PHOTO_HOST_AWARD,
  PHOTO_HOST_NEXT,
  PHOTO_HOST_END,
  PHOTO_HOST_RESTART,
} from './src/shared/socket/events'
import type { PhotoPhase, PhotoPlayer, PhotoSettings } from './src/app/games/photogame/types'
import { pickRandomPhoto } from './src/app/games/photogame/categories'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

interface Player {
  id: string
  name: string
}

interface Room {
  code: string
  hostSocketId: string
  gameId: string
  players: Player[]
  started: boolean
}

function generateCode(rooms: Map<string, Room>): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return rooms.has(code) ? generateCode(rooms) : code
}

function emitRoomState(io: SocketIOServer, room: Room) {
  io.to(room.code).emit(ROOM_STATE, {
    code: room.code,
    players: room.players,
    hostId: room.hostSocketId,
    gameId: room.gameId,
    started: room.started,
  })
}

// ── Photo Game state ─────────────────────────────────────────────────────────

interface PhotoGameState {
  roomCode: string
  hostSocketId: string
  phase: PhotoPhase
  settings: PhotoSettings
  players: PhotoPlayer[]
  currentRound: number
  winner: string | null
  usedPhotos: Set<string>
}

function generatePhotoCode(photoRooms: Map<string, PhotoGameState>): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return photoRooms.has(code) ? generatePhotoCode(photoRooms) : code
}

function emitPhotoState(io: SocketIOServer, state: PhotoGameState) {
  const payload = {
    roomCode: state.roomCode,
    phase: state.phase,
    settings: state.settings,
    currentRound: state.currentRound,
    winner: state.winner,
    players: state.players.map((p) => ({
      ...p,
      // hide assignedPhoto during playing so phones can't sniff it via broadcast
      assignedPhoto: state.phase === 'playing' ? null : p.assignedPhoto,
    })),
  }
  io.to(state.roomCode).emit(PHOTO_STATE, payload)
}

function assignPhotos(io: SocketIOServer, state: PhotoGameState) {
  const [p1, p2] = state.players
  const photo1 = pickRandomPhoto(state.settings.selectedCategories, state.usedPhotos)
  state.usedPhotos.add(photo1)
  const photo2 = pickRandomPhoto(state.settings.selectedCategories, state.usedPhotos)
  state.usedPhotos.add(photo2)

  p1.assignedPhoto = photo1
  p2.assignedPhoto = photo2

  // Send each player their OWN secret photo privately
  const sock1 = io.sockets.sockets.get(p1.socketId)
  const sock2 = io.sockets.sockets.get(p2.socketId)
  if (sock1) sock1.emit(PHOTO_YOUR_PHOTO, { photo: photo1 })
  if (sock2) sock2.emit(PHOTO_YOUR_PHOTO, { photo: photo2 })
}

function handlePhotoLeave(socketId: string, photoRooms: Map<string, PhotoGameState>, io: SocketIOServer) {
  for (const [code, state] of photoRooms.entries()) {
    if (state.hostSocketId !== socketId && !state.players.some((p) => p.socketId === socketId)) continue

    if (state.hostSocketId === socketId) {
      photoRooms.delete(code)
      io.to(code).emit(PHOTO_ERROR, { message: 'أنهى المضيف الغرفة' })
    } else {
      state.players = state.players.filter((p) => p.socketId !== socketId)
      emitPhotoState(io, state)
    }
  }
}

// ── App bootstrap ─────────────────────────────────────────────────────────────

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res)
  })

  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
  })

  const rooms = new Map<string, Room>()
  const photoRooms = new Map<string, PhotoGameState>()

  io.on('connection', (socket) => {

    // ── Photo Game handlers ───────────────────────────────────────────────────

    socket.on(PHOTO_CREATE, ({ settings }: { settings: PhotoSettings }) => {
      const code = generatePhotoCode(photoRooms)
      const state: PhotoGameState = {
        roomCode: code,
        hostSocketId: socket.id,
        phase: 'lobby',
        settings,
        players: [],
        currentRound: 0,
        winner: null,
        usedPhotos: new Set(),
      }
      photoRooms.set(code, state)
      socket.join(code)
      emitPhotoState(io, state)
    })

    socket.on(PHOTO_HOST_RECONNECT, ({ roomCode }: { roomCode: string }) => {
      const state = photoRooms.get(roomCode)
      if (!state) { socket.emit(PHOTO_ERROR, { message: 'الغرفة غير موجودة' }); return }
      state.hostSocketId = socket.id
      socket.join(roomCode)
      emitPhotoState(io, state)
    })

    socket.on(PHOTO_RECONNECT, ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
      const state = photoRooms.get(roomCode)
      if (!state) { socket.emit(PHOTO_ERROR, { message: 'الغرفة غير موجودة' }); return }

      const existing = state.players.find((p) => p.name === playerName)
      if (existing) {
        existing.socketId = socket.id
        socket.join(roomCode)
        emitPhotoState(io, state)
        if (state.phase === 'playing' && existing.assignedPhoto) {
          socket.emit(PHOTO_YOUR_PHOTO, { photo: existing.assignedPhoto })
        }
        return
      }

      if (state.phase !== 'lobby') { socket.emit(PHOTO_ERROR, { message: 'اللعبة بدأت بالفعل' }); return }
      if (state.players.length >= 2) { socket.emit(PHOTO_ERROR, { message: 'الغرفة ممتلئة' }); return }

      const player: PhotoPlayer = {
        id: `photo_${Date.now()}`,
        socketId: socket.id,
        name: playerName,
        score: 0,
        colorIndex: state.players.length,
        assignedPhoto: null,
      }
      state.players.push(player)
      socket.join(roomCode)
      emitPhotoState(io, state)
    })

    socket.on(PHOTO_START, ({ roomCode }: { roomCode: string }) => {
      const state = photoRooms.get(roomCode)
      if (!state || state.hostSocketId !== socket.id) return
      if (state.players.length < 2) { socket.emit(PHOTO_ERROR, { message: 'يجب وجود لاعبان' }); return }

      state.phase = 'playing'
      state.currentRound = 1
      assignPhotos(io, state)
      emitPhotoState(io, state)
    })

    socket.on(PHOTO_HOST_REVEAL, ({ roomCode }: { roomCode: string }) => {
      const state = photoRooms.get(roomCode)
      if (!state || state.hostSocketId !== socket.id) return
      if (state.phase !== 'playing') return

      state.phase = 'reveal'

      // Send each player the OTHER player's photo privately
      const [p1, p2] = state.players
      const sock1 = io.sockets.sockets.get(p1.socketId)
      const sock2 = io.sockets.sockets.get(p2.socketId)
      if (sock1 && p2.assignedPhoto) sock1.emit(PHOTO_REVEAL_PHOTO, { photo: p2.assignedPhoto })
      if (sock2 && p1.assignedPhoto) sock2.emit(PHOTO_REVEAL_PHOTO, { photo: p1.assignedPhoto })

      emitPhotoState(io, state)
    })

    socket.on(PHOTO_HOST_AWARD, ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
      const state = photoRooms.get(roomCode)
      if (!state || state.hostSocketId !== socket.id) return
      if (state.phase !== 'reveal') return

      const player = state.players.find((p) => p.name === playerName)
      if (player) player.score += 1

      advanceRound(io, state)
    })

    socket.on(PHOTO_HOST_NEXT, ({ roomCode }: { roomCode: string }) => {
      const state = photoRooms.get(roomCode)
      if (!state || state.hostSocketId !== socket.id) return
      if (state.phase !== 'reveal') return

      advanceRound(io, state)
    })

    socket.on(PHOTO_HOST_END, ({ roomCode }: { roomCode: string }) => {
      const state = photoRooms.get(roomCode)
      if (!state || state.hostSocketId !== socket.id) return

      finishGame(io, state)
    })

    socket.on(PHOTO_HOST_RESTART, ({ roomCode }: { roomCode: string }) => {
      const state = photoRooms.get(roomCode)
      if (!state || state.hostSocketId !== socket.id) return

      state.phase = 'lobby'
      state.currentRound = 0
      state.winner = null
      state.usedPhotos.clear()
      state.players.forEach((p) => { p.score = 0; p.assignedPhoto = null })
      emitPhotoState(io, state)
    })

    // ── Room handlers ─────────────────────────────────────────────────────────

    socket.on(ROOM_CREATE, ({ gameId }: { gameId: string }) => {
      const code = generateCode(rooms)
      const room: Room = {
        code,
        hostSocketId: socket.id,
        gameId,
        players: [],
        started: false,
      }
      rooms.set(code, room)
      socket.join(code)
      emitRoomState(io, room)
    })

    socket.on(ROOM_JOIN, ({ code, playerName }: { code: string; playerName: string }) => {
      const upperCode = code.toUpperCase()
      const room = rooms.get(upperCode)

      if (!room) {
        socket.emit(ROOM_ERROR, { message: 'رمز الغرفة غير صحيح' })
        return
      }
      if (room.started) {
        socket.emit(ROOM_ERROR, { message: 'اللعبة بدأت بالفعل' })
        return
      }
      if (room.players.length >= 10) {
        socket.emit(ROOM_ERROR, { message: 'الغرفة ممتلئة (الحد الأقصى ١٠ لاعبين)' })
        return
      }

      const player: Player = { id: socket.id, name: playerName }
      room.players.push(player)
      socket.join(upperCode)

      emitRoomState(io, room)
      io.to(upperCode).emit(PLAYER_JOINED, { player })
    })

    socket.on(ROOM_LEAVE, () => {
      handleLeave(socket.id, rooms, io)
    })

    socket.on('disconnect', () => {
      handleLeave(socket.id, rooms, io)
      handlePhotoLeave(socket.id, photoRooms, io)
    })
  })

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port} [${dev ? 'dev' : 'prod'}]`)
  })
})

function advanceRound(io: SocketIOServer, state: PhotoGameState) {
  if (state.currentRound >= state.settings.totalRounds) {
    finishGame(io, state)
    return
  }
  state.currentRound += 1
  state.phase = 'playing'
  state.players.forEach((p) => { p.assignedPhoto = null })
  assignPhotos(io, state)
  emitPhotoState(io, state)
}

function finishGame(io: SocketIOServer, state: PhotoGameState) {
  state.phase = 'finished'
  const sorted = [...state.players].sort((a, b) => b.score - a.score)
  state.winner = sorted[0]?.name ?? null
  emitPhotoState(io, state)
}

function handleLeave(socketId: string, rooms: Map<string, Room>, io: SocketIOServer) {
  for (const [code, room] of rooms.entries()) {
    const idx = room.players.findIndex((p) => p.id === socketId)
    if (idx === -1) continue

    const player = room.players[idx]
    room.players.splice(idx, 1)
    io.to(code).emit(PLAYER_LEFT, { playerId: socketId, playerName: player.name })

    if (room.hostSocketId === socketId) {
      rooms.delete(code)
      io.to(code).emit(ROOM_ERROR, { message: 'أنهى المضيف الغرفة' })
    } else {
      emitRoomState(io, room)
    }
  }
}
