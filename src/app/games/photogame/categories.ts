export interface PhotoCategory {
  id: string
  nameAr: string
  emoji: string
}

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  { id: 'animals', nameAr: 'حيوانات', emoji: '🐾' },
  { id: 'flags',   nameAr: 'أعلام',   emoji: '🏳️' },
  { id: 'foods',   nameAr: 'أكل',     emoji: '🍔' },
  { id: 'sport',   nameAr: 'رياضة',   emoji: '⚽' },
  { id: 'player',  nameAr: 'لاعبين',  emoji: '⭐' },
]

export const PHOTO_FILES: Record<string, string[]> = {
  animals: ['1.webp','2.jpeg','3.webp','4.jpg','5.png','6.jpg','7.jpg','8.jpg','9.webp','10.jpeg','11.webp','12.jpg','13.jpeg','14.webp','15.webp'],
  flags:   ['1.png','2.png','3.svg','4.webp','5.png','6.svg','7.webp','8.png','9.svg','11.png','12.png','13.svg','14.svg','15.png'],
  foods:   ['1.webp','2.jpg','3.jpg','4.jpg','5.webp','6.jpg','7.jpg','8.png','9.jpeg','10.jpg','11.webp','12.jpg','13.jpg','14.png','15.webp'],
  sport:   ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.webp','7.jpg','8.jpg','9.jpeg','10.jpeg','11.jpg'],
  player:  ['1.jpg','2.jpeg','3.jpg','4.jpg','5.jpg','6.png','7.jpg','8.jpg','9.webp','10.jpeg','11.jpg','12.jpg','13.jpg','14.jpeg','15.jpg'],
}

export function pickRandomPhoto(selectedCategories: string[], usedPhotos: Set<string>): string {
  const available: string[] = []
  for (const catId of selectedCategories) {
    const files = PHOTO_FILES[catId] ?? []
    for (const file of files) {
      const path = `/photogame/${catId}/${file}`
      if (!usedPhotos.has(path)) available.push(path)
    }
  }
  // If all used, reset and try again
  if (available.length === 0) {
    usedPhotos.clear()
    return pickRandomPhoto(selectedCategories, usedPhotos)
  }
  return available[Math.floor(Math.random() * available.length)]
}
