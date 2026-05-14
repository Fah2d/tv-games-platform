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
} from './src/shared/socket/events'

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

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res)
  })

  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
  })

  const rooms = new Map<string, Room>()

  io.on('connection', (socket) => {
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
    })
  })

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port} [${dev ? 'dev' : 'prod'}]`)
  })
})

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
