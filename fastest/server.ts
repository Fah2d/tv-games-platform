import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import next from 'next'
import {
  ROOM_CREATE, ROOM_JOIN, ROOM_LEAVE, ROOM_STATE, PLAYER_JOINED, PLAYER_LEFT, ROOM_ERROR,
  IMP_CREATE, IMP_JOIN, IMP_HOST_RECONNECT, IMP_RECONNECT,
  IMP_STATE, IMP_ERROR, IMP_WORD, IMP_START, IMP_VOTE,
  IMP_HOST_START_VOTING, IMP_HOST_NEXT, IMP_HOST_END, IMP_HOST_RESTART,
  FASTEST_CREATE, FASTEST_HOST_RECONNECT, FASTEST_RECONNECT,
  FASTEST_STATE, FASTEST_ERROR, FASTEST_START, FASTEST_BUZZ,
  FASTEST_HOST_AWARD, FASTEST_HOST_NEXT, FASTEST_HOST_END, FASTEST_HOST_RESTART,
} from './src/shared/socket/events'
import { getRandomWord } from './src/app/games/impostor/words'
import type {
  ImpPhase, ImpSettings, ImpPlayer, ImpVoteResult, ImpStatePayload,
} from './src/app/games/impostor/types'
import type {
  FastestPhase, FastestPlayer, FastestSettings, FastestStatePayload,
} from './src/app/games/fastest/types'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// ─── Standard lobby types ─────────────────────────────────────────────────────

interface Player { id: string; name: string }
interface Room {
  code: string
  hostSocketId: string
  gameId: string
  players: Player[]
  started: boolean
}

// ─── Impostor game state (server-private) ────────────────────────────────────

interface ImpGameState {
  roomCode: string
  hostSocketId: string
  phase: ImpPhase
  settings: ImpSettings
  players: ImpPlayer[]
  currentRound: number
  currentWord: string
  currentCategoryName: string
  impostorNames: string[]
  usedWords: Set<string>
  votes: Record<string, string>         // voterName → targetName
  scores: { innocents: number; impostors: number }
  voteResult: ImpVoteResult | null
  winner: 'innocents' | 'impostors' | null
  timerStartedAt: number | null
}

// ─── Impostor helpers ─────────────────────────────────────────────────────────

const impTimers = new Map<string, ReturnType<typeof setTimeout>>()

function clearImpTimer(roomCode: string) {
  const t = impTimers.get(roomCode)
  if (t) { clearTimeout(t); impTimers.delete(roomCode) }
}

function buildImpPayload(gs: ImpGameState): ImpStatePayload {
  const revealedImpostorNames: string[] =
    gs.phase === 'game_over'
      ? [...gs.impostorNames]
      : gs.phase === 'reveal' && gs.voteResult?.wasImpostor
        ? [gs.voteResult.eliminatedName]
        : []
  return {
    roomCode: gs.roomCode,
    phase: gs.phase,
    settings: gs.settings,
    players: gs.players,
    currentRound: gs.currentRound,
    currentCategoryName: gs.currentCategoryName,
    votes: gs.votes,
    scores: gs.scores,
    voteResult: gs.voteResult,
    winner: gs.winner,
    timerStartedAt: gs.timerStartedAt,
    revealedImpostorNames,
  }
}

function emitImpState(io: SocketIOServer, gs: ImpGameState) {
  io.to(gs.roomCode).emit(IMP_STATE, buildImpPayload(gs))
}

function sendImpWord(io: SocketIOServer, gs: ImpGameState) {
  for (const player of gs.players) {
    const sock = io.sockets.sockets.get(player.socketId)
    if (!sock) continue
    const isImpostor = gs.impostorNames.includes(player.name)
    sock.emit(IMP_WORD, {
      word: isImpostor ? null : gs.currentWord,
      isImpostor,
      categoryName: gs.currentCategoryName,
      roundNumber: gs.currentRound,
    })
  }
}

function startImpRound(io: SocketIOServer, gs: ImpGameState) {
  gs.currentRound++
  gs.votes = {}
  gs.voteResult = null
  for (const p of gs.players) p.hasVoted = false

  // Assign impostors (re-shuffled each round)
  const active = gs.players.filter((p) => !p.isEliminated)
  const shuffled = [...active].sort(() => Math.random() - 0.5)
  const num = Math.min(gs.settings.numImpostors, Math.max(1, active.length - 2))
  gs.impostorNames = shuffled.slice(0, num).map((p) => p.name)

  const { word, categoryName } = getRandomWord(gs.settings.categoryId, gs.usedWords)
  gs.usedWords.add(word)
  gs.currentWord = word
  gs.currentCategoryName = categoryName
  gs.timerStartedAt = null
  gs.phase = 'word_reveal'

  emitImpState(io, gs)
  sendImpWord(io, gs)

  // Auto-advance to discussion after 6s
  clearImpTimer(gs.roomCode)
  impTimers.set(gs.roomCode, setTimeout(() => {
    if (gs.phase !== 'word_reveal') return
    gs.phase = 'discussion'
    gs.timerStartedAt = gs.settings.timePerRound > 0 ? Date.now() : null
    emitImpState(io, gs)
    if (gs.settings.timePerRound > 0) {
      impTimers.set(gs.roomCode, setTimeout(() => {
        if (gs.phase !== 'discussion') return
        startImpVoting(io, gs)
      }, gs.settings.timePerRound * 1000))
    }
  }, 6000))
}

function startImpVoting(io: SocketIOServer, gs: ImpGameState) {
  clearImpTimer(gs.roomCode)
  gs.phase = 'voting'
  gs.timerStartedAt = null
  for (const p of gs.players) p.hasVoted = false
  gs.votes = {}
  emitImpState(io, gs)
}

function resolveImpVotes(io: SocketIOServer, gs: ImpGameState) {
  const voteCounts: Record<string, number> = {}
  for (const targetName of Object.values(gs.votes)) {
    voteCounts[targetName] = (voteCounts[targetName] ?? 0) + 1
  }

  let maxVotes = 0
  let candidates: string[] = []
  for (const [name, count] of Object.entries(voteCounts)) {
    if (count > maxVotes) { maxVotes = count; candidates = [name] }
    else if (count === maxVotes) candidates.push(name)
  }

  const eliminatedName = candidates[Math.floor(Math.random() * candidates.length)] ?? ''
  const eliminated = gs.players.find((p) => p.name === eliminatedName)
  if (eliminated) eliminated.isEliminated = true

  const wasImpostor = eliminatedName ? gs.impostorNames.includes(eliminatedName) : false
  if (wasImpostor) gs.scores.innocents++
  else gs.scores.impostors++

  gs.voteResult = {
    eliminatedName,
    wasImpostor,
    voteCounts,
    secretWord: gs.currentWord,
    categoryName: gs.currentCategoryName,
  }
  gs.phase = 'reveal'
  emitImpState(io, gs)

  // Auto-advance after 8s (host can also click manually)
  clearImpTimer(gs.roomCode)
  impTimers.set(gs.roomCode, setTimeout(() => {
    if (gs.phase !== 'reveal') return
    if (gs.currentRound >= gs.settings.totalRounds) {
      gs.phase = 'game_over'
      gs.winner = gs.scores.innocents >= gs.scores.impostors ? 'innocents' : 'impostors'
      emitImpState(io, gs)
    } else {
      startImpRound(io, gs)
    }
  }, 8000))
}

// ─── Fastest game state (server-side) ────────────────────────────────────────

interface FastestGameState {
  roomCode: string
  hostSocketId: string
  phase: FastestPhase
  settings: FastestSettings
  players: FastestPlayer[]
  currentQuestion: number
  buzzedPlayerName: string | null
  buzzTimestamp: number | null
  winner: string | null
}

function buildFastestPayload(gs: FastestGameState): FastestStatePayload {
  return {
    roomCode: gs.roomCode,
    phase: gs.phase,
    settings: gs.settings,
    players: gs.players,
    currentQuestion: gs.currentQuestion,
    buzzedPlayerName: gs.buzzedPlayerName,
    buzzTimestamp: gs.buzzTimestamp,
    winner: gs.winner,
  }
}

function emitFastestState(io: SocketIOServer, gs: FastestGameState) {
  io.to(gs.roomCode).emit(FASTEST_STATE, buildFastestPayload(gs))
}

// Advance to next question, awarding points to the buzzed player if any
function advanceFastestQuestion(io: SocketIOServer, gs: FastestGameState, points: number) {
  if (points > 0 && gs.buzzedPlayerName) {
    const p = gs.players.find((pl) => pl.name === gs.buzzedPlayerName)
    if (p) p.score += points
  }
  gs.buzzedPlayerName = null
  gs.buzzTimestamp = null
  gs.currentQuestion++

  if (gs.currentQuestion > gs.settings.totalQuestions) {
    gs.phase = 'finished'
    const sorted = [...gs.players].sort((a, b) => b.score - a.score)
    gs.winner = sorted[0]?.name ?? null
  } else {
    gs.phase = 'ready'
  }
  emitFastestState(io, gs)
}

// ─── Shared helper ────────────────────────────────────────────────────────────

function generateCode(existing: Map<string, unknown>): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return existing.has(code) ? generateCode(existing) : code
}

// ─── Server bootstrap ─────────────────────────────────────────────────────────

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res))
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  const rooms = new Map<string, Room>()
  const impRooms = new Map<string, ImpGameState>()
  const fastestRooms = new Map<string, FastestGameState>()

  io.on('connection', (socket) => {

    // ═══════════════════════════════════════════════════════════
    // Standard lobby
    // ═══════════════════════════════════════════════════════════

    socket.on(ROOM_CREATE, ({ gameId }: { gameId: string }) => {
      const code = generateCode(rooms)
      const room: Room = { code, hostSocketId: socket.id, gameId, players: [], started: false }
      rooms.set(code, room)
      socket.join(code)
      io.to(code).emit(ROOM_STATE, { code, players: [], hostId: socket.id, gameId, started: false })
    })

    socket.on(ROOM_JOIN, ({ code, playerName }: { code: string; playerName: string }) => {
      const uc = code.toUpperCase()
      const room = rooms.get(uc)
      if (!room) { socket.emit(ROOM_ERROR, { message: 'رمز الغرفة غير صحيح' }); return }
      if (room.started) { socket.emit(ROOM_ERROR, { message: 'اللعبة بدأت بالفعل' }); return }
      if (room.players.length >= 10) { socket.emit(ROOM_ERROR, { message: 'الغرفة ممتلئة' }); return }
      room.players.push({ id: socket.id, name: playerName })
      socket.join(uc)
      io.to(uc).emit(ROOM_STATE, { code: uc, players: room.players, hostId: room.hostSocketId, gameId: room.gameId, started: room.started })
      io.to(uc).emit(PLAYER_JOINED, { player: { id: socket.id, name: playerName } })
    })

    socket.on(ROOM_LEAVE, () => handleLeave(socket.id, rooms, io))

    // ═══════════════════════════════════════════════════════════
    // Impostor — room
    // ═══════════════════════════════════════════════════════════

    socket.on(IMP_CREATE, ({ settings }: { settings: ImpSettings }) => {
      // ── Change 1: validate maxPlayers + numImpostors ─────────────────────
      const maxPlayers = Math.min(Math.max(Math.floor(settings.maxPlayers) || 8, 3), 10)
      const maxAllowedImpostors = Math.max(1, maxPlayers - 2)
      const numImpostors = Math.min(Math.max(Math.floor(settings.numImpostors) || 1, 1), maxAllowedImpostors)

      // ── Change 2: timePerRound is now any seconds value, 0 = unlimited ───
      const timePerRound = settings.timePerRound > 0
        ? Math.min(Math.max(Math.floor(settings.timePerRound), 30), 600)
        : 0

      const s: ImpSettings = {
        maxPlayers,
        numImpostors,
        timePerRound,
        totalRounds: Math.min(Math.max(settings.totalRounds, 1), 20),
        categoryId: settings.categoryId || 'objects',
      }
      const code = generateCode(impRooms)
      const gs: ImpGameState = {
        roomCode: code, hostSocketId: socket.id, phase: 'lobby',
        settings: s, players: [], currentRound: 0,
        currentWord: '', currentCategoryName: '',
        impostorNames: [], usedWords: new Set(),
        votes: {}, scores: { innocents: 0, impostors: 0 },
        voteResult: null, winner: null, timerStartedAt: null,
      }
      impRooms.set(code, gs)
      socket.join(code)
      socket.emit(IMP_STATE, buildImpPayload(gs))
    })

    socket.on(IMP_HOST_RECONNECT, ({ roomCode }: { roomCode: string }) => {
      const gs = impRooms.get(roomCode)
      if (!gs) { socket.emit(IMP_ERROR, { message: 'الغرفة غير موجودة' }); return }
      gs.hostSocketId = socket.id
      socket.join(roomCode)
      socket.emit(IMP_STATE, buildImpPayload(gs))
    })

    socket.on(IMP_JOIN, ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
      const gs = impRooms.get(roomCode)
      if (!gs) { socket.emit(IMP_ERROR, { message: 'رمز الغرفة غير صحيح' }); return }
      if (gs.phase !== 'lobby') { socket.emit(IMP_ERROR, { message: 'اللعبة بدأت بالفعل' }); return }
      // ── Change 1: use maxPlayers from settings instead of hardcoded 10 ───
      if (gs.players.length >= gs.settings.maxPlayers) { socket.emit(IMP_ERROR, { message: 'الغرفة ممتلئة' }); return }
      const existing = gs.players.find((p) => p.name === playerName)
      if (existing) {
        existing.socketId = socket.id; existing.id = socket.id
      } else {
        gs.players.push({ id: socket.id, socketId: socket.id, name: playerName, isEliminated: false, hasVoted: false })
      }
      socket.join(roomCode)
      emitImpState(io, gs)
    })

    socket.on(IMP_RECONNECT, ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
      const gs = impRooms.get(roomCode)
      if (!gs) { socket.emit(IMP_ERROR, { message: 'الغرفة غير موجودة' }); return }
      const player = gs.players.find((p) => p.name === playerName)
      if (player) {
        player.socketId = socket.id; player.id = socket.id
        socket.join(roomCode)
        socket.emit(IMP_STATE, buildImpPayload(gs))
        if (gs.phase !== 'lobby' && gs.currentWord) {
          const isImpostor = gs.impostorNames.includes(playerName)
          socket.emit(IMP_WORD, {
            word: isImpostor ? null : gs.currentWord,
            isImpostor, categoryName: gs.currentCategoryName, roundNumber: gs.currentRound,
          })
        }
      } else {
        if (gs.phase !== 'lobby') { socket.emit(IMP_ERROR, { message: 'اللعبة بدأت بالفعل' }); return }
        if (gs.players.length >= gs.settings.maxPlayers) { socket.emit(IMP_ERROR, { message: 'الغرفة ممتلئة' }); return }
        gs.players.push({ id: socket.id, socketId: socket.id, name: playerName, isEliminated: false, hasVoted: false })
        socket.join(roomCode)
        emitImpState(io, gs)
      }
    })

    // ═══════════════════════════════════════════════════════════
    // Impostor — game
    // ═══════════════════════════════════════════════════════════

    function assertImpHost(roomCode: string): ImpGameState | null {
      const gs = impRooms.get(roomCode)
      if (!gs || gs.hostSocketId !== socket.id) return null
      return gs
    }

    socket.on(IMP_START, ({ roomCode }: { roomCode: string }) => {
      const gs = assertImpHost(roomCode); if (!gs) return
      if (gs.phase !== 'lobby') return
      if (gs.players.length < 3) {
        socket.emit(IMP_ERROR, { message: 'تحتاج على الأقل ٣ لاعبين' }); return
      }
      startImpRound(io, gs)
    })

    socket.on(IMP_HOST_START_VOTING, ({ roomCode }: { roomCode: string }) => {
      const gs = assertImpHost(roomCode); if (!gs) return
      if (gs.phase !== 'discussion') return
      startImpVoting(io, gs)
    })

    socket.on(IMP_VOTE, ({ roomCode, targetName }: { roomCode: string; targetName: string }) => {
      const gs = impRooms.get(roomCode)
      if (!gs || gs.phase !== 'voting') return
      const voter = gs.players.find((p) => p.socketId === socket.id)
      if (!voter || voter.isEliminated || voter.hasVoted) return
      if (voter.name === targetName) return
      const target = gs.players.find((p) => p.name === targetName && !p.isEliminated)
      if (!target) return
      gs.votes[voter.name] = targetName
      voter.hasVoted = true
      emitImpState(io, gs)
      const active = gs.players.filter((p) => !p.isEliminated)
      if (active.every((p) => p.hasVoted)) resolveImpVotes(io, gs)
    })

    socket.on(IMP_HOST_NEXT, ({ roomCode }: { roomCode: string }) => {
      const gs = assertImpHost(roomCode); if (!gs) return
      if (gs.phase !== 'reveal') return
      clearImpTimer(roomCode)
      if (gs.currentRound >= gs.settings.totalRounds) {
        gs.phase = 'game_over'
        gs.winner = gs.scores.innocents >= gs.scores.impostors ? 'innocents' : 'impostors'
        emitImpState(io, gs)
      } else {
        startImpRound(io, gs)
      }
    })

    socket.on(IMP_HOST_END, ({ roomCode }: { roomCode: string }) => {
      const gs = assertImpHost(roomCode); if (!gs) return
      clearImpTimer(roomCode)
      gs.phase = 'game_over'
      gs.winner = gs.scores.innocents >= gs.scores.impostors ? 'innocents' : 'impostors'
      emitImpState(io, gs)
    })

    socket.on(IMP_HOST_RESTART, ({ roomCode }: { roomCode: string }) => {
      const gs = assertImpHost(roomCode); if (!gs) return
      clearImpTimer(roomCode)
      gs.currentRound = 0
      gs.currentWord = ''; gs.currentCategoryName = ''
      gs.impostorNames = []; gs.usedWords = new Set()
      gs.votes = {}; gs.scores = { innocents: 0, impostors: 0 }
      gs.voteResult = null; gs.winner = null; gs.timerStartedAt = null
      for (const p of gs.players) { p.isEliminated = false; p.hasVoted = false }
      startImpRound(io, gs)
    })

    // ═══════════════════════════════════════════════════════════
    // Fastest — room
    // ═══════════════════════════════════════════════════════════

    function assertFastestHost(roomCode: string): FastestGameState | null {
      const gs = fastestRooms.get(roomCode)
      if (!gs || gs.hostSocketId !== socket.id) return null
      return gs
    }

    socket.on(FASTEST_CREATE, ({ settings: raw }: { settings: FastestSettings }) => {
      const totalQuestions = [5, 10, 15, 20].includes(raw.totalQuestions) ? raw.totalQuestions : 10
      const pointsPerCorrect = [5, 10, 15, 20].includes(raw.pointsPerCorrect) ? raw.pointsPerCorrect : 10
      const maxPlayers = Math.min(Math.max(Math.floor(raw.maxPlayers) || 8, 2), 8)

      const s: FastestSettings = { totalQuestions, pointsPerCorrect, maxPlayers }
      const code = generateCode(fastestRooms)
      const gs: FastestGameState = {
        roomCode: code, hostSocketId: socket.id, phase: 'lobby',
        settings: s, players: [], currentQuestion: 1,
        buzzedPlayerName: null, buzzTimestamp: null, winner: null,
      }
      fastestRooms.set(code, gs)
      socket.join(code)
      socket.emit(FASTEST_STATE, buildFastestPayload(gs))
    })

    socket.on(FASTEST_HOST_RECONNECT, ({ roomCode }: { roomCode: string }) => {
      const gs = fastestRooms.get(roomCode)
      if (!gs) { socket.emit(FASTEST_ERROR, { message: 'الغرفة غير موجودة' }); return }
      gs.hostSocketId = socket.id
      socket.join(roomCode)
      socket.emit(FASTEST_STATE, buildFastestPayload(gs))
    })

    // FASTEST_RECONNECT handles both first-join and reconnect
    socket.on(FASTEST_RECONNECT, ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
      const gs = fastestRooms.get(roomCode)
      if (!gs) { socket.emit(FASTEST_ERROR, { message: 'رمز الغرفة غير صحيح' }); return }

      const existing = gs.players.find((p) => p.name === playerName)
      if (existing) {
        existing.socketId = socket.id; existing.id = socket.id
        socket.join(roomCode)
        socket.emit(FASTEST_STATE, buildFastestPayload(gs))
      } else {
        if (gs.phase !== 'lobby') { socket.emit(FASTEST_ERROR, { message: 'اللعبة بدأت بالفعل' }); return }
        if (gs.players.length >= gs.settings.maxPlayers) { socket.emit(FASTEST_ERROR, { message: 'الغرفة ممتلئة' }); return }
        const colorIndex = gs.players.length % 8
        gs.players.push({ id: socket.id, socketId: socket.id, name: playerName, score: 0, colorIndex })
        socket.join(roomCode)
        emitFastestState(io, gs)
      }
    })

    // ═══════════════════════════════════════════════════════════
    // Fastest — game
    // ═══════════════════════════════════════════════════════════

    socket.on(FASTEST_START, ({ roomCode }: { roomCode: string }) => {
      const gs = assertFastestHost(roomCode); if (!gs) return
      if (gs.phase !== 'lobby') return
      if (gs.players.length < 1) { socket.emit(FASTEST_ERROR, { message: 'لا يوجد لاعبون في الغرفة' }); return }
      gs.phase = 'ready'
      gs.currentQuestion = 1
      gs.buzzedPlayerName = null
      gs.buzzTimestamp = null
      emitFastestState(io, gs)
    })

    socket.on(FASTEST_BUZZ, ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
      const gs = fastestRooms.get(roomCode)
      if (!gs) return
      if (gs.phase !== 'ready') return           // buzzers not open
      if (gs.buzzedPlayerName !== null) return    // someone already buzzed

      // Security: verify the socket owns this player slot
      const player = gs.players.find((p) => p.name === playerName && p.socketId === socket.id)
      if (!player) return

      // Server timestamp is the authoritative source of truth
      gs.buzzedPlayerName = playerName
      gs.buzzTimestamp = Date.now()
      gs.phase = 'buzzed'
      emitFastestState(io, gs)
    })

    socket.on(FASTEST_HOST_AWARD, ({ roomCode, points }: { roomCode: string; points: number }) => {
      const gs = assertFastestHost(roomCode); if (!gs) return
      if (gs.phase !== 'buzzed') return
      advanceFastestQuestion(io, gs, Math.max(0, Math.floor(points)))
    })

    socket.on(FASTEST_HOST_NEXT, ({ roomCode }: { roomCode: string }) => {
      const gs = assertFastestHost(roomCode); if (!gs) return
      if (gs.phase !== 'ready' && gs.phase !== 'buzzed') return
      advanceFastestQuestion(io, gs, 0)
    })

    socket.on(FASTEST_HOST_END, ({ roomCode }: { roomCode: string }) => {
      const gs = assertFastestHost(roomCode); if (!gs) return
      gs.phase = 'finished'
      gs.buzzedPlayerName = null
      gs.buzzTimestamp = null
      const sorted = [...gs.players].sort((a, b) => b.score - a.score)
      gs.winner = sorted[0]?.name ?? null
      emitFastestState(io, gs)
    })

    socket.on(FASTEST_HOST_RESTART, ({ roomCode }: { roomCode: string }) => {
      const gs = assertFastestHost(roomCode); if (!gs) return
      for (const p of gs.players) p.score = 0
      gs.currentQuestion = 1
      gs.buzzedPlayerName = null
      gs.buzzTimestamp = null
      gs.winner = null
      gs.phase = 'ready'
      emitFastestState(io, gs)
    })

    // ═══════════════════════════════════════════════════════════
    // Disconnect / leave
    // ═══════════════════════════════════════════════════════════

    socket.on('disconnect', () => {
      handleLeave(socket.id, rooms, io)
      handleImpLeave(socket.id, impRooms, io)
      handleFastestLeave(socket.id, fastestRooms)
    })
  })

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port} [${dev ? 'dev' : 'prod'}]`)
  })
})

// ─── Leave helpers ────────────────────────────────────────────────────────────

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
      io.to(code).emit(ROOM_STATE, { code: room.code, players: room.players, hostId: room.hostSocketId, gameId: room.gameId, started: room.started })
    }
  }
}

function handleImpLeave(socketId: string, impRooms: Map<string, ImpGameState>, io: SocketIOServer) {
  for (const gs of impRooms.values()) {
    if (gs.hostSocketId === socketId) { gs.hostSocketId = ''; continue }
    const player = gs.players.find((p) => p.socketId === socketId)
    if (!player || player.isEliminated) continue
    if (gs.phase === 'voting' && !player.hasVoted) {
      player.hasVoted = true
      emitImpState(io, gs)
      const active = gs.players.filter((p) => !p.isEliminated)
      if (active.every((p) => p.hasVoted)) resolveImpVotes(io, gs)
    }
  }
}

function handleFastestLeave(socketId: string, fastestRooms: Map<string, FastestGameState>) {
  for (const gs of fastestRooms.values()) {
    if (gs.hostSocketId === socketId) { gs.hostSocketId = ''; continue }
    // Players keep their slot on disconnect — they can reconnect and their score is preserved
  }
}
