export const ROOM_CREATE = 'ROOM_CREATE' as const
export const ROOM_JOIN = 'ROOM_JOIN' as const
export const ROOM_LEAVE = 'ROOM_LEAVE' as const
export const ROOM_STATE = 'ROOM_STATE' as const
export const PLAYER_JOINED = 'PLAYER_JOINED' as const
export const PLAYER_LEFT = 'PLAYER_LEFT' as const
export const ROOM_ERROR = 'ROOM_ERROR' as const

// Photo Game (لعبة الصور) — room lifecycle
export const PHOTO_CREATE = 'PHOTO_CREATE' as const
export const PHOTO_HOST_RECONNECT = 'PHOTO_HOST_RECONNECT' as const
export const PHOTO_RECONNECT = 'PHOTO_RECONNECT' as const
export const PHOTO_STATE = 'PHOTO_STATE' as const
export const PHOTO_ERROR = 'PHOTO_ERROR' as const
export const PHOTO_YOUR_PHOTO = 'PHOTO_YOUR_PHOTO' as const
export const PHOTO_REVEAL_PHOTO = 'PHOTO_REVEAL_PHOTO' as const

// Photo Game — game flow
export const PHOTO_START = 'PHOTO_START' as const

// Photo Game — host controls
export const PHOTO_HOST_REVEAL = 'PHOTO_HOST_REVEAL' as const
export const PHOTO_HOST_AWARD = 'PHOTO_HOST_AWARD' as const
export const PHOTO_HOST_NEXT = 'PHOTO_HOST_NEXT' as const
export const PHOTO_HOST_END = 'PHOTO_HOST_END' as const
export const PHOTO_HOST_RESTART = 'PHOTO_HOST_RESTART' as const
