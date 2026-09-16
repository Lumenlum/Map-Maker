export const themes = [
  { id: 'red', name: 'Ember', color: '#ff5c5c' },
  { id: 'orange', name: 'Solar', color: '#ff9f43' },
  { id: 'yellow', name: 'Gold', color: '#ffd166' },
  { id: 'green', name: 'Meadow', color: '#4dd599' },
  { id: 'blue', name: 'Ocean', color: '#54a0ff' },
  { id: 'indigo', name: 'Arcane', color: '#7c83fd' },
  { id: 'violet', name: 'Amethyst', color: '#c084fc' },
] as const

export type ThemeId = (typeof themes)[number]['id']
