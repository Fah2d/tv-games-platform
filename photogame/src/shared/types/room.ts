export interface Player {
  id: string
  name: string
}

export interface RoomState {
  code: string
  players: Player[]
  hostId: string
  gameId: string
  started: boolean
}
